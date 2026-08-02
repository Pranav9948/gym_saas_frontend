// ===========================================
// Mutation Keys - TanStack Query mutation key factory
// ===========================================

export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    logout: ['auth', 'logout'] as const,
    forgotPassword: ['auth', 'forgot-password'] as const,
    resetPassword: ['auth', 'reset-password'] as const,
    acceptInvite: ['auth', 'accept-invite'] as const,
  },

  tenant: {
    update: ['tenant', 'update'] as const,
    inviteUser: ['tenant', 'invite-user'] as const,
    createUser: ['tenant', 'create-user'] as const,
    removeUser: ['tenant', 'remove-user'] as const,
    cancelInvite: ['tenant', 'cancel-invite'] as const,
  },

  members: {
    create: ['members', 'create'] as const,
    update: (id: string) => ['members', 'update', id] as const,
    delete: (id: string) => ['members', 'delete', id] as const,
  },

  trainers: {
    create: ['trainers', 'create'] as const,
    update: (id: string) => ['trainers', 'update', id] as const,
    delete: (id: string) => ['trainers', 'delete', id] as const,
  },

  rbac: {
    createRole: ['rbac', 'create-role'] as const,
    updateRole: (id: string) => ['rbac', 'update-role', id] as const,
    deleteRole: (id: string) => ['rbac', 'delete-role', id] as const,
  },

  superAdmin: {
    createPlan: ['super-admin', 'create-plan'] as const,
    updatePlan: (id: string) => ['super-admin', 'update-plan', id] as const,
    deletePlan: (id: string) => ['super-admin', 'delete-plan', id] as const,
  },
} as const;

export type MutationKeys = typeof mutationKeys;
