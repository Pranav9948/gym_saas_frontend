import { redirect } from 'next/navigation'

export default function DashboardSettingsRolesPage() {
  redirect('/owner/settings?tab=roles')
}
