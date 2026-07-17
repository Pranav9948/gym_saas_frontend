# Super Admin Frontend

## Folder Structure

- `app/(dashboard)/super-admin/`: Super Admin pages (dashboard, plans, gyms, owners, billing, analytics, subscriptions, settings)
- `components/super-admin/`: Super Admin components (layout, plans, future modules)
- `services/super-admin/`: Super Admin API services (auth, plans)
- `hooks/super-admin/`: Super Admin React Query hooks
- `stores/`: Zustand store (if needed)
- `types/`: Types for Super Admin
- `lib/`: Shared utilities
- `utils/`: Helpers

## Routing

- `/dashboard/super-admin`: Super Admin dashboard
- `/dashboard/super-admin/plans`: Plan list page
- `/dashboard/super-admin/plans/create`: Create plan page
- `/dashboard/super-admin/plans/[id]/edit`: Edit plan page

## Authentication Flow

- **Setup**: Create first super admin via `/auth/super-admin-setup` (uses `superAdminAuthService.setupSuperAdmin`)
- **Login**: Super admin login via `/auth/login` with loginType="superAdmin" (uses `superAdminAuthService.loginSuperAdmin`)
- **Logout**: Logout via `authService.logout` (clears local storage)
- **Refresh**: Token refresh via `apiClient` interceptors and `refreshAccessToken` in `/lib/api/client.ts`
- **Protected Routes**: Protected by `ProtectedRoute` component
- **Interceptors**: `apiClient` interceptors handle automatic token refresh

## API Layer

All Super Admin API calls go through services in `/services/super-admin/`:

- `auth.service.ts`: Authentication endpoints
- `plans.service.ts`: Plan CRUD endpoints

Uses shared API config from `/config/api.config.ts` and shared API client from `/lib/api/client.ts`

## State Management

- Zustand store is minimal for auth state
- React Query handles data fetching/caching

## React Query

Standardized query keys from `/services/queryKeys.ts`:

- `queryKeys.superAdmin.plans.all()`: All plans
- `queryKeys.superAdmin.plans.list()`: Plan list
- `queryKeys.superAdmin.plans.detail(id)`: Single plan detail

Queries are invalidated correctly after mutations.

## Components

Reusable Super Admin components:

- Plans components: `PlansTable`, `PlanCard`, `PlanForm`, `DeletePlanDialog`, `LoadingSkeleton`, `EmptyState`, `FeatureEditor`
- More components will be added for future modules

## Plans Module

- **List**: Plan list page with search, table (desktop), cards (mobile), delete confirmation
- **Create**: Create plan with validation, features editor, redirect after success
- **Edit**: Edit plan with validation, features editor, redirect after success
- **Delete**: Delete plan with confirmation dialog, invalidate queries after
- **Validation**: React Hook Form + Zod
- **Dialogs**: `DeletePlanDialog` for confirmations

## Layout

Uses shared `DashboardLayout` from `/components/common/DashboardLayout.tsx` with sidebar navigation.

## Folder Responsibilities

- **app/(dashboard)/super-admin**: Page components
- **components/super-admin**: UI components
- **services/super-admin**: API integration
- **hooks/super-admin**: React Query hooks
- **stores**: State management
- **types**: Type definitions
- **lib/api**: API client
- **config**: API endpoints, routes, permissions

## Coding Standards

- Use TypeScript with proper types, avoid `any`
- Use React Query for data fetching
- Use Zustand for global state (minimally)
- Standardized query keys
- Consistent validation (React Hook Form + Zod)
- Reusable components

## Future Modules

- Dashboard
- Gyms
- Owners
- Billing
- Analytics
- Subscriptions
- Settings
