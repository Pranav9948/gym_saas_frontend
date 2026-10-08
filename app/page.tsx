"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Dumbbell,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Track members, memberships, and engagement with powerful tools",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Real-time check-ins and comprehensive attendance reports",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Data-driven insights to grow your gym and maximize revenue",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Control permissions for owners, admins, staff, and trainers",
  },
  {
    icon: Zap,
    title: "Trainer Management",
    description: "Manage trainer schedules, assignments, and performance",
  },
  {
    icon: BarChart3,
    title: "Billing & Revenue",
    description: "Automated invoicing, payment processing, and plan management",
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    text: "Fully responsive design for mobile, tablet, and desktop",
  },
  {
    icon: CheckCircle2,
    text: "Secure authentication with role-based permissions",
  },
  { icon: CheckCircle2, text: "Real-time analytics and reporting dashboards" },
  {
    icon: CheckCircle2,
    text: "Integrated billing and subscription management",
  },
  { icon: CheckCircle2, text: "Scalable infrastructure for growing gyms" },
  { icon: CheckCircle2, text: "24/7 support and regular updates" },
];

const getRoleColor = (role?: string) => {
  switch (role) {
    case "OWNER":
      return "text-violet-600 dark:text-violet-400";

    case "ADMIN":
      return "text-blue-600 dark:text-blue-400";

    case "TRAINER":
      return "text-green-600 dark:text-green-400";

    case "STAFF":
      return "text-amber-600 dark:text-amber-400";

    case "CLIENT":
      return "text-slate-600 dark:text-slate-400";

    default:
      return "text-foreground";
  }
};

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const isLoggedIn = !!user?.role;

  const router = useRouter();

  return (
    <main className="w-full overflow-hidden bg-background sm:px-5 md:px-6 lg:px-10 ">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  ">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary-hover">
              GymManager
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
            >
              Benefits
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {isSuperAdmin ? (
              <>
                <span className="text-sm font-medium text-foreground">
                  Welcome Super Admin
                </span>

                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    logout();
                    router.push(ROUTES.LOGIN);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center">
                  <span
                    className={`text-sm font-semibold ${getRoleColor(user?.role)}`}
                  >
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    logout();
                    router.push(ROUTES.LOGIN);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link href={ROUTES.LOGIN}>Sign In</Link>
                </Button>

                <Button size="sm" asChild className="rounded-full">
                  <Link href={ROUTES.REGISTER}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-10 sm:py-12 md:py-16 lg:py-20 ">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            The modern gym management platform
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Manage Your Gym</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              More Efficiently
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/70 sm:text-xl">
            All-in-one platform to manage members, trainers, attendance,
            billing, and analytics. Scale your gym effortlessly with powerful
            tools built for modern fitness businesses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" asChild className="rounded-full text-base">
              <Link href={ROUTES.REGISTER}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full text-base"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="mt-12 text-sm font-medium text-foreground/60">
            Trusted by fitness professionals worldwide
          </p>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-4 py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Everything you need
            </h2>
            <p className="text-lg text-foreground/70">
              Comprehensive tools designed for modern gym management
            </p>
          </div>

          {/* Features grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/20 hover:bg-card/80"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-6 lg:px-0"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left content */}
            <div>
              <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Why choose us
              </div>

              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Everything you need to{" "}
                <span className="text-primary">
                  grow your fitness business.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Built specifically for fitness businesses, our platform combines
                simplicity with powerful tools to help you manage, grow, and
                scale.
              </p>

              {/* Benefits */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={idx}
                      className="group rounded-xl border border-border/60 bg-background/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-4.5 w-4.5" />
                        </div>

                        <div>
                          <p className="text-sm font-medium leading-6 text-foreground">
                            {benefit.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />

              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/5">
                {/* Browser header */}
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  </div>

                  <div className="hidden rounded-md border border-border/60 bg-background px-8 py-1 text-[10px] text-muted-foreground sm:block">
                    dashboard.yourfitness.com
                  </div>

                  <div className="h-5 w-5 rounded-full bg-primary/10" />
                </div>

                {/* Dashboard */}
                <div className="p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Overview</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">
                        Dashboard
                      </h3>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                      This month
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      ["Members", "1,248", "+12.5%"],
                      ["Revenue", "$24.8K", "+8.2%"],
                      ["Bookings", "384", "+14.4%"],
                    ].map(([label, value, growth]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-border/60 bg-background p-3 sm:p-4"
                      >
                        <p className="text-[11px] text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                          {value}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-primary">
                          {growth}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="mt-4 rounded-xl border border-border/60 bg-background p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="mt-1 text-base font-semibold">$24,840</p>
                      </div>

                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex h-28 items-end gap-2 sm:h-36">
                      {[35, 48, 42, 65, 55, 76, 68, 88, 72, 94, 82, 100].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-primary/15 transition-all hover:bg-primary/40"
                            style={{ height: `${height}%` }}
                          >
                            <div
                              className="h-full rounded-t-md bg-primary/70"
                              style={{
                                height: `${Math.max(height - 15, 20)}%`,
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Bottom cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-[11px] text-muted-foreground">
                        Active members
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[78%] rounded-full bg-primary" />
                      </div>
                      <p className="mt-2 text-xs font-medium">78% active</p>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-[11px] text-muted-foreground">
                        Monthly goal
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        84% completed
                      </p>
                      <p className="mt-1 text-[10px] text-primary">
                        +16% from last month
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-3 hidden rounded-xl border border-border/60 bg-background p-3 shadow-xl sm:block md:-left-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      Business growth
                    </p>
                    <p className="text-sm font-bold text-foreground">+24.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="px-4 py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Ready to transform your gym?
              </h2>
              <p className="mb-8 text-lg text-foreground/70">
                Join hundreds of gyms already using GymManager to grow their
                business
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button size="lg" asChild className="rounded-full text-base">
                  <Link href={ROUTES.REGISTER}>
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-full text-base"
                >
                  <Link href={ROUTES.LOGIN}>Sign In</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-foreground/60">
                No credit card required. Free for 14 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-foreground">GymManager</span>
              </div>
              <p className="text-sm text-foreground/60">
                Modern gym management platform
              </p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-foreground transition"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-sm text-foreground/60">
            <p>&copy; 2026 GymManager. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground transition">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
