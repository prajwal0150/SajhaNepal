import type { LandingData } from '../types/landingTypes';
import type { Report, ReliefSite } from '@shared/types';
import { api } from '@shared/lib/axios';
import { demoLandingData } from '../utils/demoLanding';

function toLandingData(reports: Report[], sites: ReliefSite[], isDemo: boolean): LandingData {
  const needs = reports.slice(0, 5).map((r) => ({
    _id: r._id,
    title: r.title,
    needType: r.needType,
    urgency: r.urgency,
    district: r.district,
    ward: r.ward,
    affectedPeople: r.affectedPeople ?? 0,
    createdAt: r.createdAt,
    verificationStatus: (r.verificationStatus === 'VERIFIED'
      ? 'VERIFIED'
      : r.status === 'IN_PROGRESS' || r.status === 'CLAIMED'
        ? 'IN_PROGRESS'
        : 'PENDING') as LandingData['needs'][number]['verificationStatus'],
    status: r.status,
  }));

  const shelters = sites.slice(0, 3).map((s) => ({
    _id: s._id,
    name: s.name,
    district: s.district ?? '',
    capacity: s.capacity ?? 0,
    currentOccupancy: s.currentOccupancy ?? 0,
    status: (s.status === 'FULL' ? 'FULL' : s.capacity > 0 && s.currentOccupancy / s.capacity > 0.85 ? 'LIMITED' : 'AVAILABLE') as LandingData['shelters'][number]['status'],
  }));

  const critical = reports.filter((r) => r.urgency === 'CRITICAL').length;
  const verified = reports.filter((r) => r.verificationStatus === 'VERIFIED' || r.status !== 'PENDING').length;

  return {
    stats: {
      criticalNeeds: critical || demoLandingData.stats.criticalNeeds,
      verifiedNeeds: verified || demoLandingData.stats.verifiedNeeds,
      activeResponses: demoLandingData.stats.activeResponses,
      availableShelters: sites.length || demoLandingData.stats.availableShelters,
    },
    needs: needs.length ? needs : demoLandingData.needs,
    shelters: shelters.length ? shelters : demoLandingData.shelters,
    isDemo: needs.length === 0 && shelters.length === 0 ? true : isDemo,
  };
}

export async function fetchLandingData(): Promise<LandingData> {
  try {
    const [reportsRes, sitesRes] = await Promise.allSettled([
      api.get('/reports', { params: { limit: 6 } }),
      api.get('/relief-sites', { params: { siteType: 'SHELTER', limit: 6 } }),
    ]);

    const reports: Report[] =
      reportsRes.status === 'fulfilled'
        ? ((reportsRes.value.data?.data as Report[]) ?? [])
        : [];
    const sites: ReliefSite[] =
      sitesRes.status === 'fulfilled'
        ? ((sitesRes.value.data?.data as ReliefSite[]) ?? [])
        : [];

    if (!reports.length && !sites.length) return demoLandingData;
    return toLandingData(reports, sites, false);
  } catch {
    return demoLandingData;
  }
}

