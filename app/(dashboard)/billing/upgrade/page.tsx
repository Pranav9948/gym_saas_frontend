'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function UpgradePlanPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full text-center p-6 border border-border bg-card">
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Upgrade Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Unlock premium features, add unlimited members and trainers, and scale your fitness business effortlessly.
          </p>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">
              Subscription plans and online upgrade checkout will be available soon. Contact support for instant limit upgrades.
            </p>
            <Button className="w-full cursor-pointer">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
