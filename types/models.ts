export type MemberStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'BANNED'
  | 'DELETED';
export type PlanName = 'FREE' | 'BASIC' | 'PRO';
export type BillingInterval = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE'
  | 'TRIALING';
export type GoalType = 'GAIN' | 'LOSS';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
export type TenantRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'TRAINER';
export type InviteRole = 'ADMIN' | 'STAFF';
export type DirectCreateRole = 'ADMIN' | 'STAFF' | 'TRAINER';

export interface PlanFeatures {
  maxMembers: number;
  maxTrainers: number;
  prioritySupport: boolean;
  [key: string]: string | number | boolean;
}

// Core Models
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: TenantRole | string;
  isActive?: boolean;
}

export interface Plan {
  id: string;
  name: PlanName;
  price: number;
  currency: string;
  interval: BillingInterval;
  stripePriceId: string | null;
  features: PlanFeatures;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionWithPlan {
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: Plan;
}

export type StatusType =
  | 'ACTIVE'
  | 'TRIAL'
  | 'SUSPENDED'
  | 'PENDING'
  | 'INACTIVE'
  | 'BANNED'
  | 'DELETED';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  timezone?: string;
  isActive?: boolean;
  stripeCustomerId?: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptions?: SubscriptionWithPlan[];
}

export type MemberPaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface MembershipPackage {
  id: string;
  tenantId?: string;
  name: string;
  description: string | null;
  durationDays: number;
  price: number;
  currency: string;
  isActive: boolean;
  memberCount?: number;
  features?: string[];
  featureLimits?: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  createdAt: string;
  dateOfBirth?: string | null;
  packageId?: string | null;
  membershipStartDate?: string | null;
  membershipExpiresAt?: string | null;
  paymentStatus?: MemberPaymentStatus;
  remainingDays?: number | null;
  canSendRenewalReminder?: boolean;
  membershipPackage?: {
    id: string;
    name: string;
    durationDays: number;
    price: number;
    currency: string;
    features?: string[];
  } | null;
  assignedTrainer?: {
    id: string;
    user: { firstName: string; lastName: string };
  } | null;
  _count?: { attendances: number };
}

export interface Trainer {
  id: string;
  specialization: string | null;
  bio: string | null;
  createdAt: string;
  userId?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    isActive?: boolean;
  };
  _count?: { members: number };
}

export interface Attendance {
  id: string;
  checkIn: string;
  checkOut?: string | null;
  date?: string;
  deviceInfo?: string | null;
  member?: {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    status?: MemberStatus;
  };
  memberId?: string;
}

export interface AttendanceStats {
  totalVisits: number;
  lastVisit: string | null;
}

export interface MemberGoal {
  id: string;
  memberId: string;
  tenantId: string;
  goalType: GoalType;
  currentWeight: number;
  targetWeight: number;
  durationWeeks: number;
  height: number;
  isActive: boolean;
  createdAt: string;
}

export interface SuperAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN';
}

export interface OwnerWithGym {
  id: string;
  role: string;
  createdAt: string;
  user: User & { createdAt: string };
  tenant: Pick<
    Tenant,
    | 'id'
    | 'name'
    | 'slug'
    | 'address'
    | 'city'
    | 'country'
    | 'contactEmail'
    | 'contactPhone'
    | 'logoUrl'
    | 'isActive'
    | 'createdAt'
  >;
}
