export type HowAudience = 'PEOPLE' | 'VOLUNTEERS' | 'ORGANIZATIONS';

export type HowIconKey =
  | 'report'
  | 'verify'
  | 'claim'
  | 'deliver'
  | 'resolve'
  | 'phone'
  | 'pin'
  | 'shield'
  | 'people'
  | 'volunteer'
  | 'org'
  | 'clock'
  | 'proof'
  | 'audit'
  | 'score'
  | 'notify'
  | 'help'
  | 'search'
  | 'send';

export interface HowStep {
  _id: string;
  /** two-digit order number, e.g. "01" */
  step: string;
  title: string;
  ne: string;
  description: string;
  /** progress hint shown on the card, e.g. "In minutes" */
  timeline: string;
  /** key actions that happen during this step */
  actions: string[];
  icon: HowIconKey;
  /** tailwind classes for the icon bubble */
  tint: string;
}

export interface HowRole {
  _id: string;
  audience: HowAudience;
  title: string;
  ne: string;
  description: string;
  icon: HowIconKey;
  tint: string;
  /** tailwind classes for the CTA button */
  btn: string;
  cta: string;
  to: string;
  /** role-specific mini flow */
  steps: string[];
}

export interface HowVerifyPoint {
  _id: string;
  title: string;
  ne: string;
  description: string;
  icon: HowIconKey;
  /** tailwind classes for the icon bubble */
  tint: string;
}

export interface HowStats {
  provinces: number;
  districts: number;
  avgVerifyMinutes: number;
  avgResolveDays: number;
  proofRate: number;
}

export interface HowData {
  stats: HowStats;
  steps: HowStep[];
  roles: HowRole[];
  verifyPoints: HowVerifyPoint[];
  isDemo: boolean;
}