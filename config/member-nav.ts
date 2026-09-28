import { Activity, Dumbbell, Salad, Settings } from 'lucide-react'
import { ROUTES } from './routes'
import type { NavItem } from './navigation'

export const MEMBER_NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.MEMBER_PORTAL,
    label: 'Today',
    icon: Dumbbell,
  },
  {
    href: ROUTES.MEMBER_WORKOUTS,
    label: 'Workouts',
    icon: Activity,
  },
  {
    href: ROUTES.MEMBER_DIET,
    label: 'Diet',
    icon: Salad,
  },
  {
    href: ROUTES.MEMBER_SETTINGS,
    label: 'Settings',
    icon: Settings,
  },
]
