import type { ServiceIconKey } from '../types/servicesTypes';
import { SERVICE_ICONS } from '../utils/serviceIcons';

export function ServiceIcon({
  name,
  size = 16,
  className,
}: {
  name: ServiceIconKey;
  size?: number;
  className?: string;
}) {
  const Icon = SERVICE_ICONS[name];
  return <Icon size={size} className={className} aria-hidden />;
}