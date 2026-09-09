import { Report } from './report.model';

export interface FraudAssessment {
  duplicateScore: number;
  fraudScore: number;
  flags: string[];
}

/**
 * Heuristic fraud/duplicate detection.
 * Signals: same contact + identical title, nearby coordinates, rapid submissions,
 * copy-pasted long text, repeated rejected reports.
 * Never auto-deletes — flags for moderation.
 */
export async function assessFraud(input: {
  title: string;
  description: string;
  reporterContact?: string;
  reporter?: string;
  coordinates: [number, number];
  needType: string;
}): Promise<FraudAssessment> {
  const flags: string[] = [];
  let duplicateScore = 0;
  let fraudScore = 0;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const contactFilter = input.reporterContact
    ? { reporterContact: input.reporterContact }
    : input.reporter
      ? { reporter: input.reporter }
      : null;

  if (contactFilter) {
    const [recentSameTitle, recentCount, rejectedCount] = await Promise.all([
      Report.countDocuments({
        ...contactFilter,
        title: input.title.trim(),
        createdAt: { $gte: since },
      }),
      Report.countDocuments({ ...contactFilter, createdAt: { $gte: since } }),
      Report.countDocuments({ ...contactFilter, status: 'REJECTED' }),
    ]);

    if (recentSameTitle > 0) {
      duplicateScore += 50;
      flags.push('DUPLICATE_TITLE_24H');
    }
    if (recentCount >= 5) {
      duplicateScore += 25;
      flags.push('RAPID_SUBMISSIONS');
    }
    if (recentCount >= 3) {
      duplicateScore += 15;
      flags.push('REPEATED_CONTACT');
    }
    if (rejectedCount >= 3) {
      fraudScore += 30;
      flags.push('REPEATED_REJECTIONS');
    }
  }

  // Similar coordinates within ~150m with same need type in 24h
  // ($geoWithin/$centerSphere works inside countDocuments; $near does not)
  const [lng, lat] = input.coordinates;
  const nearbySameNeed = await Report.countDocuments({
    needType: input.needType,
    createdAt: { $gte: since },
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], 150 / 6378.1],
      },
    },
  });
  if (nearbySameNeed > 0) {
    duplicateScore += 20;
    flags.push('SIMILAR_COORDINATE_REPORT');
  }

  // Copy-pasted text heuristic: very long word repetition
  const words = input.description.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length >= 30 && new Set(words).size / words.length < 0.35) {
    fraudScore += 20;
    flags.push('POSSIBLE_COPY_PASTE');
  }

  return {
    duplicateScore: Math.min(100, duplicateScore),
    fraudScore: Math.min(100, fraudScore),
    flags,
  };
}
