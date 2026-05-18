'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

type StatusType = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'DELETED';

const statusColors: Record<StatusType, { bg: string; text: string }> = {
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-700' },
  INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-700' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  BANNED: { bg: 'bg-red-100', text: 'text-red-700' },
  DELETED: { bg: 'bg-gray-200', text: 'text-gray-800' },
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors.INACTIVE;
  return (
    <Badge className={`${colors.bg} ${colors.text} border-none`}>
      {label || status}
    </Badge>
  );
}
