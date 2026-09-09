import { URGENCY_KEYWORDS, Urgency, NeedType } from './report.types';

/**
 * UrgencyEngine — automatic urgency classification from title/description/needType.
 * Human volunteer verification may override the automatic classification.
 */
export function classifyUrgency(input: {
  title: string;
  description: string;
  needType: NeedType;
}): Urgency {
  const text = `${input.title} ${input.description}`.toLowerCase();

  const matches = (keywords: string[]) => keywords.some((k) => text.includes(k));

  const criticalNeedTypes: NeedType[] = ['MEDICAL', 'RESCUE', 'MISSING_PERSON'];
  if (criticalNeedTypes.includes(input.needType) || matches(URGENCY_KEYWORDS.CRITICAL)) {
    return 'CRITICAL';
  }
  if (input.needType === 'EVACUATION' || matches(URGENCY_KEYWORDS.HIGH)) {
    return 'HIGH';
  }
  if (matches(URGENCY_KEYWORDS.MEDIUM)) {
    return 'MEDIUM';
  }
  if (matches(URGENCY_KEYWORDS.LOW)) {
    return 'LOW';
  }
  return 'MEDIUM';
}
