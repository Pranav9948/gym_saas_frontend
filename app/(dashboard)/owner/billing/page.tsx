'use client'

import React from 'react'
import { Check, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/common'
import { UsageMeter } from '@/components/owner/UsageMeter'
import { cn } from '@/lib/utils'
import { plans, subscription, usage } from '@/lib/owner-mock'

export default function OwnerBillingPage() {
  const [interval, setInterval] = React.useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage your GymFlow subscription, usage and plan."
      />

      {/* Current plan hero */}
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {subscription.plan} Plan
              </h2>
              <Badge
                variant="outline"
                className="gap-1.5 border-success/30 bg-success/10 text-success"
              >
                <span className="size-1.5 rounded-full bg-success" />
                ACTIVE
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Renews on {subscription.renewalDate} · in {subscription.renewsInDays} days
            </p>
            <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
              ${subscription.price}
              <span className="text-base font-normal text-muted-foreground">
                /{subscription.interval}
              </span>
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <UsageMeter label="Members" current={usage.totalMembers} max={subscription.maxMembers} />
            <UsageMeter label="Trainers" current={usage.trainers} max={subscription.maxTrainers} />
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Compare plans</h2>
            <p className="text-sm text-muted-foreground">Upgrade or downgrade at any time.</p>
          </div>

          {/* Interval toggle */}
          <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
            {(['monthly', 'yearly'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInterval(option)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                  interval === option
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option}
                {option === 'yearly' ? (
                  <span className="ml-1.5 text-xs font-normal text-success">-17%</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.name === subscription.plan
            const price = interval === 'monthly' ? plan.monthly : plan.yearly
            return (
              <Card
                key={plan.name}
                className={cn(
                  'relative flex flex-col',
                  isCurrent && 'border-primary ring-1 ring-primary',
                )}
              >
                {isCurrent ? (
                  <Badge className="absolute right-4 top-4">Current</Badge>
                ) : null}
                <CardHeader>
                  <CardTitle className="text-base uppercase tracking-wide">{plan.name}</CardTitle>
                  <p className="pt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
                    ${price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 shrink-0 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? 'outline' : 'default'}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        Current Plan
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
