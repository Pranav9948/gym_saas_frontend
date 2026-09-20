import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/config';

export interface OwnerNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ownerNavItems: OwnerNavItem[] = [
  { label: 'Dashboard', href: ROUTES.OWNER_DASHBOARD, icon: LayoutDashboard },
  { label: 'Members', href: ROUTES.OWNER_MEMBERS, icon: Users },
  { label: 'Billing', href: ROUTES.OWNER_BILLING, icon: CreditCard },
  { label: 'Settings', href: ROUTES.OWNER_SETTINGS, icon: Settings },
];
