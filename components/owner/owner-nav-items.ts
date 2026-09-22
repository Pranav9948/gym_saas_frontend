import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Package,
  Dumbbell,
  ClipboardCheck,
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
  { label: 'Packages', href: ROUTES.OWNER_PACKAGES, icon: Package },
  { label: 'Trainers', href: ROUTES.OWNER_TRAINERS, icon: Dumbbell },
  { label: 'Staff', href: ROUTES.OWNER_STAFF, icon: ClipboardCheck },
  { label: 'Billing', href: ROUTES.OWNER_BILLING, icon: CreditCard },
  { label: 'Settings', href: ROUTES.OWNER_SETTINGS, icon: Settings },
];
