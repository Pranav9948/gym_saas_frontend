# GymFlow Frontend - Comprehensive Documentation

## 1. Project Overview

**GymFlow** is a modern, multi-tenant SaaS gym management platform built with Next.js 17, TypeScript, and a custom design system. It provides complete gym operations management including member tracking, trainer management, attendance, billing, and analytics.

### Target Users
- **Super Admin**: Platform-wide administration and plan management
- **Gym Owners/Tenants**: Complete gym management
- **Admins**: Member, trainer, and attendance management
- **Staff/Trainers**: Day-to-day gym operations
- **Members**: (Future feature) Self-service portal

### Major Modules
1. **Authentication**: Multi-role auth with JWT tokens
2. **Member Management**: CRUD, status tracking, goal setting
3. **Trainer Management**: Trainer profiles and assignments
4. **Attendance**: Check-in/out, history, statistics
5. **Billing/Subscriptions**: Stripe integration, plan management
6. **Super Admin**: Platform management, plan configuration
7. **Analytics**: Member and revenue analytics

### Overall Architecture
- **Frontend**: Next.js 17 (App Router) + TypeScript
- **UI Library**: shadcn/ui (Radix Nova style)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (global) + TanStack Query (server)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: Dark mode with custom neon/orange accents

---

## 2. Tech Stack

### Core Dependencies
```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "typescript": "^5"
}
```

### UI & Design
```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "shadcn": "^4.7.0",
  "lucide-react": "^1.16.0",
  "tw-animate-css": "^1.4.0"
}
```

### State Management & Data Fetching
```json
{
  "@tanstack/react-query": "^5.100.10",
  "zustand": "^5.0.13",
  "axios": "^1.16.1"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.75.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.4.3"
}
```

### Authentication
```json
{
  "next-auth": "^4.24.14",
  "next-themes": "^0.4.6",
  "js-cookie": "^3.0.5"
}
```

### Utilities
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0",
  "date-fns": "^4.1.0",
  "recharts": "^3.8.0",
  "sonner": "^2.0.7"
}
```

### Radix UI Primitives (via shadcn)
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- @radix-ui/react-label
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toast
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip

---

## 3. Complete Folder Structure

```
saas-frontend/
├── app/
│   ├── (auth)/                      # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                 # Dashboard route group
│   │   ├── page.tsx                 # Dashboard landing
│   │   ├── layout.tsx
│   │   ├── members/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── trainers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── attendance/
│   │   │   ├── page.tsx
│   │   │   └── reports/page.tsx
│   │   ├── billing/
│   │   │   ├── page.tsx
│   │   │   ├── invoices/page.tsx
│   │   │   └── upgrade/page.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   ├── members/page.tsx
│   │   │   └── revenue/page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── gym/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   └── roles/page.tsx
│   │   ├── super-admin/             # Super Admin section
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── plans/
│   │   │       ├── page.tsx
│   │   │       ├── create/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   └── api/
│   │       ├── auth/route.ts
│   │       └── webhook/route.ts
│   ├── (platform)/                  # Marketing pages
│   │   ├── page.tsx
│   │   ├── features/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   ├── setup/
│   │   └── super-admin/page.tsx
│   ├── layout.tsx                   # Root layout
│   ├── globals.css
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button-group.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── empty.tsx
│   │   ├── field.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-group.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── item.tsx
│   │   ├── kbd.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── spinnner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── common/                      # Reusable app components
│   │   ├── ConfirmDialog.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── DataTable.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FormField.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Pagination.tsx
│   │   ├── RoleBadge.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── index.ts
│   ├── features/                    # Feature-specific components
│   │   └── auth/
│   │       ├── Feature.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       ├── LoginForm.tsx
│   │       ├── ProtectedRoute.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ResetPasswordForm.tsx
│   │       ├── super-admin-setup-form.tsx
│   │       └── index.ts
│   ├── super-admin/                 # Super Admin specific components
│   │   ├── plans/
│   │   │   ├── DeletePlanDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FeatureEditor.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PlanForm.tsx
│   │   │   ├── PlansTable.tsx
│   │   │   └── index.ts
│   │   ├── SuperAdminDashboardLayout.tsx
│   │   ├── SuperAdminNavbar.tsx
│   │   ├── SuperAdminSidebar.tsx
│   │   └── index.ts
│   └── theme-provider.tsx
├── config/
│   ├── api.config.ts                # API endpoints and config
│   ├── permissions.ts               # Role-based permissions
│   ├── routes.ts                    # Route constants
│   └── index.ts
├── constants/
│   ├── messages.ts                  # Success/error messages
│   ├── pagination.ts                # Pagination defaults
│   ├── roles.ts                     # Role definitions
│   ├── status.ts                    # Status definitions
│   └── index.ts
├── hooks/
│   ├── super-admin/
│   │   ├── usePlans.ts
│   │   └── index.ts
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useFetch.ts
│   ├── useLocalStorage.ts
│   ├── use-mobile.ts
│   ├── useMutation.ts
│   ├── usePagination.ts
│   ├── useSearch.ts
│   ├── use-toast.ts
│   └── index.ts
├── lib/
│   ├── api/
│   │   ├── client.ts                # Axios API client
│   │   ├── errors.ts                # Error handling
│   │   ├── types.ts
│   │   └── index.ts
│   ├── helpers/
│   │   ├── constants.ts
│   │   ├── formatting.ts
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── middleware.ts
│   └── utils.ts                     # cn() utility
├── providers/
│   ├── AuthProvider.tsx
│   ├── QueryProvider.tsx
│   ├── ToastProvider.tsx
│   └── index.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── schemas/
│   ├── attendance.schema.ts
│   ├── auth.schema.ts
│   ├── billing.schema.ts
│   ├── goal.schema.ts
│   ├── member.schema.ts
│   ├── plans.ts
│   ├── settings.schema.ts
│   ├── trainer.schema.ts
│   └── index.ts
├── services/
│   ├── super-admin/
│   │   ├── auth.service.ts
│   │   ├── plans.service.ts
│   │   └── index.ts
│   ├── analytics.service.ts
│   ├── attendance.service.ts
│   ├── auth.service.ts
│   ├── billing.service.ts
│   ├── goals.service.ts
│   ├── members.service.ts
│   ├── plans-service.ts
│   ├── queryKeys.ts                  # Query key factory
│   ├── superAdmin.service.ts
│   ├── tenant.service.ts
│   ├── trainers.service.ts
│   └── index.ts
├── store/
│   ├── authStore.ts                 # Zustand auth store
│   ├── filtersStore.ts
│   ├── uiStore.ts
│   └── index.ts
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── models.ts
│   ├── plans.ts
│   └── index.ts
├── .gitignore
├── components.json                  # shadcn/ui config
├── eslint.config.mjs
├── example-env
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

