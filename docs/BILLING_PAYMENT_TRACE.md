# Billing payment flow — API order & trace guide

Use this when testing Owner upgrade via Stripe. Filter logs with **`BILLING_TRACE`**.

Full doc path: `saas-frontend/docs/BILLING_PAYMENT_TRACE.md`

---

## How to watch logs

| Where | How |
|---|---|
| **Browser** | DevTools → Console → filter `BILLING_TRACE` |
| **Backend API** | Terminal running `apps/api` → filter `BILLING_TRACE` |
| **Stripe CLI** | `stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe` |

Disable frontend traces: `NEXT_PUBLIC_BILLING_TRACE=false`  
Disable backend traces: `BILLING_TRACE=false`

---

## SUCCESS flow (ordered)

### 1. Billing page load (frontend only — parallel GETs)

| # | Frontend step | Backend step |
|---|---------------|--------------|
| 01 | `Owner billing page mounted` | — |
| 02 | `GET /billing/summary` | — |
| 03 | `GET /billing/plans` | — |
| 04 | `GET /billing/usage` | — |
| 05 | `GET /billing/payment-history` | — |

Each GET logs `→ Request` / `← Response` in the browser console.

### 2. Upgrade click

| # | Frontend | Backend `[BILLING_TRACE]` step |
|---|----------|-------------------------------|
| 06 | `CHECKOUT FLOW START` | — |
| 07 | `User clicked Upgrade` | — |
| 08 | `POST /billing/checkout-session (start)` | `checkout.request` |
| 09 | — | `checkout.context_loaded` |
| 10 | — | `checkout.stripe_session_created` |
| 11 | `POST /billing/checkout-session (success)` | `checkout.response` |
| 12 | `Redirect → Stripe Checkout` | — |

**Browser leaves your app** — Stripe handles card entry.

### 3. After payment (async webhooks + redirect)

Stripe sends webhooks **while** redirecting the user to `/owner/billing/success?session_id=cs_...`

| # | Backend step | What it does |
|---|--------------|--------------|
| W1 | `webhook.received` | Signature verified |
| W2 | `webhook.enqueued` | Job queued (BullMQ) |
| W3 | `webhook.job.start` | Worker picks up event |
| W4 | `webhook.handler.checkout.session.completed` | First DB sync from checkout |
| W5 | `webhook.db.synced` | Plan + subscription written |
| W6 | `webhook.handler.customer.subscription.created` | Subscription upsert |
| W7 | `webhook.handler.invoice.payment_succeeded` | Status → ACTIVE |
| W8 | `webhook.job.complete` | Job done |

Typical event order (may overlap):

1. `checkout.session.completed`
2. `customer.subscription.created`
3. `invoice.payment_succeeded`

### 4. Success page (frontend polls until DB catches up)

| # | Frontend step |
|---|---------------|
| 13 | `SUCCESS FLOW START` |
| 14 | `Stripe redirected to success page` |
| 15–19 | `Success page poll #1–5` → refetches summary, plans, usage, subscription, payment-history, tenant |
| 20 | `Success page polling complete` |

Each poll fires 6 parallel GETs (same as page load).

---

## FAILURE flows

### A — User cancels on Stripe

| What | Trace |
|------|-------|
| Redirect to `/owner/billing/cancel` | `CANCEL FLOW START` → `Stripe redirected to cancel page` |
| API calls | **None** |
| DB change | **None** |

### B — Already on paid plan (409)

| Frontend | Backend |
|----------|---------|
| `POST /billing/checkout-session (failed)` | `checkout.blocked_active_paid` or `checkout.blocked_same_plan` |
| `Checkout mutation error` (409) | `checkout.failed` |

### C — Invalid plan (400)

| Backend step |
|--------------|
| `checkout.invalid_plan` or `checkout.plan_not_checkout_eligible` |
| `checkout.failed` |

### D — Card declined on Stripe

| Where | What |
|-------|------|
| Stripe UI | Shows decline — user stays on Stripe |
| Backend (if subscription created) | `invoice.payment_failed` → `webhook.db.synced` with `status: PAST_DUE` |
| Frontend | No success redirect — user may hit cancel URL manually |

Test card: `4000 0000 0000 0002`

### E — Webhook slower than success page

| Symptom | Trace hint |
|---------|------------|
| Success page shows old plan briefly | Poll #1–3 still show old plan in GET responses |
| Plan updates mid-poll | Later polls show new plan in `GET /billing/summary` response |

---

## Test cards (Stripe test mode)

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| Click **Back** on Stripe | Cancel flow |

---

## Quick checklist before testing

1. Backend running with Redis (for webhook queue)
2. `stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe`
3. Owner logged in on `/owner/billing`
4. Console filter: `BILLING_TRACE`
5. API terminal filter: `BILLING_TRACE`
