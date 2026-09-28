// ===========================================
// Navigation Configuration - Role & permission aware nav
// ===========================================

import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CheckCircle,
  Settings,
  CreditCard,
  BarChart3,
  KeyRound,
} from 'lucide-react';
import { ROUTES } from './routes';
import { PERMISSIONS } from './permissions';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permissions?: string[];
}

export const STAFF_NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.MEMBERS,
    label: 'Members',
    icon: Users,
    permissions: [PERMISSIONS.MEMBER.VIEW],
  },
  {
    href: ROUTES.TRAINERS,
    label: 'Trainers',
    icon: Dumbbell,
    permissions: [PERMISSIONS.TRAINER.VIEW],
  },
  {
    href: ROUTES.ATTENDANCE,
    label: 'Attendance',
    icon: CheckCircle,
    permissions: [PERMISSIONS.ATTENDANCE.VIEW],
  },
  {
    href: ROUTES.ANALYTICS,
    label: 'Analytics',
    icon: BarChart3,
    permissions: [PERMISSIONS.TENANT.VIEW],
  },
  {
    href: ROUTES.BILLING,
    label: 'Billing',
    icon: CreditCard,
    permissions: [PERMISSIONS.TENANT.VIEW],
  },
  {
    href: ROUTES.SETTINGS,
    label: 'Settings',
    icon: Settings,
  },
  {
    href: ROUTES.RESET_CODES,
    label: 'Reset codes',
    icon: KeyRound,
  },
];

export function filterNavItems(
  items: NavItem[],
  userPermissions: string[],
): NavItem[] {
  return items.filter((item) => {
    if (!item.permissions?.length) return true;
    return item.permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  });
}