---

## 4. Routing Structure

### Route Groups

#### `(auth)` - Authentication Routes
- `/login` - User login page
- `/register` - Gym registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

#### `(dashboard)` - Main Application Routes
- `/` - Dashboard landing page
- `/members` - Members list
- `/members/[id]` - Member detail
- `/members/[id]/edit` - Member edit
- `/trainers` - Trainers list
- `/trainers/[id]` - Trainer detail
- `/trainers/[id]/edit` - Trainer edit
- `/attendance` - Attendance check-in
- `/attendance/reports` - Attendance reports
- `/billing` - Billing overview
- `/billing/invoices` - Invoice history
- `/billing/upgrade` - Plan upgrade
- `/analytics` - Analytics dashboard
- `/analytics/members` - Member analytics
- `/analytics/revenue` - Revenue analytics
- `/settings` - Settings overview
- `/settings/gym` - Gym settings
- `/settings/profile` - User profile
- `/settings/notifications` - Notification preferences
- `/settings/roles` - Role management (Owner only)

#### `(dashboard)/super-admin` - Super Admin Routes
- `/super-admin` - Super Admin dashboard
- `/super-admin/plans` - Plans management
- `/super-admin/plans/create` - Create new plan
- `/super-admin/plans/[id]/edit` - Edit plan
- `/super-admin/gyms` - Gyms management (placeholder)
- `/super-admin/owners` - Owners management (placeholder)
- `/super-admin/billing` - Billing management (placeholder)
- `/super-admin/analytics` - Platform analytics (placeholder)
- `/super-admin/settings` - Super Admin settings (placeholder)

#### `(platform)` - Marketing Pages
- `/features` - Features page
- `/pricing` - Pricing page

#### `setup` - Setup Routes
- `/setup/super-admin` - Initial super admin setup

### Key Routing Patterns
1. **Route Groups**: Used for layout organization, not appearing in URLs
2. **Dynamic Routes**: `[id]` for detail/edit pages
3. **Nested Layouts**: Each route group can have its own layout
4. **Parallel Routes**: (Not currently used)
5. **Intercepting Routes**: (Not currently used)

### Important Layout Files
- `app/layout.tsx` - Root layout with providers
- `app/(auth)/layout.tsx` - Auth pages layout
- `app/(dashboard)/layout.tsx` - Dashboard layout with sidebar/navbar
- `app/(dashboard)/super-admin/layout.tsx` - Super Admin layout

---

## 5. Layout System

### Root Layout (`app/layout.tsx`)
- **Purpose**: Applies global providers and base styling
- **Providers Wrapped**:
  - `ThemeProvider` (next-themes)
  - `QueryProvider` (TanStack Query)
  - `ToastProvider` (Sonner)
  - `AuthProvider` (Custom auth)
- **Fonts**: Geist Sans + Geist Mono
- **Global Styling**: `globals.css` imports

### Dashboard Layout (`components/common/DashboardLayout.tsx`)
- **Structure**:
  ```
  Flex container (h-screen)
  ├── Sidebar (fixed width, responsive)
  └── Flex column container
      ├── Navbar (sticky top-0)
      └── Main content (flex-1, overflow-y-auto)
          └── Container with padding
  ```
- **Used by**: All `(dashboard)` routes
- **Features**:
  - Responsive sidebar (collapsible on mobile)
  - Fixed navbar with user greeting
  - Scrollable main content area

### Super Admin Dashboard Layout (`components/super-admin/SuperAdminDashboardLayout.tsx`)
- **Same structure** as regular DashboardLayout
- **Uses**: `SuperAdminSidebar` and `SuperAdminNavbar`
- **Used by**: All `/super-admin/*` routes

### Auth Layout (`app/(auth)/layout.tsx`)
- Centered, card-based layout for auth forms
- No sidebar/navbar
- Clean, focused design

### Navbar Components

#### Regular Navbar (`components/common/Navbar.tsx`)
- **Props**: None
- **Features**:
  - User greeting with first name
  - Profile button linking to `/settings/profile`
  - Sticky positioning at top
  - Border bottom for separation

#### Super Admin Navbar (`components/super-admin/SuperAdminNavbar.tsx`)
- **Same as regular Navbar**
- Greets "Super Admin" instead of user name

### Sidebar Components

#### Regular Sidebar (`components/common/Sidebar.tsx`)
- **Navigation Items**:
  - Dashboard
  - Members
  - Trainers
  - Attendance
  - Analytics
  - Billing
  - Settings
- **Features**:
  - Mobile-responsive (collapsible with hamburger)
  - Active route highlighting
  - Logout button at bottom
  - Uses Lucide icons

#### Super Admin Sidebar (`components/super-admin/SuperAdminSidebar.tsx`)
- **Navigation Items**:
  - Dashboard
  - Plans
  - Gyms (placeholder)
  - Owners (placeholder)
  - Billing (placeholder)
  - Analytics (placeholder)
  - Settings (placeholder)
- **Same responsive behavior** as regular sidebar

### Content Container Pattern
All dashboard pages use:
```tsx
<div className="container mx-auto p-6">
  {/* Page content */}
</div>
```

---

## 6. Theme & Design System

### Color Palette (Custom Neon/Orange Theme)

#### Primary Colors
- **Primary**: `oklch(0.68 0.24 40)` - Vibrant neon orange
- **Primary Foreground**: White
- **Primary Hover**: `oklch(0.73 0.26 40)` - Brighter orange

#### Secondary Colors
- **Secondary**: `oklch(0.2 0.01 0)` - Charcoal gray
- **Secondary Foreground**: White

#### Accent Colors
- **Accent**: `oklch(0.78 0.18 95)` - Electric yellow
- **Accent Foreground**: Near black
- **Accent Hover**: `oklch(0.82 0.2 95)` - Brighter yellow

#### Neutral Colors
- **Background**: `oklch(0.1 0.01 0)` - Near black
- **Foreground**: `oklch(0.95 0.01 0)` - Near white
- **Card**: `oklch(0.14 0.01 0)` - Dark gray
- **Card Foreground**: Near white
- **Popover**: Same as card
- **Muted**: `oklch(0.18 0.01 0)`
- **Muted Foreground**: `oklch(0.65 0.01 0)`
- **Border**: `oklch(0.22 0.01 0)`
- **Input**: Same as muted
- **Ring**: Same as primary

