import type { NeedType, ReportStatus, Urgency } from '../types';
import { NEED_TYPES, URGENCY_LEVELS } from '../types';

export { NEED_TYPES, URGENCY_LEVELS };

export const NEED_TYPE_META: Record<NeedType, { en: string; ne: string; emoji: string; color: string }> = {
  MEDICAL: { en: 'Medical', ne: 'स्वास्थ्य', emoji: '🩺', color: 'bg-critical/10 text-critical' },
  WATER: { en: 'Water', ne: 'पानी', emoji: '💧', color: 'bg-primary/10 text-primary' },
  FOOD: { en: 'Food', ne: 'खाना', emoji: '🍚', color: 'bg-warning/10 text-warning' },
  SHELTER: { en: 'Shelter', ne: 'आश्रय', emoji: '🏠', color: 'bg-secondary/10 text-secondary' },
  CLOTHING: { en: 'Clothing', ne: 'लता', emoji: '👕', color: 'bg-tertiary/10 text-tertiary' },
  RESCUE: { en: 'Rescue', ne: 'उद्धार', emoji: '🛟', color: 'bg-critical/15 text-critical' },
  MISSING_PERSON: { en: 'Missing Person', ne: 'बेपत्ता', emoji: '🔍', color: 'bg-ink/10 text-ink' },
  EVACUATION: { en: 'Evacuation', ne: 'स्थानान्तरण', emoji: '🚚', color: 'bg-warning/15 text-warning' },
  OTHER: { en: 'Other', ne: 'अन्य', emoji: '📦', color: 'bg-muted/10 text-muted' },
};

export const URGENCY_META: Record<Urgency, { classes: string; dot: string }> = {
  CRITICAL: { classes: 'bg-critical/10 text-critical border-critical/30', dot: 'bg-critical' },
  HIGH: { classes: 'bg-warning/10 text-warning border-warning/30', dot: 'bg-warning' },
  MEDIUM: { classes: 'bg-primary/10 text-primary border-primary/30', dot: 'bg-primary' },
  LOW: { classes: 'bg-success/10 text-success border-success/30', dot: 'bg-success' },
};

export const STATUS_META: Record<ReportStatus, { classes: string }> = {
  PENDING: { classes: 'bg-warning/10 text-warning border-warning/30' },
  VERIFIED: { classes: 'bg-primary/10 text-primary border-primary/30' },
  REJECTED: { classes: 'bg-critical/10 text-critical border-critical/30' },
  CLAIMED: { classes: 'bg-tertiary/10 text-tertiary border-tertiary/30' },
  IN_PROGRESS: { classes: 'bg-secondary/10 text-secondary border-secondary/30' },
  RESOLVED: { classes: 'bg-success/10 text-success border-success/30' },
  CANCELLED: { classes: 'bg-muted/10 text-muted border-muted/30' },
};

export const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim',
] as const;

export const DISTRICTS: Record<string, string[]> = {
  Koshi: ['Morang', 'Sunsari', 'Jhapa', 'Udayapur'],
  Madhesh: ['Sarlahi', 'Mahottari', 'Bara', 'Rautahat'],
  Bagmati: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Sindhupalchok', 'Nuwakot', 'Chitwan'],
  Gandaki: ['Kaski', 'Gorkha', 'Lamjung', 'Syangja'],
  Lumbini: ['Rupandehi', 'Kapilvastu', 'Palpa', 'Banke'],
  Karnali: ['Surkhet', 'Dailekh', 'Jumla'],
  Sudurpashchim: ['Kailali', 'Kanchanpur', 'Doti'],
};
