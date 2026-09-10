import {
  MapPin,
  Mail,
  PhoneCall,
  ShieldCheck,
  Share2,
  Clock,
  Check,
  Send,
  type LucideIcon,
} from 'lucide-react';
import type { ContactIconKey } from '../types/contactTypes';

/**
 * Icon lookup kept in a plain module so component files can stay fast-refresh
 * friendly (consistent with AboutIcon / ServiceIcon / HowIcon).
 */
export const CONTACT_ICONS: Record<ContactIconKey, LucideIcon> = {
  hotline: PhoneCall,
  email: Mail,
  map: MapPin,
  social: Share2,
  shield: ShieldCheck,
  check: Check,
  send: Send,
  pen: Send,
  clock: Clock,
  phone: PhoneCall,
};