#### Destructive Colors
- **Destructive**: `oklch(0.58 0.24 25)` - Crimson red
- **Destructive Foreground**: White

#### Chart Colors
- **Chart 1**: Primary (neon orange)
- **Chart 2**: Accent (electric yellow)
- **Chart 3**: Destructive (crimson)
- **Chart 4**: Teal
- **Chart 5**: Purple

#### Sidebar Specific
- **Sidebar Background**: `oklch(0.12 0.01 0)` - Dark charcoal
- **Sidebar Primary**: Same as primary
- **Sidebar Accent**: Same as accent

### Typography
- **Font Family**: Geist (Sans) + Geist Mono
- **Hierarchy**:
  - Page titles: `text-3xl font-bold`
  - Section headers: `text-lg font-semibold`
  - Body: Default text size
  - Muted text: `text-muted-foreground`

### Spacing & Layout
- **Container**: `container mx-auto`
- **Page Padding**: `p-6`
- **Component Gap**: `gap-4`, `gap-2`
- **Card Padding**: Standard shadcn card padding

### Border Radius
- **Default**: `0.75rem` (12px)
- **Small**: `calc(var(--radius) - 4px)`
- **Medium**: `calc(var(--radius) - 2px)`
- **Large**: `var(--radius)`
- **Extra Large**: `calc(var(--radius) + 4px)`

### Shadows
Uses Tailwind's default shadow system with dark-mode optimization.

### Component Styling Patterns
- **Buttons**: Use shadcn Button variants
- **Cards**: Use shadcn Card component
- **Inputs**: Use shadcn Input/Textarea
- **Badges**: Use shadcn Badge with custom variants
- **Tables**: Use shadcn Table with custom styling

### Dark Mode
- **Default Theme**: Dark (near black background)
- **Theme Toggle**: (Future feature)
- **CSS Variables**: Defined for both light and dark modes

### Loading States
- **Skeletons**: Use shadcn Skeleton component
- **Spinners**: Custom LoadingSpinner component or button loading states
- **Table Loading**: "Loading..." text centered in table

### Empty States
- Use `EmptyState` component
- Customizable icon, title, description, and action button
- Centered layout with appropriate spacing

---

## 7. Tailwind & shadcn Configuration

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Key Config Details
- **Style**: Radix Nova (modern, rounded design)
- **RSC**: Enabled (Next.js Server Components)
- **Base Color**: Neutral
- **CSS Variables**: Enabled for theme customization
- **Icon Library**: Lucide React

### Import Aliases (tsconfig.json)
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

### Custom Utilities

#### `cn()` - Class Merge Utility (`lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
- **Purpose**: Safely merge Tailwind classes without conflicts
- **Usage**: Used in every component for conditional class names

