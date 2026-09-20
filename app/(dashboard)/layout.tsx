import { StaffPortalLayoutShell } from "@/components/layouts/StaffPortalLayoutShell";
import { requireDashboardSession } from "@/lib/auth/require-dashboard-session";

export const dynamic = "force-dynamic";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardSession();
  return <StaffPortalLayoutShell>{children}</StaffPortalLayoutShell>;
}
