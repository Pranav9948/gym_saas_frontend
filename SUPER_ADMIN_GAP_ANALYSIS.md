# Superadmin Integration Copy Guide

## 1. Overview

This guide covers the **GymFlow Super Admin** section that was generated in the previous response. It is a self-contained set of admin pages plus the shared shell, common components, chart wrappers, hooks, and config needed to run them. It was built to match GymFlow's documented design system (neon/orange dark theme, `oklch` tokens, Geist fonts, `0.75rem` radius) and folder conventions so the files are drop-in compatible with the real repository.

**Major features / modules included:**

- **Super Admin shell** — collapsible grouped sidebar (`SuperAdminSidebar`), top navbar with search + user menu (`SuperAdminNavbar`), and a layout wrapper (`SuperAdminDashboardLayout`).
- **Route-group layout** — `app/(dashboard)/super-admin/layout.tsx` with an auth guard + loading state.
- **Dashboard page** — platform KPIs, revenue area chart, plan-distribution donut, recent gyms table.
- **Gyms page** — searchable + status-filterable gym table with stat cards and empty state.
- **Billing page** — collections summary, revenue bar chart, invoices table.
- **Analytics page** — member-growth chart, revenue trend, plan mix, top-performing gyms.
- **Shared common components** — `LoadingSpinner`, `StatusBadge`, `EmptyState`, `PageHeader`, `StatCard`.
- **Chart wrappers** — `RevenueAreaChart`, `PlanDonutChart`, `BillingBarChart`, `MemberGrowthChart`.
- **Hooks** — `useAuth`, `useToast`, `useIsMobile` (preview stubs mirroring the production API shape).
- **Config + preview data** — `config/index.ts` (`ROUTES`, `APP_NAME`) and `lib/super-admin-mock.ts` (labeled preview fixtures).

> **Note on stubs:** `hooks/use-auth.ts`, `hooks/use-toast.ts`, and `lib/super-admin-mock.ts` are **preview stubs / fixtures**. In the real GymFlow repo you already have production equivalents (Zustand + TanStack Query auth, Sonner toasts, `services/` API layer). See Section 4 and Section 10 for how to reconcile them.

---

## 2. Copy Order (Very Important)

Follow this dependency order so nothing imports a file that does not yet exist.

### Step 1 — Create folders

- `config/`
- `hooks/`
- `lib/` (already exists in most projects)
- `components/common/`
- `components/super-admin/`
- `components/super-admin/charts/`
- `components/ui/` (already exists — shadcn)
- `app/(dashboard)/super-admin/`
- `app/(dashboard)/super-admin/gyms/`
- `app/(dashboard)/super-admin/billing/`
- `app/(dashboard)/super-admin/analytics/`

### Step 2 — Copy shared utilities / config / data

- `config/index.ts`
- `lib/super-admin-mock.ts`
- `lib/utils.ts` (only if your project does not already have `cn`)

### Step 3 — Copy shared UI (shadcn) components

Install via CLI (see Section 7) or copy these files if you are copying manually:

- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/table.tsx`
- `components/ui/avatar.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/input.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/separator.tsx`
- `components/ui/tabs.tsx`
- `components/ui/chart.tsx`
- `components/ui/button.tsx` (already present in scaffold)

### Step 4 — Copy hooks

- `hooks/use-mobile.ts`
- `hooks/use-toast.ts`
- `hooks/use-auth.ts`
- `hooks/index.ts` (barrel — copy last)

### Step 5 — Copy common components

- `components/common/LoadingSpinner.tsx`
- `components/common/StatusBadge.tsx`
- `components/common/EmptyState.tsx`
- `components/common/PageHeader.tsx`
- `components/common/StatCard.tsx`
- `components/common/index.ts` (barrel — copy last)

### Step 6 — Copy chart components (depend on `lib/super-admin-mock.ts` + `components/ui/chart.tsx`)

- `components/super-admin/charts/RevenueAreaChart.tsx`
- `components/super-admin/charts/PlanDonutChart.tsx`
- `components/super-admin/charts/BillingBarChart.tsx`
- `components/super-admin/charts/MemberGrowthChart.tsx`

### Step 7 — Copy super-admin shell components (depend on hooks, ui, common)

- `components/super-admin/nav-items.ts`
- `components/super-admin/SuperAdminSidebar.tsx`
- `components/super-admin/SuperAdminNavbar.tsx`
- `components/super-admin/SuperAdminDashboardLayout.tsx`

### Step 8 — Copy pages / app routes (depend on everything above)

- `app/(dashboard)/super-admin/layout.tsx`
- `app/(dashboard)/super-admin/page.tsx`
- `app/(dashboard)/super-admin/gyms/page.tsx`
- `app/(dashboard)/super-admin/billing/page.tsx`
- `app/(dashboard)/super-admin/analytics/page.tsx`

### Step 9 — Middleware

- **None created.** No `middleware.ts` / `proxy.ts` was generated. Auth gating is done inside `app/(dashboard)/super-admin/layout.tsx`. If your real project already has middleware for `/super-admin`, keep it.

### Step 10 — Copy / update configuration files

- `app/globals.css` — theme tokens (see Section 4).
- `app/layout.tsx` — fonts + metadata (see Section 4).
- `app/page.tsx` — root redirect (optional, see Section 4).

### Step 11 — Update existing files

See Section 4 for the exact edits.

---

## 3. Complete File Checklist

Every file created or modified in the previous response:

**Created — config / data**

- [ ] `config/index.ts`
- [ ] `lib/super-admin-mock.ts`

**Created — hooks**

- [ ] `hooks/use-mobile.ts`
- [ ] `hooks/use-toast.ts`
- [ ] `hooks/use-auth.ts`
- [ ] `hooks/index.ts`

**Created — common components**

- [ ] `components/common/LoadingSpinner.tsx`
- [ ] `components/common/StatusBadge.tsx`
- [ ] `components/common/EmptyState.tsx`
- [ ] `components/common/PageHeader.tsx`
- [ ] `components/common/StatCard.tsx`
- [ ] `components/common/index.ts`

**Created — super-admin shell**

- [ ] `components/super-admin/nav-items.ts`
- [ ] `components/super-admin/SuperAdminSidebar.tsx`
- [ ] `components/super-admin/SuperAdminNavbar.tsx`
- [ ] `components/super-admin/SuperAdminDashboardLayout.tsx`

**Created — chart wrappers**

- [ ] `components/super-admin/charts/RevenueAreaChart.tsx`
- [ ] `components/super-admin/charts/PlanDonutChart.tsx`
- [ ] `components/super-admin/charts/BillingBarChart.tsx`
- [ ] `components/super-admin/charts/MemberGrowthChart.tsx`

**Created — pages / routes**

- [ ] `app/(dashboard)/super-admin/layout.tsx`
- [ ] `app/(dashboard)/super-admin/page.tsx`
- [ ] `app/(dashboard)/super-admin/gyms/page.tsx`
- [ ] `app/(dashboard)/super-admin/billing/page.tsx`
- [ ] `app/(dashboard)/super-admin/analytics/page.tsx`

**Added via shadcn CLI (generated into `components/ui/`)**

- [ ] `components/ui/card.tsx`
- [ ] `components/ui/badge.tsx`
- [ ] `components/ui/table.tsx`
- [ ] `components/ui/avatar.tsx`
- [ ] `components/ui/dropdown-menu.tsx`
- [ ] `components/ui/input.tsx`
- [ ] `components/ui/skeleton.tsx`
- [ ] `components/ui/separator.tsx`
- [ ] `components/ui/tabs.tsx`
- [ ] `components/ui/chart.tsx`

**Modified — existing files**

- [ ] `app/globals.css`
- [ ] `app/layout.tsx`
- [ ] `app/page.tsx`

---

## 4. Existing Files That Must Be Modified

### `app/globals.css`

- **Action:** Update theme tokens (neon/orange dark palette) and add font variable mappings.
- **Replace entire file:** No — replace the `:root` and `.dark` token blocks, and add `--font-sans` / `--font-mono` inside `@theme inline`.
- **Which code block:** The `:root { … }` + `.dark { … }` `oklch` token blocks and the two `--font-*` lines from the previous response.
- **Notes:** If your real GymFlow `globals.css` already defines these tokens, **do not overwrite it** — you already have the canonical values. Only take the `--font-*` mapping if missing.

### `app/layout.tsx`

- **Action:** Add Geist fonts (`--font-geist-sans`, `--font-geist-mono`), set `<html className="dark …">`, set `bg-background font-sans` on `<body>`, update metadata/viewport.
- **Replace entire file:** No — merge. Keep any existing providers (Zustand, TanStack Query, Sonner `<Toaster />`, ThemeProvider) that your real repo already wraps here.
- **Which code block:** The `RootLayout` + font setup block from the previous response.
- **Insert after:** Keep existing providers inside `<body>`; wrap `{children}` as they already are.

### `app/page.tsx`

- **Action:** Root redirect to `/super-admin`.
- **Replace entire file:** Optional. Only if you want `/` to send users to the super-admin dashboard. In the real app your root likely redirects based on role — **prefer your existing logic**.
- **Which code block:** `redirect('/super-admin')` block.

### `hooks/index.ts` and `components/common/index.ts` (barrels)

- **Action:** If these barrels already exist in your repo, **append** the new exports instead of replacing, so you don't drop existing exports.
- **Replace entire file:** No — merge exports.

---

## 5. Folder Structure

```
app/
├── globals.css                      (modified)
├── layout.tsx                       (modified)
├── page.tsx                         (modified — optional redirect)
└── (dashboard)/
    └── super-admin/
        ├── layout.tsx
        ├── page.tsx                 (Dashboard)
        ├── gyms/
        │   └── page.tsx
        ├── billing/
        │   └── page.tsx
        └── analytics/
            └── page.tsx