### globals.css Structure
```css
/* 1. Imports */
@import 'tailwindcss';
@import 'tw-animate-css';

/* 2. Custom Variant */
@custom-variant dark (&:is(.dark *));

/* 3. CSS Variables (Root & Dark) */
:root { /* Light mode variables */ }
.dark { /* Dark mode variables */ }

/* 4. Theme Inline */
@theme inline { /* Tailwind theme config */ }

/* 5. Base Styles */
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

---

## 8. Shared Components

### Common Components (`components/common/`)

#### `PageHeader` - Page Title & Actions
- **File**: `components/common/PageHeader.tsx`
- **Props**:
  - `title: string` - Main page title
  - `description?: string` - Optional subtitle
  - `actions?: React.ReactNode` - Buttons/action components
- **Usage**:
  ```tsx
  <PageHeader
    title="Members"
    description="Manage your gym members"
    actions={<Button>Add Member</Button>}
  />
  ```
- **Layout**: Flex container with title on left, actions on right (responsive)

#### `EmptyState` - Empty/No Data State
- **File**: `components/common/EmptyState.tsx`
- **Props**:
  - `title: string` - Empty state title
  - `description?: string` - Helpful description
  - `icon?: React.ReactNode` - Custom icon (defaults to AlertCircle)
  - `action?: React.ReactNode` - Action button
- **Usage**:
  ```tsx
  <EmptyState
    title="No members found"
    description="Get started by adding your first member"
    action={<Button>Add Member</Button>}
  />
  ```

#### `DataTable` - Reusable Data Table
- **File**: `components/common/DataTable.tsx`
- **Props**:
  - `columns: Column<T>[]` - Column definitions
  - `data: T[]` - Data array
  - `isLoading?: boolean` - Loading state
  - `onSort?: (key, direction) => void` - Sort handler
  - `sortKey?: keyof T` - Current sort key
  - `sortDirection?: 'asc' | 'desc'` - Current sort direction
- **Column Interface**:
  ```typescript
  interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, item: T) => React.ReactNode;
    width?: string;
  }
  ```
- **Features**:
  - Loading state
  - Empty state
  - Sortable columns
  - Custom cell rendering
  - Responsive width

#### `DashboardLayout` - Main Layout Wrapper
- **File**: `components/common/DashboardLayout.tsx`
- **Props**:
  - `children: React.ReactNode` - Page content
- **See**: Layout System section above

#### `Navbar` - Top Navigation Bar
- **File**: `components/common/Navbar.tsx`
- **See**: Layout System section above

#### `Sidebar` - Left Navigation
- **File**: `components/common/Sidebar.tsx`
- **See**: Layout System section above

#### Other Common Components
- `ConfirmDialog` - Generic confirmation dialog
- `ErrorBoundary` - React error boundary
- `FormField` - Reusable form field wrapper
- `LoadingSpinner` - Loading indicator
- `Pagination` - Pagination controls
- `RoleBadge` - Displays user role with color
- `SearchInput` - Search input field
- `StatusBadge` - Displays status with color

### Super Admin Components (`components/super-admin/`)

#### `SuperAdminDashboardLayout`
- **File**: `components/super-admin/SuperAdminDashboardLayout.tsx`
- **See**: Layout System section above

#### `SuperAdminNavbar`
- **File**: `components/super-admin/SuperAdminNavbar.tsx`
- **See**: Layout System section above

#### `SuperAdminSidebar`
- **File**: `components/super-admin/SuperAdminSidebar.tsx`
- **See**: Layout System section above

#### Plans Module Components
- `PlanCard` - Displays a single plan as a card
- `PlanForm` - Form for creating/editing plans
- `PlansTable` - Table view of all plans
- `DeletePlanDialog` - Confirmation dialog for plan deletion
- `FeatureEditor` - Dynamic feature key-value editor
- `LoadingSkeleton` - Skeleton loaders for plans page
- `EmptyState` - Empty state for plans list

### shadcn/ui Components (`components/ui/`)
All shadcn components are available and should be used as the base for any new components. Key ones include:
- `Button` - Primary UI button
- `Card` - Card container
- `Dialog` - Modal dialog
- `Input` - Text input
- `Textarea` - Multi-line input
- `Select` - Dropdown select
- `Table` - Table components
- `Badge` - Status/badge display
- `Avatar` - User avatar
- `Skeleton` - Loading skeleton
- `Toast` - Notifications (via Sonner)

### Component Composition Pattern
- Always compose from shadcn/ui primitives
- Use `cn()` for class merging
- Prefer controlled components
- Use TypeScript interfaces for props
- Keep components focused and reusable

---

## 9. Existing Pages

### Authentication Pages

#### Login Page (`app/(auth)/login/page.tsx`)
- **Route**: `/login`
- **Layout**: Auth layout (centered card)
- **Component**: `LoginForm`
- **Features**:
  - Email/password login
  - Link to forgot password
  - Link to register
  - Redirects to dashboard on success
  - Redirects to super-admin plans if logging in as super admin

#### Register Page (`app/(auth)/register/page.tsx`)
- **Route**: `/register`
- **Layout**: Auth layout
- **Component**: `RegisterForm`
- **Features**: Complete gym registration flow

#### Forgot Password Page (`app/(auth)/forgot-password/page.tsx`)
- **Route**: `/forgot-password`
- **Layout**: Auth layout
- **Component**: `ForgotPasswordForm`

#### Reset Password Page (`app/(auth)/reset-password/page.tsx`)
- **Route**: `/reset-password`
- **Layout**: Auth layout
- **Component**: `ResetPasswordForm`

### Dashboard Pages

#### Dashboard Home (`app/(dashboard)/page.tsx`)
- **Route**: `/`
- **Layout**: DashboardLayout
- **Status**: Placeholder/In Progress
- **Purpose**: Main dashboard landing with widgets

#### Members List (`app/(dashboard)/members/page.tsx`)
- **Route**: `/members`
- **Layout**: DashboardLayout
- **Components Used**: PageHeader, DataTable, EmptyState, Button
- **Features**:
  - Member list table
  - Add member button
  - Empty state
  - (Future: Search, filters, pagination)

#### Member Detail (`app/(dashboard)/members/[id]/page.tsx`)
- **Route**: `/members/[id]`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Member Edit (`app/(dashboard)/members/[id]/edit/page.tsx`)
- **Route**: `/members/[id]/edit`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Trainers List (`app/(dashboard)/trainers/page.tsx`)
- **Route**: `/trainers`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Attendance (`app/(dashboard)/attendance/page.tsx`)
- **Route**: `/attendance`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Billing (`app/(dashboard)/billing/page.tsx`)
- **Route**: `/billing`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Analytics (`app/(dashboard)/analytics/page.tsx`)
- **Route**: `/analytics`
- **Layout**: DashboardLayout
- **Status**: In Progress

#### Settings (`app/(dashboard)/settings/page.tsx`)
- **Route**: `/settings`
- **Layout**: DashboardLayout
- **Status**: In Progress

### Super Admin Pages

#### Super Admin Dashboard (`app/(dashboard)/super-admin/page.tsx`)
- **Route**: `/super-admin`
- **Layout**: SuperAdminDashboardLayout
- **Features**:
  - Welcome card
  - Navigation cards linking to main sections
  - Uses Lucide icons
  - Card-based layout

#### Plans List (`app/(dashboard)/super-admin/plans/page.tsx`)
- **Route**: `/super-admin/plans`
- **Layout**: SuperAdminDashboardLayout
- **Components Used**:
  - PageHeader
  - PlansTable / PlanCard (grid/table toggle)
  - EmptyState
  - DeletePlanDialog
- **Features**:
  - Display all plans (table view)
  - Create plan button
  - Edit plan links
  - Delete plan with confirmation
  - Loading skeletons
  - Error handling with toasts
  - Empty state with create button

#### Create Plan (`app/(dashboard)/super-admin/plans/create/page.tsx`)
- **Route**: `/super-admin/plans/create`
- **Layout**: SuperAdminDashboardLayout
- **Components Used**: PageHeader, PlanForm, Button
- **Features**:
  - Full plan creation form
  - Dynamic feature editor (add/remove features)
  - Validation with Zod
  - Loading state
  - Success/error toasts
  - Cancel button returns to plans list

#### Edit Plan (`app/(dashboard)/super-admin/plans/[id]/edit/page.tsx`)
- **Route**: `/super-admin/plans/[id]/edit`
- **Layout**: SuperAdminDashboardLayout
- **Components Used**: PageHeader, PlanForm, Button
- **Features**:
  - Pre-populates form with existing plan data
  - Same features as create form
  - Fetches plan data on load
  - Loading state while fetching
  - Returns to plans list on success

### Setup Pages

#### Super Admin Setup (`app/setup/super-admin/page.tsx`)
- **Route**: `/setup/super-admin`
- **Layout**: Root layout
- **Component**: SuperAdminSetupForm
- **Purpose**: Initial super admin account creation

### Marketing Pages

#### Landing Page (`app/page.tsx`)
- **Route**: `/`
- **Layout**: Root layout
- **Status**: In Progress

#### Features (`app/(platform)/features/page.tsx`)
- **Route**: `/features`
- **Layout**: Platform layout
- **Status**: Placeholder

#### Pricing (`app/(platform)/pricing/page.tsx`)
- **Route**: `/pricing`
- **Layout**: Platform layout
- **Status**: Placeholder

---

## 10. Forms

### Form Architecture
1. **Form Library**: React Hook Form (controlled components)
2. **Validation**: Zod schemas + @hookform/resolvers
3. **UI Components**: shadcn/ui Form + Input/Select/etc.
4. **Pattern**: Always extract forms into separate components

### Form Component Pattern
```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

interface MyFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  defaultValues?: Partial<FormValues>;
}

