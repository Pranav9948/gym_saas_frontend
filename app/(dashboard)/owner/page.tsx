import { redirect } from 'next/navigation'
import { ROUTES } from '@/config'

export default function OwnerIndexPage() {
  redirect(ROUTES.OWNER_DASHBOARD)
}
