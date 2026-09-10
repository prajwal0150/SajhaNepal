import type { AboutIconKey } from '../types/aboutTypes';
import { ABOUT_ICONS } from '../utils/aboutIcons';

export function AboutIcon({
  name,
  size = 16,
  className,
}: {
  name: AboutIconKey;
  size?: number;
  className?: string;
}) {
  const Icon = ABOUT_ICONS[name];
  return <Icon size={size} className={className} aria-hidden />;
}