components/
├── common/
│   ├── LoadingSpinner.tsx
│   ├── StatusBadge.tsx
│   ├── EmptyState.tsx
│   ├── PageHeader.tsx
│   ├── StatCard.tsx
│   └── index.ts
├── super-admin/
│   ├── nav-items.ts
│   ├── SuperAdminSidebar.tsx
│   ├── SuperAdminNavbar.tsx
│   ├── SuperAdminDashboardLayout.tsx
│   └── charts/
│       ├── RevenueAreaChart.tsx
│       ├── PlanDonutChart.tsx
│       ├── BillingBarChart.tsx
│       └── MemberGrowthChart.tsx
└── ui/                              (shadcn — added)
    ├── button.tsx                   (pre-existing)
    ├── card.tsx
    ├── badge.tsx
    ├── table.tsx
    ├── avatar.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── skeleton.tsx
    ├── separator.tsx
    ├── tabs.tsx
    └── chart.tsx

config/
└── index.ts

hooks/
├── use-mobile.ts
├── use-toast.ts
├── use-auth.ts
└── index.ts

lib/
├── utils.ts                         (pre-existing — cn)
└── super-admin-mock.ts
```

---

## 6. Dependency Order

Files that must exist **before** their dependents:

- `lib/utils.ts` (`cn`) → before all `components/common/*` and shell components.
- `lib/super-admin-mock.ts` → before all `components/super-admin/charts/*` and all super-admin pages.
- `components/ui/chart.tsx` → before all chart wrappers.
- `components/ui/*` (card, badge, table, avatar, input, tabs, dropdown-menu, separator, skeleton) → before common components and pages that use them.
- `hooks/use-auth.ts`, `hooks/use-toast.ts`, `hooks/use-mobile.ts` → before `hooks/index.ts`.
- `hooks/index.ts` → before `SuperAdminSidebar`, `SuperAdminNavbar`, and `app/(dashboard)/super-admin/layout.tsx`.
- `components/common/*` → before `components/common/index.ts`.
- `components/common/index.ts` → before all super-admin pages and the route-group layout.
- `config/index.ts` (`ROUTES`) → before `app/(dashboard)/super-admin/layout.tsx`.
- `components/super-admin/nav-items.ts` → before `SuperAdminSidebar`.
- `SuperAdminSidebar` + `SuperAdminNavbar` → before `SuperAdminDashboardLayout`.
- `SuperAdminDashboardLayout` → before `app/(dashboard)/super-admin/layout.tsx`.
- All chart wrappers + common components → before the four super-admin pages.

**Rule of thumb:** utilities/config/data → ui → hooks → common → charts → shell → layout → pages.

---

## 7. Installation Requirements

### npm / pnpm packages

No new runtime dependencies beyond what shadcn pulls in. Confirm these are present (all standard in the scaffold):

- `next`, `react`, `react-dom`
- `lucide-react` (icons)
- `recharts` (installed automatically by the shadcn `chart` component)
- `clsx` + `tailwind-merge` (for `cn` in `lib/utils.ts`)
- `@vercel/analytics` (used in `app/layout.tsx`; remove that import if you don't use it)

Install command (pnpm):

```bash
pnpm add recharts lucide-react
```

(recharts is normally added for you by the shadcn chart component.)

### shadcn components

```bash
pnpm dlx shadcn@latest add card badge table avatar dropdown-menu input skeleton separator tabs chart
```

### Tailwind changes

- Tailwind v4 (no `tailwind.config.js`). Theme tokens live in `app/globals.css`.
- Ensure the neon/orange `oklch` tokens for `:root` and `.dark` are present.
- Ensure `--font-sans` / `--font-mono` are mapped inside `@theme inline`.

### Environment variables

- **None required** for the preview (all data is mocked). In the real app, wire the pages to your existing `services/` + env vars (API base URL, auth) — no new vars are introduced by these files.

### Prisma / database migrations

- **None.** No schema or migration files were created. The preview uses `lib/super-admin-mock.ts`.

---

## 8. Manual Steps

After copying:

1. **Install shadcn components** (Section 7) so `components/ui/*` exist.
2. **Reconcile hooks:** if your repo already has real `useAuth` / `useToast`, delete the stub versions and update `hooks/index.ts` to re-export your real hooks (keep the same named exports: `useAuth`, `useToast`, `useIsMobile`).
3. **Reconcile data:** replace `lib/super-admin-mock.ts` imports with your real `services/` + TanStack Query calls. The pages import named fixtures (`gyms`, `platformStats`, `revenueTrend`, `planDistribution`, `billingSummary`, `invoices`, `memberGrowth`) — swap these for query data with the same shapes.
4. **Merge `globals.css` / `layout.tsx`** rather than overwriting, preserving existing providers and any canonical theme tokens.
5. **Verify the route group:** ensure `app/(dashboard)/super-admin/*` does not collide with an existing `app/super-admin/*` route. Pick one location.
6. **Confirm auth gating:** the route-group `layout.tsx` redirects non–`SUPER_ADMIN` users using `ROUTES` from `@/config`. Align this with your real auth/session and middleware.
7. **Update navigation** if you already have a super-admin nav — reconcile `components/super-admin/nav-items.ts` with your route table.
8. **Restart the dev server** after adding fonts / Tailwind tokens.

---

## 9. Verification Checklist

- [ ] All folders created (Section 5).
- [ ] All files copied (Section 3).
- [ ] shadcn components installed (`card, badge, table, avatar, dropdown-menu, input, skeleton, separator, tabs, chart`).
- [ ] `recharts` present in `package.json`.
- [ ] Theme tokens + font mappings merged into `globals.css`.
- [ ] `app/layout.tsx` keeps existing providers and adds Geist fonts + `dark` class.
- [ ] No route collision between `(dashboard)/super-admin` and any existing `super-admin` route.
- [ ] Build passes (`pnpm build`) with no unresolved imports.
- [ ] `/super-admin` dashboard loads (KPIs, revenue chart, donut, recent gyms).
- [ ] `/super-admin/gyms` search + status tabs filter the table; empty state shows on no matches.
- [ ] `/super-admin/billing` shows summary cards, bar chart, invoices table.
- [ ] `/super-admin/analytics` shows growth chart, revenue trend, plan mix, top gyms.
- [ ] Sidebar navigation highlights the active route; mobile collapse works.
- [ ] Navbar user menu + logout works (wired to real `useAuth` in production).
- [ ] Auth guard redirects non–super-admin users.

---

## 10. Files Referenced But Not Yet Created

The following are **imported/expected somewhere but were not generated** in the previous response. They are either pre-existing scaffold files or production equivalents you must supply in the real repo:

**Expected to already exist (shadcn scaffold / project baseline) — no action if present:**

- `lib/utils.ts` — provides `cn`; imported by every common + shell component. (Pre-existing in the scaffold.)
- `components/ui/button.tsx` — imported by sidebar, navbar, and pages. (Pre-existing in the scaffold.)

**Created by the shadcn CLI, not hand-written (must run the CLI or copy them):**

- `components/ui/card.tsx`, `components/ui/badge.tsx`, `components/ui/table.tsx`, `components/ui/avatar.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/input.tsx`, `components/ui/skeleton.tsx`, `components/ui/separator.tsx`, `components/ui/tabs.tsx`, `components/ui/chart.tsx`.

**Production equivalents to supply in the real GymFlow repo (stubs provided here are previews only):**

- Real `useAuth` (Zustand + TanStack Query) — replace `hooks/use-auth.ts`.
- Real `useToast` (Sonner) — replace `hooks/use-toast.ts`.
- Real data layer (`services/*` + TanStack Query) — replace `lib/super-admin-mock.ts`.

**Referenced route paths that have no page yet** (linked from `nav-items.ts` but intentionally not built in this pass — create them or remove the nav entries):

- `/super-admin/plans`
- `/super-admin/owners`
- `/super-admin/settings`

**Not created and not required (documented for completeness):**

- `middleware.ts` / `proxy.ts` — none generated; auth gating lives in the route-group layout.
- Any Prisma schema / migration files — none generated.
