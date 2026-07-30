export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE';
export type PlanName = 'FREE' | 'BASIC' | 'PRO';

export interface OwnerProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Owner';
}

export const owner: OwnerProfile = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah@ironfit.com',
  role: 'Owner',
};

export const gym = {
  name: 'IronFit Gym',
  address: '2200 Market Street',
  city: 'San Francisco',
  country: 'United States',
  contactEmail: 'hello@ironfit.com',
  phone: '+1 (415) 555-0142',
};

export const subscription = {
  status: 'ACTIVE' as SubscriptionStatus,
  plan: 'PRO' as PlanName,
  price: 49,
  interval: 'month' as 'month' | 'year',
  renewalDate: 'Aug 15, 2026',
  renewsInDays: 18,
  maxMembers: 50,
  maxTrainers: 5,
};

export const usage = {
  totalMembers: 42,
  activeMembers: 40,
  newThisMonth: 6,
  trainers: 3,
  checkinsToday: 28,
  checkinsTrendPct: 12,
};

export const attendanceTrend = [
  { day: 'Mon', checkins: 18, today: false },
  { day: 'Tue', checkins: 22, today: false },
  { day: 'Wed', checkins: 25, today: false },
  { day: 'Thu', checkins: 20, today: false },
  { day: 'Fri', checkins: 28, today: false },
  { day: 'Sat', checkins: 30, today: false },
  { day: 'Sun', checkins: 28, today: true },
];

export interface CheckIn {
  id: string;
  name: string;
  time: string;
}

export const recentCheckins: CheckIn[] = [
  { id: 'c1', name: 'Marcus Lee', time: '7:42 AM' },
  { id: 'c2', name: 'Elena Fisher', time: '7:38 AM' },
  { id: 'c3', name: 'David Kim', time: '7:21 AM' },
  { id: 'c4', name: 'Priya Nair', time: '7:05 AM' },
  { id: 'c5', name: 'Tom Becker', time: '6:52 AM' },
];

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  trainer: string | null;
  joined: string;
  joinedAgo: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const members: Member[] = [
  {
    id: 'm1',
    firstName: 'Marcus',
    lastName: 'Lee',
    email: 'marcus.lee@example.com',
    phone: '+1 415-555-0111',
    trainer: 'Jordan Blake',
    joined: 'Jul 26, 2026',
    joinedAgo: 'Joined 2 days ago',
    status: 'ACTIVE',
  },
  {
    id: 'm2',
    firstName: 'Elena',
    lastName: 'Fisher',
    email: 'elena.fisher@example.com',
    phone: '+1 415-555-0112',
    trainer: 'Jordan Blake',
    joined: 'Jul 24, 2026',
    joinedAgo: 'Joined 4 days ago',
    status: 'ACTIVE',
  },
  {
    id: 'm3',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@example.com',
    phone: '+1 415-555-0113',
    trainer: 'Mia Torres',
    joined: 'Jul 22, 2026',
    joinedAgo: 'Joined 6 days ago',
    status: 'ACTIVE',
  },
  {
    id: 'm4',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@example.com',
    phone: '+1 415-555-0114',
    trainer: null,
    joined: 'Jul 20, 2026',
    joinedAgo: 'Joined 1 week ago',
    status: 'ACTIVE',
  },
  {
    id: 'm5',
    firstName: 'Tom',
    lastName: 'Becker',
    email: 'tom.becker@example.com',
    phone: '+1 415-555-0115',
    trainer: 'Mia Torres',
    joined: 'Jul 18, 2026',
    joinedAgo: 'Joined 1 week ago',
    status: 'ACTIVE',
  },
  {
    id: 'm6',
    firstName: 'Aisha',
    lastName: 'Rahman',
    email: 'aisha.rahman@example.com',
    phone: '+1 415-555-0116',
    trainer: 'Jordan Blake',
    joined: 'Jul 12, 2026',
    joinedAgo: 'Joined 2 weeks ago',
    status: 'ACTIVE',
  },
  {
    id: 'm7',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'carlos.mendez@example.com',
    phone: '+1 415-555-0117',
    trainer: null,
    joined: 'Jul 05, 2026',
    joinedAgo: 'Joined 3 weeks ago',
    status: 'INACTIVE',
  },
  {
    id: 'm8',
    firstName: 'Nina',
    lastName: 'Volkov',
    email: 'nina.volkov@example.com',
    phone: '+1 415-555-0118',
    trainer: 'Mia Torres',
    joined: 'Jun 28, 2026',
    joinedAgo: 'Joined 1 month ago',
    status: 'ACTIVE',
  },
];

export const latestMembers = members.slice(0, 5);

export interface Plan {
  name: PlanName;
  monthly: number;
  yearly: number;
  maxMembers: number;
  maxTrainers: number;
  features: string[];
}

export const plans: Plan[] = [
  {
    name: 'FREE',
    monthly: 0,
    yearly: 0,
    maxMembers: 10,
    maxTrainers: 1,
    features: [
      'Up to 10 members',
      '1 trainer',
      'Basic check-in desk',
      'Community support',
    ],
  },
  {
    name: 'BASIC',
    monthly: 29,
    yearly: 290,
    maxMembers: 25,
    maxTrainers: 3,
    features: [
      'Up to 25 members',
      '3 trainers',
      'Attendance history',
      'Email support',
    ],
  },
  {
    name: 'PRO',
    monthly: 49,
    yearly: 490,
    maxMembers: 50,
    maxTrainers: 5,
    features: [
      'Up to 50 members',
      '5 trainers',
      'Advanced analytics',
      'Priority support',
    ],
  },
];
