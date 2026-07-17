'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Users, CreditCard, BarChart3 } from 'lucide-react';

const dashboardCards = [
  {
    title: 'Plans',
    description: 'Manage subscription plans',
    href: '/super-admin/plans',
    icon: ShoppingCart,
  },
  {
    title: 'Gyms',
    description: 'View all gyms',
    href: '/super-admin/gyms',
    icon: Users,
  },
  {
    title: 'Billing',
    description: 'View billing',
    href: '/super-admin/billing',
    icon: CreditCard,
  },
  {
    title: 'Analytics',
    description: 'View analytics',
    href: '/super-admin/analytics',
    icon: BarChart3,
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your gym management SaaS platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.href}>
              <Card className="p-6 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
