import { CONTACT_ICONS } from '../utils/contactIcons';
import type { ContactIconKey } from '../types/contactTypes';
import type { LucideIcon } from 'lucide-react';

export function ContactIcon({ name, size = 16 }: { name: ContactIconKey; size?: number }) {
  const Icon = CONTACT_ICONS[name] as LucideIcon | undefined;
  if (!Icon) return null;
  return <Icon size={size} aria-hidden />;
}
