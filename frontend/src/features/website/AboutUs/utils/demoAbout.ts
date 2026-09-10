import type { AboutData, AboutMilestone, AboutStats, AboutTeamMember, AboutValue } from '../types/aboutTypes';

export const demoAboutStats: AboutStats = {
  provinces: 7,
  districts: 77,
  volunteers: 12500,
  needsResolved: 2840,
  partnerOrgs: 120,
};

export const demoAboutValues: AboutValue[] = [
  {
    _id: 'val-speed',
    title: 'Speed',
    ne: 'छिटोपन',
    description: 'Needs become visible in minutes, not days. When every hour counts, our flow is built to move fast.',
    icon: 'speed',
    tint: 'bg-primary/10 text-primary',
  },
  {
    _id: 'val-transparency',
    title: 'Transparency',
    ne: 'पारदर्शिता',
    description: 'Every report, claim and delivery is public and auditable — from the first call to the final proof.',
    icon: 'transparency',
    tint: 'bg-tertiary/10 text-tertiary',
  },
  {
    _id: 'val-inclusive',
    title: 'Inclusivity',
    ne: 'समावेशिता',
    description: 'Works offline and in English and Nepali, so remote communities are never left behind.',
    icon: 'inclusive',
    tint: 'bg-success/10 text-success',
  },
  {
    _id: 'val-local',
    title: 'Local first',
    ne: 'स्थानीय प्राथमिकता',
    description: 'People who know the neighbourhood verify the needs and coordinate the response on the ground.',
    icon: 'local',
    tint: 'bg-secondary/10 text-secondary',
  },
  {
    _id: 'val-accountable',
    title: 'Accountability',
    ne: 'जवाफदेहिता',
    description: 'Photo proof, receipts and trust scores make sure the help truly arrives where it is needed.',
    icon: 'accountable',
    tint: 'bg-critical/10 text-critical',
  },
  {
    _id: 'val-open',
    title: 'Open & free',
    ne: 'खुला र निःशुल्क',
    description: 'All core services are free for every citizen and every responder in Nepal — now and always.',
    icon: 'open',
    tint: 'bg-warning/10 text-warning',
  },
];

export const demoAboutMilestones: AboutMilestone[] = [
  {
    _id: 'ms-2015',
    year: '2015',
    title: 'The lesson',
    ne: 'भूकम्पको पाठ',
    description: 'The Gorkha earthquake showed how scattered calls and spreadsheets slow relief when every minute counts.',
    icon: 'founding',
    tint: 'bg-critical/10 text-critical',
  },
  {
    _id: 'ms-2023',
    year: '2023',
    title: 'The idea is born',
    ne: 'विचारको शुरुवात',
    description: 'Volunteers, developers and responders come together to design one shared, verified platform for relief.',
    icon: 'pilot',
    tint: 'bg-primary/10 text-primary',
  },
  {
    _id: 'ms-2024',
    year: '2024',
    title: 'First pilots',
    ne: 'पहिलो परीक्षण',
    description: 'Kathmandu volunteer networks and partner NGOs pilot need verification and claims on the ground.',
    icon: 'tech',
    tint: 'bg-secondary/10 text-secondary',
  },
  {
    _id: 'ms-2025',
    year: '2025',
    title: 'Monsoon response',
    ne: 'मनसुन प्रतिक्रिया',
    description: 'During the monsoon floods the platform coordinates shelters, needs and deliveries across affected districts.',
    icon: 'monsoon',
    tint: 'bg-warning/10 text-warning',
  },
  {
    _id: 'ms-2026',
    year: '2026',
    title: 'Open to all of Nepal',
    ne: 'सबैका लागि साझा राहत',
    description: 'Saajha Rahat goes fully public — free for every citizen, volunteer and organization in the country.',
    icon: 'launch',
    tint: 'bg-success/10 text-success',
  },
];

export const demoAboutTeam: AboutTeamMember[] = [
  {
    _id: 'tm-coordination',
    role: 'Coordination & Operations',
    description: 'Field teams, district dashboards and the daily rhythm of the response.',
    initials: 'CO',
    icon: 'coordinate',
    tint: 'bg-primary/10 text-primary',
  },
  {
    _id: 'tm-engineering',
    role: 'Engineering & Data',
    description: 'Maps, offline sync, verification tools and the infrastructure behind them.',
    initials: 'ED',
    icon: 'tech',
    tint: 'bg-secondary/10 text-secondary',
  },
  {
    _id: 'tm-outreach',
    role: 'Community Outreach',
    description: 'Volunteer training, helplines and guidance in Nepali and English.',
    initials: 'OC',
    icon: 'outreach',
    tint: 'bg-success/10 text-success',
  },
  {
    _id: 'tm-partnerships',
    role: 'Partnerships & Government',
    description: 'NGO claims, government access and the partner network across Nepal.',
    initials: 'PG',
    icon: 'partner',
    tint: 'bg-tertiary/10 text-tertiary',
  },
];

export const demoAboutData: AboutData = {
  stats: demoAboutStats,
  values: demoAboutValues,
  milestones: demoAboutMilestones,
  team: demoAboutTeam,
  isDemo: true,
};