import type { ResourceIconKey } from '../types/resourcesTypes';
import { RESOURCE_ICONS } from '../utils/resourceIcons';

export function ResourceIcon({
  name,
  size = 16,
  className,
}: {
  name: ResourceIconKey;
  size?: number;
  className?: string;
}) {
  const Icon = RESOURCE_ICONS[name];
  return <Icon size={size} className={className} aria-hidden />;
}