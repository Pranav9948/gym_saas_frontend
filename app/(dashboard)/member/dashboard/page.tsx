'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common';

export default function MemberDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Portal"
        description="Your membership dashboard"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Member self-service features (attendance history, goals, profile) will
            be available in a future milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
