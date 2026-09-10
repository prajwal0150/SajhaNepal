import type { HowIconKey } from '../types/howTypes';
import { HOW_ICONS } from '../utils/howIcons';

export function HowIcon({
  name,
  size = 16,
  className,
}: {
  name: HowIconKey;
  size?: number;
  className?: string;
}) {
  const Icon = HOW_ICONS[name];
  return <Icon size={size} className={className} aria-hidden />;
}