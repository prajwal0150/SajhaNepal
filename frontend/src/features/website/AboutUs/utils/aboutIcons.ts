import {
  Building2,
  CircleUserRound,
  Clock3,
  Droplets,
  Eye,
  Globe,
  HandHelping,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Mountain,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { AboutIconKey } from '../types/aboutTypes';

/**
 * Icon lookup kept in a plain module so component files can stay fast-refresh
 * friendly (see react/only-export-components rule).
 */
export const ABOUT_ICONS: Record<AboutIconKey, LucideIcon> = {
  mission: Target,
  vision: Eye,
  people: CircleUserRound,
  volunteer: HandHelping,
  org: Building2,
  speed: Clock3,
  transparency: Eye,
  inclusive: Users,
  local: MapPin,
  accountable: ShieldCheck,
  open: Globe,
  founding: Mountain,
  pilot: Rocket,
  monsoon: Droplets,
  launch: Sparkles,
  coordinate: Handshake,
  tech: Lightbulb,
  outreach: Quote,
  partner: HeartHandshake,
};