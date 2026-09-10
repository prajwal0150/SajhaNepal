export type ResourceCategory = 'GUIDES' | 'SAFETY' | 'FORMS' | 'TRAINING';

export type ResourceIconKey =
  | 'guide'
  | 'checklist'
  | 'video'
  | 'form'
  | 'safety'
  | 'helpline'
  | 'firstaid'
  | 'kit'
  | 'water'
  | 'shelter'
  | 'download'
  | 'plan'
  | 'community'
  | 'report';

export type ResourceFormat = 'article' | 'video' | 'checklist' | 'form' | 'contact';

export interface ResourceCta {
  label: string;
  to: string;
}

export interface Resource {
  _id: string;
  title: string;
  ne: string;
  description: string;
  icon: ResourceIconKey;
  cta: ResourceCta;
  category: ResourceCategory;
  format: ResourceFormat;
  /** short detail shown on the card, e.g. "5 min read" or "PDF · 1 page" */
  meta: string;
  tags: string[];
  popular?: boolean;
  /** tailwind classes for the icon bubble */
  tint: string;
  /** tailwind classes for the CTA button */
  accent: string;
}

export interface ResourceCategoryMeta {
  id: ResourceCategory;
  label: string;
  description: string;
}

export interface ResourcesStats {
  guides: number;
  downloads: number;
  languages: number;
  hotlines: number;
}

export interface ResourcesData {
  categories: ResourceCategoryMeta[];
  resources: Resource[];
  stats: ResourcesStats;
  isDemo: boolean;
}