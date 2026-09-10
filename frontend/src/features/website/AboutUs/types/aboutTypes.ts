export type AboutAudienceKey = 'PEOPLE' | 'VOLUNTEERS' | 'ORGANIZATIONS';

export type AboutIconKey =
  | 'mission'
  | 'vision'
  | 'people'
  | 'volunteer'
  | 'org'
  | 'speed'
  | 'transparency'
  | 'inclusive'
  | 'local'
  | 'accountable'
  | 'open'
  | 'founding'
  | 'pilot'
  | 'monsoon'
  | 'launch'
  | 'coordinate'
  | 'tech'
  | 'outreach'
  | 'partner';

export interface AboutStats {
  provinces: number;
  districts: number;
  volunteers: number;
  needsResolved: number;
  partnerOrgs: number;
}

export interface AboutValue {
  _id: string;
  title: string;
  ne: string;
  description: string;
  icon: AboutIconKey;
  /** tailwind classes for the icon bubble */
  tint: string;
}

export interface AboutMilestone {
  _id: string;
  year: string;
  title: string;
  ne: string;
  description: string;
  icon: AboutIconKey;
  /** tailwind classes for the icon bubble */
  tint: string;
}

export interface AboutTeamMember {
  _id: string;
  role: string;
  description: string;
  initials: string;
  icon: AboutIconKey;
  /** tailwind classes for the avatar bubble */
  tint: string;
}

export interface AboutData {
  stats: AboutStats;
  values: AboutValue[];
  milestones: AboutMilestone[];
  team: AboutTeamMember[];
  isDemo: boolean;
}