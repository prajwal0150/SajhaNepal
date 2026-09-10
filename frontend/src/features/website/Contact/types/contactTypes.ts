export type ContactChannelType =
  | 'hotline'
  | 'email'
  | 'visit'
  | 'social';

export type ContactCategory =
  | 'need'
  | 'volunteer'
  | 'ngo'
  | 'government'
  | 'general';

export type ContactIconKey =
  | 'hotline'
  | 'email'
  | 'map'
  | 'social'
  | 'shield'
  | 'check'
  | 'send'
  | 'pen'
  | 'clock'
  | 'phone';

export interface ContactChannel {
  _id: string;
  type: ContactChannelType;
  icon: ContactIconKey;
  title: string;
  ne: string;
  description: string;
  neDescription: string;
  detail: string;
  /** chromatic tint for the icon bubble */
  tint: string;
  /** extra meta chips rendered under the card */
  meta: string[];
  to?: string;
  href?: string;
}

export interface ContactForm {
  name: string;
  /** either phone or email — we accept either so offline users can still reach us */
  contact: string;
  category: ContactCategory;
  message: string;
}

export interface ContactStats {
  provinces: number;
  districts: number;
  languages: number;
  responseWithin: string;
}

export interface ContactData {
  channels: ContactChannel[];
  stats: ContactStats;
  isDemo: boolean;
}
