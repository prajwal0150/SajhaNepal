import { Organization } from '../organizations/organization.model';

/**
 * TrustScoreService — server-side only. Frontend cannot modify trust score.
 * Factors: verified reports, successful claims, resolved reports, proof-of-delivery rate,
 * rejected reports, flagged reports.
 */
export class TrustScoreService {
  static async updateOrganizationTrust(organizationId: string): Promise<number | null> {
    const { Report } = await import('../reports/report.model');
    const { Delivery } = await import('../deliveries/delivery.model');

    const [resolved, claimed, rejected, flagged, deliveries] = await Promise.all([
      Report.countDocuments({ claimedBy: organizationId, status: 'RESOLVED' }),
      Report.countDocuments({ claimedBy: organizationId }),
      Report.countDocuments({ claimedBy: organizationId, status: 'REJECTED' }),
      Report.countDocuments({ claimedBy: organizationId, verificationStatus: 'FLAGGED' }),
      Delivery.countDocuments({ organization: organizationId, 'proofImages.0': { $exists: true } }),
    ]);

    const totalDeliveries = await Delivery.countDocuments({ organization: organizationId });
    const proofRate = totalDeliveries > 0 ? deliveries / totalDeliveries : 0.5;
    const resolutionRate = claimed > 0 ? resolved / claimed : 0;

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          40 * resolutionRate + 30 * proofRate + Math.min(20, resolved * 2) - rejected * 3 - flagged * 5 + 20,
        ),
      ),
    );

    await Organization.updateOne({ _id: organizationId }, { $set: { trustScore: score } });
    return score;
  }
}
