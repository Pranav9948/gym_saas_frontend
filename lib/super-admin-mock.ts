export interface GymRecord {
  id: string;
  name: string;
  location: string;
  owner: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  members: number;
  status: 'active' | 'trial' | 'suspended' | 'pending';
  revenue: number;
  joinedAt: string;
}

export interface InvoiceRecord {
  id: string;
  gym: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issuedAt: string;
}

export const platformStats = {
  totalGyms: 248,
  activeMembers: 18420,
  monthlyRevenue: 84920,
  activeSubscriptions: 231,
};

export const revenueTrend = [
  { month: 'Jan', revenue: 42000, gyms: 120 },
  { month: 'Feb', revenue: 48500, gyms: 134 },
  { month: 'Mar', revenue: 51200, gyms: 148 },
  { month: 'Apr', revenue: 55800, gyms: 162 },
  { month: 'May', revenue: 60100, gyms: 175 },
  { month: 'Jun', revenue: 63400, gyms: 188 },
  { month: 'Jul', revenue: 68900, gyms: 199 },
  { month: 'Aug', revenue: 71200, gyms: 210 },
  { month: 'Sep', revenue: 74800, gyms: 219 },
  { month: 'Oct', revenue: 78300, gyms: 228 },
  { month: 'Nov', revenue: 81600, gyms: 239 },
  { month: 'Dec', revenue: 84920, gyms: 248 },
];

export const planDistribution = [
  { plan: 'Starter', gyms: 96, fill: 'var(--color-chart-1)' },
  { plan: 'Growth', gyms: 108, fill: 'var(--color-chart-2)' },
  { plan: 'Enterprise', gyms: 44, fill: 'var(--color-chart-4)' },
];

export const memberGrowth = [
  { month: 'Jul', members: 12800 },
  { month: 'Aug', members: 14100 },
  { month: 'Sep', members: 15200 },
  { month: 'Oct', members: 16400 },
  { month: 'Nov', members: 17500 },
  { month: 'Dec', members: 18420 },
];

export const gyms: GymRecord[] = [
  {
    id: 'gym_01',
    name: 'Iron Pulse Fitness',
    location: 'Austin, TX',
    owner: 'Marcus Reed',
    plan: 'Enterprise',
    members: 1240,
    status: 'active',
    revenue: 4820,
    joinedAt: '2024-01-12',
  },
  {
    id: 'gym_02',
    name: 'Peak Form Studio',
    location: 'Denver, CO',
    owner: 'Elena Voss',
    plan: 'Growth',
    members: 640,
    status: 'active',
    revenue: 2210,
    joinedAt: '2024-02-03',
  },
  {
    id: 'gym_03',
    name: 'Titan Strength Club',
    location: 'Miami, FL',
    owner: 'Dorian Blake',
    plan: 'Enterprise',
    members: 1580,
    status: 'active',
    revenue: 5410,
    joinedAt: '2024-02-19',
  },
  {
    id: 'gym_04',
    name: 'Flow Yoga Collective',
    location: 'Portland, OR',
    owner: 'Aria Nakamura',
    plan: 'Starter',
    members: 210,
    status: 'trial',
    revenue: 0,
    joinedAt: '2024-11-28',
  },
  {
    id: 'gym_05',
    name: 'Velocity CrossFit',
    location: 'Seattle, WA',
    owner: 'Jonah Pierce',
    plan: 'Growth',
    members: 720,
    status: 'active',
    revenue: 2480,
    joinedAt: '2024-03-14',
  },
  {
    id: 'gym_06',
    name: 'Summit Athletic',
    location: 'Salt Lake City, UT',
    owner: 'Priya Anand',
    plan: 'Growth',
    members: 540,
    status: 'pending',
    revenue: 0,
    joinedAt: '2024-12-02',
  },
  {
    id: 'gym_07',
    name: 'Core Republic',
    location: 'Chicago, IL',
    owner: 'Devon Wright',
    plan: 'Starter',
    members: 180,
    status: 'suspended',
    revenue: 0,
    joinedAt: '2024-05-21',
  },
  {
    id: 'gym_08',
    name: 'Apex Barbell',
    location: 'Phoenix, AZ',
    owner: 'Sofia Marin',
    plan: 'Enterprise',
    members: 1320,
    status: 'active',
    revenue: 4990,
    joinedAt: '2024-04-08',
  },
];

export const invoices: InvoiceRecord[] = [
  {
    id: 'INV-2041',
    gym: 'Iron Pulse Fitness',
    plan: 'Enterprise',
    amount: 499,
    status: 'paid',
    issuedAt: '2024-12-01',
  },
  {
    id: 'INV-2042',
    gym: 'Peak Form Studio',
    plan: 'Growth',
    amount: 199,
    status: 'paid',
    issuedAt: '2024-12-01',
  },
  {
    id: 'INV-2043',
    gym: 'Titan Strength Club',
    plan: 'Enterprise',
    amount: 499,
    status: 'paid',
    issuedAt: '2024-12-01',
  },
  {
    id: 'INV-2044',
    gym: 'Velocity CrossFit',
    plan: 'Growth',
    amount: 199,
    status: 'pending',
    issuedAt: '2024-12-03',
  },
  {
    id: 'INV-2045',
    gym: 'Core Republic',
    plan: 'Starter',
    amount: 49,
    status: 'overdue',
    issuedAt: '2024-11-18',
  },
  {
    id: 'INV-2046',
    gym: 'Apex Barbell',
    plan: 'Enterprise',
    amount: 499,
    status: 'paid',
    issuedAt: '2024-12-01',
  },
  {
    id: 'INV-2047',
    gym: 'Summit Athletic',
    plan: 'Growth',
    amount: 199,
    status: 'pending',
    issuedAt: '2024-12-05',
  },
];

export const billingSummary = {
  collectedThisMonth: 72840,
  outstanding: 3980,
  overdue: 1240,
  nextPayout: 68900,
};
