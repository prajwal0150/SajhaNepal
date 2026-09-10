import {
  BadgeCheck,
  Building2,
  ClipboardList,
  Gift,
  HandHelping,
  Home,
  Landmark,
  Map as MapIcon,
  PenLine,
  Route,
  Search,
  Siren,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceIconKey } from '../types/servicesTypes';

/**
 * Icon lookup kept in a plain module so component files can stay fast-refresh
 * friendly (see react/only-export-components rule).
 */
export const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  report: PenLine,
  map: MapIcon,
  shelter: Home,
  missing: Search,
  emergency: Siren,
  volunteer: HandHelping,
  verify: BadgeCheck,
  reports: ClipboardList,
  track: Route,
  ngo: Building2,
  government: Landmark,
  donate: Gift,
  warehouse: Warehouse,
};