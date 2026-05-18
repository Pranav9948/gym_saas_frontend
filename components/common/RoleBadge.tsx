'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

type RoleType = 'OWNER' | 'ADMIN' | 'STAFF' | 'TRAINER';

const roleColors: Record<RoleType, { bg: string; text: string }> = {
  OWNER: { bg: 'bg-purple-100', text: 'text-purple-700' },
  ADMIN: { bg: 'bg-blue-100', text: 'text-blue-700' },
  STAFF: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  TRAINER: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

interface RoleBadgeProps {
  role: RoleType;
  label?: string;
}

export function RoleBadge({ role, label }: RoleBadgeProps) {
  const colors = roleColors[role] || roleColors.STAFF;
  return (
    <Badge className={`${colors.bg} ${colors.text} border-none`}>
      {label || role}
    </Badge>
  );
}