export function MyForm({ onSubmit, defaultValues }: MyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
```

### Existing Form Schemas (`schemas/`)
- `auth.schema.ts` - Login, register, forgot/reset password
- `member.schema.ts` - Member CRUD
- `trainer.schema.ts` - Trainer CRUD
- `attendance.schema.ts` - Attendance marking
- `goal.schema.ts` - Member goals
- `billing.schema.ts` - Billing/upgrade
- `settings.schema.ts` - Settings forms
- `plans.ts` - Plan CRUD

### PlanForm Example (`components/super-admin/plans/PlanForm.tsx`)
- **Features**:
  - Name, price, currency, interval fields
  - Stripe Price ID (optional)
  - Dynamic FeatureEditor (add/remove key-value pairs)
  - Converts empty `stripePriceId` to `undefined` before submission
  - Loading button state
  - Cancel button

### Key Form Patterns
1. **Always use Zod**: For schema validation
2. **Server submission**: Call services in submit handler
3. **Loading states**: Disable buttons during submission
4. **Error handling**: Try/catch with toast notifications
5. **Default values**: Accept partial defaults for edit forms
6. **Reset on success**: Clear form after successful submission

---

## 11. Tables

### Table Architecture
- **Base Component**: shadcn/ui Table
- **Reusable Wrapper**: `DataTable` (common/DataTable.tsx)
- **Pattern**: Define columns with optional custom renderers

### DataTable Usage
```tsx
import { DataTable, type Column } from '@/components/common/DataTable';

interface Member {
  id: string;
  name: string;
  email: string;
  status: string;
}

const columns: Column<Member>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  {
    key: 'status',
    label: 'Status',
    render: (status) => <StatusBadge status={status as any} />,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_, member) => (
      <Button variant="ghost" size="sm">Edit</Button>
    ),
  },
];

export function MembersTable({ members }: { members: Member[] }) {
  return <DataTable columns={columns} data={members} />;
}
```

### PlansTable Example (`components/super-admin/plans/PlansTable.tsx`)
- **Columns**:
  - Name
  - Price (formatted)
  - Interval
  - Features count
  - Created At (formatted)
  - Actions (Edit, Delete)
- **Features**:
  - Custom renderers for price, features, dates
  - Delete button opens ConfirmDialog
  - Edit button links to edit page
  - Uses Badge for interval display

### Table Best Practices
- Always use `DataTable` wrapper for consistency
- Define column types with TypeScript generics
- Use custom `render` function for complex cells
- Include loading state in tables
- Add empty state when no data
- Make columns sortable when appropriate

---

## 12. Navigation

### Sidebar Navigation
- **Component**: `Sidebar` / `SuperAdminSidebar`
- **Pattern**: Array of nav items with href, label, icon
- **Active State**: Uses `usePathname()` to check current route
- **Responsive**: Collapses to hamburger menu on mobile

### Nav Item Interface
```typescript
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
```

### Breadcrumbs
- **Status**: Not yet implemented
- **Location**: Would go in Navbar or PageHeader

### Route Constants (`config/routes.ts`)
- **Purpose**: Centralize route definitions
- **Usage**: Use instead of hardcoding URLs
- **Example**:
  ```typescript
  export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/',
    MEMBERS: '/members',
    SUPER_ADMIN: {
      ROOT: '/super-admin',
      PLANS: '/super-admin/plans',
    },
  } as const;
  ```

### Navigation Helper Patterns
- Use `next/link` for all internal navigation
- Use `useRouter` from `next/navigation` for programmatic navigation
- Never hardcode full paths, use route constants
- Remember: Route group folders like `(dashboard)` don't appear in URLs

---

## 13. State Management

### Zustand - Global State

#### Auth Store (`store/authStore.ts`)
- **Purpose**: Manage authentication state, user data, permissions
- **State**:
  - `user: User | null` - Current user
  - `tenant: Tenant | null` - Current tenant/gym
  - `authType: 'user' | 'superAdmin'` - Auth mode
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
  - `isInitialized: boolean`
  - `permissions: string[]` - RBAC permissions
- **Actions**:
  - `setAuth(user, tenant, accessToken)` - Set full auth state
  - `setUser(user)` - Update just user
  - `setTenant(tenant)` - Update just tenant
  - `setLoading(isLoading)`
  - `setInitialized(isInitialized)`
  - `logout()` - Clear auth and redirect
  - `reset()` - Reset to initial state
- **Permission Helpers**:
  - `hasPermission(permission)` - Check single permission
  - `hasAnyPermission(permissions[])` - Check if any match
  - `hasAllPermissions(permissions[])` - Check if all match
- **Persistence**: LocalStorage via zustand persist middleware
- **Selectors**: Named selectors for common state pieces

#### Other Stores
- `uiStore.ts` - UI state (theme, modals, etc.)
- `filtersStore.ts` - Filter states for lists

### TanStack Query - Server State

#### Query Key Factory (`services/queryKeys.ts`)
- **Pattern**: Nested factory functions for type-safe query keys
- **Structure**:
  ```typescript
  export const queryKeys = {
    auth: {
      all: ['auth'] as const,
      me: () => [...queryKeys.auth.all, 'me'] as const,
    },
    members: {
      all: ['members'] as const,
      lists: () => [...queryKeys.members.all, 'list'] as const,
      list: (params) => [...queryKeys.members.lists(), params] as const,
      detail: (id) => [...queryKeys.members.all, 'detail', id] as const,
    },
    superAdmin: {
      plans: {
        all: () => ['super-admin', 'plans'] as const,
        list: () => [...queryKeys.superAdmin.plans.all(), 'list'] as const,
        detail: (id) => [...queryKeys.superAdmin.plans.all(), 'detail', id] as const,
      },
    },
  };
  ```
- **Usage**:
  ```typescript
  // Query
  useQuery({
    queryKey: queryKeys.members.list({ page: 1 }),
    queryFn: () => membersService.getMembers(),
  });
  
  // Invalidation
  queryClient.invalidateQueries({
    queryKey: queryKeys.members.all,
  });
  ```

#### QueryProvider (`providers/QueryProvider.tsx`)
- Wraps app with TanStack Query Provider
- Configured with:
  - `staleTime: 5 * 60 * 1000` (5 minutes)
  - `gcTime: 10 * 60 * 1000` (10 minutes)
  - Default error handling

#### Custom Query Hooks
- `hooks/super-admin/usePlans.ts` - Super Admin plans queries and mutations
- Pattern: One hook per feature with `useQuery`, `useMutation`, and helpers

### React Query Usage Patterns
```typescript
// Query (fetch data)
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.superAdmin.plans.list(),
  queryFn: plansService.getPlans,
});

// Mutation (create/update/delete)
const createMutation = useMutation({
  mutationFn: plansService.createPlan,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.plans.all() });
    toast.success('Plan created');
    router.push('/super-admin/plans');
  },
  onError: (error) => {
    toast.error('Failed to create plan');
  },
});

// Call mutation
createMutation.mutate(planData);

// With loading state
<Button disabled={createMutation.isPending}>
  {createMutation.isPending ? 'Creating...' : 'Create'}
