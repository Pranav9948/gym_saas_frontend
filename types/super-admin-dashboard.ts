export type SuperAdminGymStatus = 'active' | 'trial' | 'suspended' | 'pending';

export interface SuperAdminGymRecord {
  id: string;
  name: string;
  location: string;
  owner: string;
  plan: string;
  members: number;
  status: SuperAdminGymStatus;
  revenue: number;
  joinedAt: string;
}

export interface SuperAdminInvoiceRecord {
  id: string;
  gym: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issuedAt: string;
}

export interface SuperAdminDashboardData {
  stats: {
    totalGyms: number;
    activeMembers: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
  };
  analytics: {
    memberGrowthPct: number;
    newSignups: number;
    retentionRate: number;
    churnRate: number;
  };
  billing: {
    collectedThisMonth: number;
    outstanding: number;
    overdue: number;
    nextPayout: number;
  };
  revenueTrend: Array<{ month: string; revenue: number; gyms: number }>;
  memberGrowth: Array<{ month: string; members: number }>;
  planDistribution: Array<{ plan: string; gyms: number; fill: string }>;
  gyms: SuperAdminGymRecord[];
  invoices: SuperAdminInvoiceRecord[];
}

export interface SuperAdminDashboardResponse {
  success: true;
  data: SuperAdminDashboardData;
}
