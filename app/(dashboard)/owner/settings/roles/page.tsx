import { redirect } from 'next/navigation'

export default function OwnerRolesRedirectPage() {
  redirect('/owner/settings?tab=roles')
}