</Button>
```

---

## 14. API Layer

### API Client (`lib/api/client.ts`)
- **Library**: Axios
- **Base URL**: From `NEXT_PUBLIC_API_URL` env var, defaults to `http://localhost:5000/api/v1`
- **Features**:
  - Automatic access token injection
  - Token refresh on 401 responses
  - Request deduplication during refresh
  - Error parsing and transformation
  - Typed request helpers

#### Token Management
- Access token stored in-memory (not localStorage for security)
- Refresh token stored in httpOnly cookie
- `refreshAccessToken()` - Handles token refresh with deduplication
- `setAuthType()` - Switch between 'user' and 'superAdmin' auth modes
- `getAuthType()` - Get current auth mode (checks localStorage)

#### Request Helpers
```typescript
get<T>(url, params) // GET request
post<T>(url, data, config) // POST request
patch<T>(url, data) // PATCH request
del<T>(url) // DELETE request
uploadFile<T>(url, file, fieldName) // File upload
```

### API Configuration (`config/api.config.ts`)
- **API_BASE_URL**: Base URL for API
- **FRONTEND_URL**: Frontend URL for redirects
- **API_ENDPOINTS**: Nested object with all endpoint definitions
- **TIMEOUTS**: Request timeout values
- **RATE_LIMITS**: Rate limit info

#### Endpoint Pattern
```typescript
export const API_ENDPOINTS = {
  SUPER_ADMIN: {
    PLANS: {
      LIST: '/super-admin/plan/get-all-plans',
      CREATE: '/super-admin/plan/create-plan',
      GET: (id: string) => `/super-admin/plan/${id}`,
      UPDATE: (id: string) => `/super-admin/plan/update-plan/${id}`,
      DELETE: (id: string) => `/super-admin/plan/delete-plan/${id}`,
    },
  },
  MEMBERS: {
    LIST: '/members',
    GET: (id: string) => `/members/${id}`,
  },
} as const;
```

### Services Layer (`services/`)
- **Pattern**: One service file per domain
- **Responsibility**: API calls, data transformation, error handling
- **Never**: Call API directly from components, always use services
- **Super Admin Services**:
  - `super-admin/auth.service.ts` - Super admin auth
  - `super-admin/plans.service.ts` - Plan CRUD
- **Regular Services**:
  - `auth.service.ts` - User auth
  - `members.service.ts` - Member CRUD
  - `trainers.service.ts` - Trainer CRUD
  - `attendance.service.ts` - Attendance
  - `billing.service.ts` - Billing
  - `tenant.service.ts` - Tenant/gym management

#### Service Example
```typescript
import apiClient, { get } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Plan, CreatePlanRequest, UpdatePlanRequest } from '@/types';

export const plansService = {
  async getPlans(): Promise<Plan[]> {
    const response = await get<{ success: boolean; data: Plan[] }>(
      API_ENDPOINTS.SUPER_ADMIN.PLANS.LIST
    );
    return response.data;
  },

  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    // Convert empty string to undefined for optional fields
    const payload = {
      ...data,
      stripePriceId: data.stripePriceId || undefined,
    };
    const response = await apiClient.post<{ success: boolean; data: Plan }>(
      API_ENDPOINTS.SUPER_ADMIN.PLANS.CREATE,
      payload
    );
    return response.data.data;
  },

  async updatePlan(id: string, data: UpdatePlanRequest): Promise<Plan> {
    const payload = {
      ...data,
      stripePriceId: data.stripePriceId || undefined,
    };
    const response = await apiClient.patch<{ success: boolean; data: Plan }>(
      API_ENDPOINTS.SUPER_ADMIN.PLANS.UPDATE(id),
      payload
    );
    return response.data.data;
  },

  async deletePlan(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SUPER_ADMIN.PLANS.DELETE(id));
  },
};
```

### Error Handling (`lib/api/errors.ts`)
- **parseApiError()**: Transforms Axios errors into consistent format
- **ErrorCode**: Enum of error codes
- **Pattern**: Errors returned as `ApiError` type with message, statusCode, errorCode

### Authentication Flow
1. User logs in with email/password
2. Backend returns accessToken + sets refreshToken cookie
3. Access token stored in-memory
4. Auth state persisted in localStorage (user, tenant, authType)
5. Subsequent requests include access token in Authorization header
6. On 401:
   - If refreshing not in progress, call refresh endpoint
   - Queue other requests during refresh
   - Retry original requests with new token
   - If refresh fails, trigger logout

### Super Admin vs Regular User Auth
- **Separate endpoints** for super admin auth
- `authType` state tracks which mode we're in
- Different refresh endpoints used based on authType
- Token storage same for both, just authType differs

---

## 15. Types

### Core Model Types (`types/models.ts`)

#### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: TenantRole | string;
  isActive?: boolean;
}
```

#### Tenant (Gym)
```typescript
interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  city: string;
  country: string;
  address?: string;
  timezone?: string;
  isActive?: boolean;
  stripeCustomerId?: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptions?: SubscriptionWithPlan[];
}
```

#### Member
```typescript
interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  createdAt: string;
  dateOfBirth?: string | null;
  assignedTrainer?: {
    id: string;
    user: { firstName: string; lastName: string };
  } | null;
  _count?: { attendances: number };
}
```

#### Trainer
```typescript
interface Trainer {
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
```

#### Plan
```typescript
interface Plan {
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

interface PlanFeatures {
  maxMembers: number;
  maxTrainers: number;
  prioritySupport: boolean;
  [key: string]: string | number | boolean;
}
```

#### Attendance
```typescript
interface Attendance {
  id: string;
  checkIn: string;
  checkOut?: string | null;
  date?: string;
  deviceInfo?: string | null;
  member?: {
    firstName: string;
    lastName: string;
    email?: string;
    status?: MemberStatus;
  };
}
```

### Enums & Union Types
```typescript
type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'DELETED';
type PlanName = 'FREE' | 'BASIC' | 'PRO';
type BillingInterval = 'MONTHLY' | 'YEARLY';
type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING';
type TenantRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'TRAINER';
type GoalType = 'GAIN' | 'LOSS';
type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
```

### Auth Types (`types/auth.ts`)
- LoginRequest, RegisterGymRequest, etc.
- LoginResponse, RegisterGymResponse, etc.
- AccessTokenPayload, AuthState
- SuperAdminSetupRequest, SuperAdminLoginRequest

### API Types (`types/api.ts`)
- Paginated response types
- Request/response types for each endpoint
- See file for complete definitions

### Plan Types (`types/plans.ts`)
- CreatePlanRequest, UpdatePlanRequest
- PlansResponse, PlanResponse, DeletePlanResponse
- FeatureEntry for dynamic feature editor

### Type Organization
- All types exported from `types/index.ts`
- Import from `@/types` for convenience
- Use `as const` for string literal unions
- Prefer interfaces for objects, types for unions/intersections

---

## 16. Utilities

### Helper Functions (`lib/helpers/`)

#### `formatting.ts`
- **formatCurrency()** - Format currency values
- **formatDate()** - Format dates (uses date-fns)
- **formatDateTime()** - Format date + time
- **formatRelativeTime()** - Relative time (e.g., "2 hours ago")

#### `validation.ts`
- **validateEmail()** - Email validation
- **validatePhone()** - Phone number validation
- **validatePassword()** - Password strength check

#### `jwt.ts`
- **decodeToken()** - Decode JWT without validation
- **getTokenExpiry()** - Get token expiration time

#### `constants.ts`
- Regex patterns
- Validation rules
- Default values

### Other Utilities

#### `lib/utils.ts`
- **cn()** - Class merge utility (clsx + tailwind-merge)
- **Other helpers** as needed

#### `constants/`
- **messages.ts** - Success/error message constants
- **pagination.ts** - Default page sizes
- **roles.ts** - Role definitions and metadata
- **status.ts** - Status definitions and colors

#### `config/permissions.ts`
- **getPermissionsForRole(role)** - Get permissions array for a role
- **PERMISSIONS** - Object with all permission constants
- **ROLE_PERMISSIONS** - Role to permissions mapping

### Custom Hooks (`hooks/`)
- **useAuth()** - Auth state and actions
- **useDebounce()** - Debounce values for search
- **useFetch()** - Simple fetch wrapper
- **useLocalStorage()** - Local storage state
- **use-mobile.ts** - Detect mobile viewport
- **usePagination()** - Pagination state management
- **useSearch()** - Search state management
- **use-toast.ts** - Sonner toast hooks

---

## 17. Styling Conventions

### Naming Conventions
- **Components**: PascalCase (`MemberCard`, `PlanForm`)
- **Props Interface**: `ComponentNameProps`
- **Files**: PascalCase for components, camelCase for others
- **CSS Classes**: kebab-case (Tailwind utilities)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Spacing Conventions
- **Page padding**: `p-6`
- **Component gap**: `gap-4` or `gap-2`
- **Form spacing**: `space-y-4`
- **Card padding**: Default shadcn card padding
- **Buttons**: Standard size by default, sm for dense areas

### Responsive Strategy
- Mobile-first approach
- Use `sm:`, `md:`, `lg:`, `xl:` modifiers
- Sidebar hidden on mobile, visible on md+
- Use flex-wrap for responsive layouts
- Stack elements vertically on mobile

### Component Composition
- Build from shadcn/ui primitives
- Use composition over inheritance
- Keep components small and focused
- Prefer controlled components
- Use slots pattern when needed

### Animation Patterns
- Use `tw-animate-css` for animations
- Subtle transitions for interactive elements
- Loading states with skeletons
- Avoid excessive animations

### Dark Mode
- Design for dark mode first
- Use CSS variables for all colors
- Test both modes
- Follow existing color system

---

## 18. Coding Conventions

### Folder Organization
- **Feature-based**: Group components, hooks, services by feature
- **Shared components**: `components/common/`
- **UI primitives**: `components/ui/`
- **Feature components**: `components/features/[feature]/`
- **Super Admin**: `components/super-admin/`
- **Services**: `services/[feature]/`
- **Hooks**: `hooks/[feature]/`
- **Types**: `types/[feature].ts`
- **Schemas**: `schemas/[feature].schema.ts`

### File Naming
- **Components**: `FeatureName.tsx` (PascalCase)
- **Hooks**: `useFeatureName.ts` (camelCase with use prefix)
- **Services**: `feature.service.ts` (camelCase)
- **Types**: `feature.ts` (camelCase)
- **Schemas**: `feature.schema.ts`
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)

### Import Aliases
- Always use `@/` alias instead of relative paths
- Examples:
  - `@/components/ui/button`
  - `@/lib/utils`
  - `@/types`
  - `@/services/queryKeys`

### Component Structure
```tsx
// 1. Imports (external first, then internal)
'use client'; // If client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

// 2. Types/interfaces
interface MyComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

// 3. Component function
export function MyComponent({ title, onAction, className }: MyComponentProps) {
  // 4. Hooks
  const router = useRouter();
  const { user } = useAuth();

  // 5. State/derived values
  const [isOpen, setIsOpen] = React.useState(false);

  // 6. Handlers
  const handleClick = () => {
    setIsOpen(true);
    onAction?.();
  };

  // 7. Render
  return (
    <div className={cn('p-4', className)}>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
}

// 8. Default export (optional, prefer named)
// export default MyComponent;
```

### TypeScript Conventions
- Strict mode enabled
- No `any` - use `unknown` instead
- Prefer interfaces for object types
- Use `as const` for literal unions
- Type all function parameters and returns
- Use generics for reusable components

### Client vs Server Components
- **Default**: Server component (no 'use client')
- **Use 'use client' when**:
  - Using hooks (useState, useEffect, useQuery, etc.)
  - Using browser APIs
  - Handling user interactions
  - Using event handlers
- **Keep server components**:
  - Page components (when possible)
  - Layouts (when possible)
  - Static content

### Error Handling
- Always try/catch async operations
- Use toast notifications for user feedback
- Parse API errors consistently
- Provide loading states
- Handle empty states

### Form Submission Pattern
```tsx
const handleSubmit = async (data: FormData) => {
  try {
    setIsLoading(true);
    await service.doSomething(data);
    toast.success('Success!');
    router.push('/somewhere');
  } catch (error) {
    toast.error('Failed to do something');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 19. Important Files

| File | Purpose | Why Important |
|------|---------|---------------|
| `package.json` | Dependencies & scripts | Source of truth for tech stack |
| `components.json` | shadcn/ui config | Must update when adding new components |
| `tsconfig.json` | TypeScript config | Path aliases, compiler options |
| `next.config.ts` | Next.js config | Build config, images, etc. |
| `app/globals.css` | Global styles & CSS variables | Theme definition, Tailwind config |
| `app/layout.tsx` | Root layout | Providers, metadata, font loading |
| `config/api.config.ts` | API endpoints | All API routes defined here |
| `config/permissions.ts` | RBAC permissions | Role-based access control |
| `config/routes.ts` | Route constants | Centralized route definitions |
| `lib/api/client.ts` | Axios client | API requests, token refresh |
| `services/queryKeys.ts` | Query key factory | Type-safe cache management |
| `store/authStore.ts` | Zustand auth store | Global auth state |
| `hooks/useAuth.ts` | Auth hook | Main auth interface for components |
| `providers/AuthProvider.tsx` | Auth provider | Initializes auth on app load |
| `providers/QueryProvider.tsx` | TanStack Query provider | Query client setup |
| `components/common/DashboardLayout.tsx` | Main layout | Used by all dashboard pages |
| `components/common/PageHeader.tsx` | Page header | Consistent page titles/actions |
| `components/common/DataTable.tsx` | Data table | Reusable table component |
| `components/super-admin/SuperAdminDashboardLayout.tsx` | Super Admin layout | Special layout for super admin |
| `types/models.ts` | Core types | All data models defined here |
| `lib/utils.ts` | cn() utility | Used in every component |

---

## 20. Existing Design Language

### Visual Style
- **Modern SaaS Dashboard** with dark mode
- **Minimalist** - Clean, focused interface
- **Card-based** - Content organized in cards
- **Rounded corners** - Soft, approachable feel
- **Neon/orange accents** - Energetic brand color
- **Charcoal gray base** - Professional dark theme
- **High contrast** - Excellent readability

### UI Patterns
- **Navigation**: Left sidebar + top navbar
- **Page structure**: PageHeader -> content -> actions
- **Data display**: Tables for lists, cards for details
- **Actions**: Buttons with clear icons/labels
- **Feedback**: Toast notifications for success/error
- **Loading**: Skeletons instead of spinners where possible
- **Empty states**: Clear messaging + call to action

### Color Usage
- **Primary (neon orange)**: Main CTAs, active states, primary buttons
- **Accent (electric yellow)**: Secondary CTAs, highlights
- **Destructive (crimson)**: Delete/danger actions
- **Neutrals**: Everything else - text, backgrounds, borders

### Typography Hierarchy
- **Page title**: 3xl, bold
- **Section header**: lg, semibold
- **Card header**: md, semibold
- **Body text**: base
- **Muted text**: muted-foreground color

### Spacing Rhythm
- **Consistent 4px grid**
- **Page padding**: 24px (p-6)
- **Component gaps**: 16px (gap-4) or 8px (gap-2)
- **Card padding**: Default shadcn card padding

### Component Patterns
- All buttons from shadcn Button
- All cards from shadcn Card
- All inputs from shadcn Input/Select/etc.
- All dialogs from shadcn Dialog
- Icons from Lucide React only
- Consistent use of Badge for status/role

---

## 21. Component Reuse Guidelines

### ALWAYS Reuse These Components

#### Layout Components
- ✅ `DashboardLayout` / `SuperAdminDashboardLayout` - Never create custom layouts
- ✅ `PageHeader` - Always use for page titles and actions
- ✅ `Navbar` / `Sidebar` variants - Use existing navigation

#### UI Primitives (from shadcn/ui)
- ✅ `Button` - Never create custom buttons
- ✅ `Card` - Always use Card for content containers
- ✅ `Input` / `Textarea` / `Select` - All form inputs from shadcn
- ✅ `Dialog` - Use for all modals
- ✅ `Table` - Use shadcn Table + DataTable wrapper
- ✅ `Badge` - For status, roles, tags
- ✅ `Avatar` - For user profiles
- ✅ `Skeleton` - For loading states
- ✅ `Toast` - Use Sonner for notifications

#### Common Components
- ✅ `DataTable` - For all data lists
- ✅ `EmptyState` - For empty/no-data states
- ✅ `ConfirmDialog` - For delete/confirm actions
- ✅ `StatusBadge` / `RoleBadge` - For status/role display

#### Forms & Validation
- ✅ React Hook Form + Zod - Always use this pattern
- ✅ shadcn Form components - For form structure
- ✅ Existing schema files - Add to them instead of creating new

#### Data Fetching
- ✅ TanStack Query - All server state
- ✅ `queryKeys` factory - Never create ad-hoc query keys
- ✅ Service layer - Never call API directly from components
- ✅ Custom hooks - Use or create hooks like `usePlans`

#### State Management
- ✅ Zustand auth store - Use `useAuth()` hook
- ✅ Never create new global stores without good reason

### How to Extend Components
1. **Check if shadcn has it first** - shadcn/ui is very comprehensive
2. **Check common components** - Maybe what you need exists
3. **Create in components/common** - If truly reusable
4. **Create in feature folder** - If feature-specific
5. **Follow existing patterns** - Look at similar components for reference

### When to Create New Components
- When UI pattern repeats 2+ times
- When component logic is complex
- When you need to share across pages
- When component is self-contained and reusable

### Never Do This
- ❌ Create custom buttons - use shadcn Button with variants
- ❌ Create custom cards - use shadcn Card
- ❌ Create custom modals - use shadcn Dialog
- ❌ Call API directly from components - use services
- ❌ Hardcode URLs - use route constants
- ❌ Use inline styles - use Tailwind classes
- ❌ Create new color variables - use existing theme
- ❌ Bypass the service layer - always use services

---

## Final Notes for V0

### Building New Pages
1. Start with the appropriate layout
2. Add PageHeader with title and actions
3. Use DataTable for lists, Cards for details
4. Use existing form patterns with Zod validation
5. Use service layer + TanStack Query for data
6. Use existing shared components
7. Follow the design language

### Adding Super Admin Features
- Use `SuperAdminDashboardLayout`
- Add nav item to `SuperAdminSidebar`
- Create components in `components/super-admin/[feature]/`
- Create service in `services/super-admin/[feature].service.ts`
- Add query keys to `services/queryKeys.ts`
- Create custom hook in `hooks/super-admin/use[Feature].ts`
- Add types/schemas as needed

### Adding Regular Gym Features
- Use `DashboardLayout`
- Add nav item to `Sidebar`
- Create components in `components/features/[feature]/`
- Create service in `services/[feature].service.ts`
- Follow the same patterns as Super Admin features

### Key Patterns to Follow
- Route groups don't appear in URLs
- Convert empty strings to undefined for optional API fields
- Always use queryKey factory
- Always use service layer
- Always use useAuth() hook for auth state
- Always use cn() for class merging
- Always use TypeScript strictly

### Environment Variables
Copy `example-env` to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Dev Server
```bash
pnpm dev
# or
npm run dev
```

---

This is your complete guide to building consistently with the existing codebase. When in doubt, look at existing files and follow the patterns exactly!
