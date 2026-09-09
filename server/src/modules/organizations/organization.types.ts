export const ORG_TYPES = [
  'NGO',
  'INGO',
  'GOVERNMENT_AGENCY',
  'LOCAL_GOVERNMENT',
  'COMMUNITY_GROUP',
  'OTHER',
] as const;
export type OrganizationType = (typeof ORG_TYPES)[number];

export const ORG_VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'] as const;
export type OrgVerificationStatus = (typeof ORG_VERIFICATION_STATUSES)[number];
