export const USER_ROLES = ['CITIZEN', 'VOLUNTEER', 'NGO', 'GOVERNMENT', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PUBLIC_PROFILE_FIELDS =
  'fullName avatar role district province isVerified createdAt';
