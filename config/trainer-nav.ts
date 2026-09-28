import { Settings, Users } from 'lucide-react'
import { ROUTES } from './routes'
import type { NavItem } from './navigation'

export const TRAINER_NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.TRAINER_MEMBERS,
    label: 'My members',
    icon: Users,
  },
  {
    href: ROUTES.TRAINER_SETTINGS,
    label: 'Settings',
    icon: Settings,
  },
]
