import type { ReactNode } from 'react';
import {

  LayoutDashboard, ClipboardList, ShieldCheck, Building2, Truck, Boxes, Users,
  BarChart3, ScrollText, Settings, PersonStanding, Bell, PackageCheck, TriangleAlert,
} from 'lucide-react';

const ICONS: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard size={18} />, reports: <ClipboardList size={18} />,
  verify: <ShieldCheck size={18} />, orgs: <Building2 size={18} />,
  claims: <PackageCheck size={18} />, deliveries: <Truck size={18} />,
  inventory: <Boxes size={18} />, users: <Users size={18} />,
  analytics: <BarChart3 size={18} />, audit: <ScrollText size={18} />,
  settings: <Settings size={18} />, missing: <PersonStanding size={18} />,
  shelters: <TriangleAlert size={18} />, notifications: <Bell size={18} />,
  team: <Users size={18} />, needs: <ClipboardList size={18} />,
  operations: <Truck size={18} />, hazards: <TriangleAlert size={18} />,
};

export interface DashboardNavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

export const DASHBOARD_MENUS: Record<string, { section: string; items: DashboardNavItem[] }[]> = {
  VOLUNTEER: [
    { section: 'Verification', items: [
      { to: '/volunteer/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { to: '/volunteer/reports', label: 'Pending Reports', icon: ICONS.reports },
      { to: '/volunteer/verification-history', label: 'My Verifications', icon: ICONS.verify },
      { to: '/volunteer/profile', label: 'Profile', icon: ICONS.settings },
    ] },
  ],
  NGO: [
    { section: 'Response', items: [
      { to: '/ngo/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { to: '/ngo/needs', label: '3W — Available Needs', icon: ICONS.needs },
      { to: '/ngo/claims', label: 'My Claims', icon: ICONS.claims },
      { to: '/ngo/deliveries', label: 'Deliveries', icon: ICONS.deliveries },
    ] },
    { section: 'Operations', items: [
      { to: '/ngo/inventory', label: 'Inventory', icon: ICONS.inventory },
      { to: '/ngo/profile', label: 'Organization', icon: ICONS.orgs },
      { to: '/ngo/notifications', label: 'Notifications', icon: ICONS.notifications },
    ] },
  ],
  GOVERNMENT: [
    { section: 'Monitoring', items: [
      { to: '/government/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { to: '/government/reports', label: 'Needs Overview', icon: ICONS.reports },
      { to: '/government/hazards', label: 'Hazard Alerts', icon: ICONS.hazards },
      { to: '/government/analytics', label: 'Analytics', icon: ICONS.analytics },
    ] },
  ],
  ADMIN: [
    { section: 'Overview', items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: ICONS.analytics },
    ] },
    { section: 'Management', items: [
      { to: '/admin/users', label: 'Users', icon: ICONS.users },
      { to: '/admin/organizations', label: 'Organizations', icon: ICONS.orgs },
      { to: '/admin/reports', label: 'Reports', icon: ICONS.reports },
      { to: '/admin/verifications', label: 'Verifications', icon: ICONS.verify },
      { to: '/admin/claims', label: 'Claims', icon: ICONS.claims },
      { to: '/admin/deliveries', label: 'Deliveries', icon: ICONS.deliveries },
    ] },
    { section: 'Community', items: [
      { to: '/admin/missing-persons', label: 'Missing Persons', icon: ICONS.missing },
      { to: '/admin/shelters', label: 'Shelters & Warehouses', icon: ICONS.shelters },
      { to: '/admin/inventory', label: 'Inventory', icon: ICONS.inventory },
      { to: '/admin/donations', label: 'Donations', icon: ICONS.orgs },
      { to: '/admin/hazards', label: 'Hazards', icon: ICONS.hazards },
    ] },
    { section: 'System', items: [
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: ICONS.audit },
      { to: '/admin/settings', label: 'Settings', icon: ICONS.settings },
    ] },
  ],
};
