import {
  BadgeCheck,
  Bell,
  Building2,
  Camera,
  CircleCheck,
  CircleUserRound,
  ClipboardList,
  Clock3,
  HandHelping,
  HeartHandshake,
  LifeBuoy,
  MapPin,
  Phone,
  Search,
  ScrollText,
  Send,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { HowIconKey } from '../types/howTypes';

/**
 * Icon lookup kept in a plain module so component files can stay fast-refresh
 * friendly (see react/only-export-components rule).
 */
export const HOW_ICONS: Record<HowIconKey, LucideIcon> = {
  report: ClipboardList,
  verify: BadgeCheck,
  claim: HandHelping,
  deliver: Truck,
  resolve: CircleCheck,
  phone: Phone,
  pin: MapPin,
  shield: ShieldCheck,
  people: CircleUserRound,
  volunteer: HeartHandshake,
  org: Building2,
  clock: Clock3,
  proof: Camera,
  audit: ScrollText,
  score: Star,
  notify: Bell,
  help: LifeBuoy,
  search: Search,
  send: Send,
};