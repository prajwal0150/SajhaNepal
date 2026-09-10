export type ServiceCategory = 'FOR_PEOPLE' | 'FOR_VOLUNTEERS' | 'FOR_ORGANIZATIONS';

export type ServiceIconKey =
  | 'report'
  | 'map'
  | 'shelter'
  | 'missing'
  | 'emergency'
  | 'volunteer'
  | 'verify'
  | 'reports'
  | 'track'
  | 'ngo'
  | 'government'
  | 'donate'
  | 'warehouse';

export interface ServiceCta {
  label: string;
  to: string;
}

export interface Service {
  _id: string;
  title: string;
  ne: string;
  description: string;
  features: string[];
  icon: ServiceIconKey;
  cta: ServiceCta;
  category: ServiceCategory;
  popular?: boolean;
  /** tailwind classes for the icon bubble */
  tint: string;
  /** tailwind classes for the CTA button */
  accent: string;
}

export interface ServiceCategoryMeta {
  id: ServiceCategory;
  label: string;
  description: string;
}

export interface ServicesStats {
  provinces: number;
  districts: number;
  volunteers: number;
  needsVerified: number;
  shelters: number;
}

export interface ServicesData {
  categories: ServiceCategoryMeta[];
  services: Service[];
  stats: ServicesStats;
  isDemo: boolean;
}