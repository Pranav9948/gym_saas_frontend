# Owner Roles & Permissions (RBAC)

This document explains the Roles & Permissions feature in the owner settings portal, what was implemented, and how system roles map to permissions.

---

## What was wrong

The **Settings → Roles** tab linked to a separate URL (`/owner/settings/roles`) but had **no tab content** on the settings page itself. Clicking "Roles" navigated away without rendering the roles UI inside settings, so the section appeared missing or broken.

---

## What was done (step by step)

### 1. Embedded roles UI in Settings

- Updated `app/(dashboard)/owner/settings/page.tsx` to render the full **`RoleManagement`** component inside the **Roles** tab.
- Tabs now sync with the URL: `/owner/settings?tab=roles` opens the Roles tab directly.
- Removed the broken `Link`-only tab trigger that skipped tab content.

### 2. Built full role management UI

**File:** `components/owner/roles/RoleManagement.tsx`

| Feature | Description |
|--------|-------------|
| **List roles** | Table showing all tenant roles (system + custom) |
| **Empty state** | When no roles exist, shows a clear message + **Create your first role** button |
| **Create role** | Always available via header button (empty or populated list) |
| **Edit role** | Opens dialog to change name (custom only) and permissions |
| **Delete role** | Confirm dialog; disabled for system roles or roles with assigned members |
| **View permissions** | Side sheet with full permission breakdown by module |
| **Search** | Filter roles by name or permission |
| **Stats** | Summary cards for total roles, modules, and assigned members |

### 3. Create / Edit role dialog with permissions

**File:** `components/owner/roles/RoleFormDialog.tsx`

- Role name input (system role names are locked)
- Permissions grouped by module (member, trainer, attendance, tenant, user, goal, role)
- **Select all / Clear all** for quick assignment
- **Search/filter** permissions while creating or editing
- Validation: name ≥ 2 chars, at least one permission required

### 4. API integration

**File:** `services/rbac.service.ts`

| Action | Endpoint |
|--------|----------|
| List permissions | `GET /api/v1/permissions` |
| List roles | `GET /api/v1/tenants/:tenantId/roles` |
| Create role | `POST /api/v1/tenants/:tenantId/roles` |
| Update role | `PUT /api/v1/tenants/:tenantId/roles/:roleId` |
| Delete role | `DELETE /api/v1/tenants/:tenantId/roles/:roleId` |

### 5. Redirect for old URL

**File:** `app/(dashboard)/owner/settings/roles/page.tsx`

- `/owner/settings/roles` now redirects to `/owner/settings?tab=roles` so bookmarks still work.

### 6. Backend RBAC (prerequisite)

The API seeds four system roles per gym on startup: **OWNER**, **ADMIN**, **STAFF**, **TRAINER**. Owners can also create **custom roles** with any combination of permissions.

---

## How to use (owner)

1. Log in as **Owner**.
2. Go to **Settings → Roles** (or `/owner/settings?tab=roles`).
3. Review system roles (OWNER, ADMIN, STAFF, TRAINER).
4. Click **Create role** to add a custom role (e.g. "Front Desk", "Gym Manager").
5. Select permissions by module, then save.
6. Use **Edit** to change permissions; **Delete** only works for custom roles with no assigned users.
7. Assign roles when inviting or creating staff from the **Team** tab.

> **Note:** If roles fail to load, log out and log back in so your JWT includes a valid `roleId`.

---

## System roles & permissions matrix

Legend: ✅ = allowed · ❌ = not allowed · 🔒 = protected (cannot delete)

### Members

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| Create members | ✅ | ✅ | ✅ | ❌ |
| View members | ✅ | ✅ | ✅ | ✅ |
| Update members | ✅ | ✅ | ✅ | ❌ |
| Delete members | ✅ | ✅ | ❌ | ❌ |

### Trainers

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| Create trainers | ✅ | ✅ | ❌ | ❌ |
| View trainers | ✅ | ✅ | ❌ | ❌ |
| Update trainers | ✅ | ✅ | ❌ | ❌ |
| Delete trainers | ✅ | ✅ | ❌ | ❌ |

### Attendance

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| Mark attendance | ✅ | ✅ | ✅ | ❌ |
| View attendance | ✅ | ✅ | ✅ | ✅ |

### Gym & team (tenant / users)

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| View gym profile | ✅ | ✅ | ❌ | ❌ |
| Update gym profile / logo | ✅ | ✅ | ❌ | ❌ |
| Invite team members | ✅ | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ | ❌ |
| Remove team members | ✅ | ✅ | ❌ | ❌ |

### Goals

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| Create goals | ✅ | ✅ | ❌ | ❌ |
| View goals | ✅ | ✅ | ❌ | ❌ |

### Role management (Settings → Roles)

| Capability | Owner | Admin | Staff | Trainer |
|------------|:-----:|:-----:|:-----:|:-------:|
| View roles & permissions | ✅ | ❌ | ❌ | ❌ |
| Create custom roles | ✅ | ❌ | ❌ | ❌ |
| Edit role permissions | ✅ | ❌ | ❌ | ❌ |
| Delete custom roles | ✅ | ❌ | ❌ | ❌ |

---

## Typical owner workflows

| Goal | Who can do it | How |
|------|---------------|-----|
| Create staff accounts | Owner, Admin | Team tab → invite or direct create with STAFF role |
| Create admin accounts | Owner only | Team tab → invite with ADMIN role |
| Let staff check in members | Owner | Ensure STAFF role has `attendance:mark` (default) |
| Custom "Front Desk" role | Owner | Settings → Roles → Create role → pick member + attendance permissions |
| Full gym control | Owner 🔒 | OWNER role has all permissions; cannot be deleted |

---

## File reference

```
saas-frontend/
├── app/(dashboard)/owner/settings/
│   ├── page.tsx                    # Settings with Roles tab (embedded UI)
│   └── roles/page.tsx              # Redirect → ?tab=roles
├── components/owner/roles/
│   ├── RoleManagement.tsx          # List, create, edit, delete, view
│   └── RoleFormDialog.tsx          # Permission picker dialog
├── services/rbac.service.ts        # API client
├── types/rbac.ts                   # TypeScript types
└── docs/OWNER_ROLES_RBAC.md        # This file
```

---

## Custom roles

Custom roles are **fully manageable** by the owner:

- Any name (min 2 characters)
- Any subset of the 21 available permissions
- Can be edited and deleted when no users are assigned
- Useful for specialized positions (e.g. "Billing Manager" with only `tenant:view`, "Reception" with member + attendance access)

System roles (**OWNER**, **ADMIN**, **STAFF**, **TRAINER**) are seeded automatically and cannot be deleted. **OWNER** is protected and cannot be edited or removed.
