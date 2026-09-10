import {
  Backpack,
  BookOpen,
  ClipboardList,
  Cross,
  Download,
  Droplets,
  FileText,
  Home,
  ListChecks,
  PenLine,
  Phone,
  Play,
  Siren,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ResourceIconKey } from '../types/resourcesTypes';

/**
 * Icon lookup kept in a plain module so component files can stay fast-refresh
 * friendly (see react/only-export-components rule).
 */
export const RESOURCE_ICONS: Record<ResourceIconKey, LucideIcon> = {
  guide: BookOpen,
  checklist: ListChecks,
  video: Play,
  form: FileText,
  safety: Siren,
  helpline: Phone,
  firstaid: Cross,
  kit: Backpack,
  water: Droplets,
  shelter: Home,
  download: Download,
  plan: ClipboardList,
  community: Users,
  report: PenLine,
};