'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="border border-border bg-card p-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Trainers > [ID] > Edit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The <strong>/trainers/[id]/edit</strong> page is currently under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
