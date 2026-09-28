import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ShoppingCart,
  Building2,
  KeyRound,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/super-admin/plans', label: 'Plans', icon: ShoppingCart },
      { href: '/super-admin/gyms', label: 'Gyms', icon: Building2 },
      { href: '/super-admin/owners', label: 'Owners', icon: Users },
    ],
  },
  {
    label: 'Finance & Insights',
    items: [
      { href: '/super-admin/billing', label: 'Billing', icon: CreditCard },
      { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/super-admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/super-admin/settings', label: 'Settings', icon: Settings },
      { href: '/super-admin/reset-codes', label: 'Reset codes', icon: KeyRound },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);
