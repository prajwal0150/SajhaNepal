import type { NeedType, Urgency, ReportStatus } from '@shared/types';

export interface LandingStats {
  criticalNeeds: number;
  verifiedNeeds: number;
  activeResponses: number;
  availableShelters: number;
}

export interface LandingNeed {
  _id: string;
  title: string;
  needType: NeedType;
  urgency: Urgency;
  district: string;
  ward?: number;
  affectedPeople: number;
  createdAt: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'IN_PROGRESS';
  status: ReportStatus;
}

export interface LandingShelter {
  _id: string;
  name: string;
  district: string;
  capacity: number;
  currentOccupancy: number;
  status: 'AVAILABLE' | 'LIMITED' | 'FULL';
}

export interface LandingData {
  stats: LandingStats;
  needs: LandingNeed[];
  shelters: LandingShelter[];
  isDemo: boolean;
}

export interface LandingFilters {
  search: string;
  needType: string;
  urgency: string;
  district: string;
}

