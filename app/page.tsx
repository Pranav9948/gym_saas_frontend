'use client';

import Link from 'next/link';
import { Dumbbell, ArrowRight, Sparkles, Users, BarChart3, Clock, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: 'Member Management',
    description: 'Track members, memberships, and engagement with powerful tools',
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time check-ins and comprehensive attendance reports',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Data-driven insights to grow your gym and maximize revenue',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Control permissions for owners, admins, staff, and trainers',
  },
  {
    icon: Zap,
    title: 'Trainer Management',
    description: 'Manage trainer schedules, assignments, and performance',
  },
  {
    icon: BarChart3,
    title: 'Billing & Revenue',
    description: 'Automated invoicing, payment processing, and plan management',
  },
];

const benefits = [
  { icon: CheckCircle2, text: 'Fully responsive design for mobile, tablet, and desktop' },
  { icon: CheckCircle2, text: 'Secure authentication with role-based permissions' },
  { icon: CheckCircle2, text: 'Real-time analytics and reporting dashboards' },
  { icon: CheckCircle2, text: 'Integrated billing and subscription management' },
  { icon: CheckCircle2, text: 'Scalable infrastructure for growing gyms' },
  { icon: CheckCircle2, text: '24/7 support and regular updates' },
];


const getRoleColor = (role?: string) => {
  switch (role) {
    case 'OWNER':
      return 'text-violet-600 dark:text-violet-400';

    case 'ADMIN':
      return 'text-blue-600 dark:text-blue-400';

    case 'TRAINER':
      return 'text-green-600 dark:text-green-400';

    case 'STAFF':
      return 'text-amber-600 dark:text-amber-400';

    case 'CLIENT':
      return 'text-slate-600 dark:text-slate-400';

    default:
      return 'text-foreground';
  }
};

export default function HomePage() {

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isSuperAdmin =
    user?.role === 'SUPER_ADMIN'

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
            <span className="text-xl font-bold text-primary-hover">GymManager</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              Benefits
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
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

                <Button
                  size="sm"
                  asChild
                  className="rounded-full"
                >
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
            All-in-one platform to manage members, trainers, attendance, billing, and analytics. Scale your gym effortlessly with powerful tools built for modern fitness businesses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" asChild className="rounded-full text-base">
              <Link href={ROUTES.REGISTER}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full text-base">
              <Link href="#features">
                Learn More
              </Link>
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
                <Card key={idx} className="border border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/20 hover:bg-card/80">
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
      <section id="benefits" className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-6 lg:px-0">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left content */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-4xl">
                Why choose us?
              </h2>
              <p className="mb-8 text-md sm:text-lg text-foreground/70">
                Built specifically for fitness businesses, our platform combines ease of use with powerful features.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="flex gap-3 items-start">
                      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">
                        {benefit.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Image placeholder */}
            <div className="relative">
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-8 sm:p-12">
                <div className="flex h-64 sm:h-80 items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto mb-4 h-16 w-16 text-primary/40" />
                    <p className="text-sm text-foreground/40">Dashboard Preview</p>
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
                Join hundreds of gyms already using GymManager to grow their business
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button size="lg" asChild className="rounded-full text-base">
                  <Link href={ROUTES.REGISTER}>
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full text-base">
                  <Link href={ROUTES.LOGIN}>
                    Sign In
                  </Link>
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
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-sm text-foreground/60">
            <p>&copy; 2026 GymManager. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground transition">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition">LinkedIn</Link>
              <Link href="#" className="hover:text-foreground transition">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
