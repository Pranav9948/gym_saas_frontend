/**
 * Client-side payment flow tracing.
 * Open DevTools → Console and filter: BILLING_TRACE
 */

let stepCounter = 0;

function isEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return process.env.NEXT_PUBLIC_BILLING_TRACE !== 'false';
}

export function resetBillingTrace(flow: string = 'payment'): void {
  if (!isEnabled()) return;
  stepCounter = 0;
  console.info(
    `%c[BILLING_TRACE] ═══ ${flow.toUpperCase()} FLOW START ═══`,
    'color:#2563eb;font-weight:bold',
  );
}

export function billingTrace(
  step: string,
  payload?: {
    api?: string;
    method?: 'GET' | 'POST';
    in?: unknown;
    out?: unknown;
    error?: unknown;
    note?: string;
  },
): void {
  if (!isEnabled()) return;

  stepCounter += 1;
  const prefix = `[BILLING_TRACE ${String(stepCounter).padStart(2, '0')}]`;

  if (payload?.error) {
    console.groupCollapsed(`${prefix} ✗ ${step}`);
    if (payload.api) console.log('API:', payload.method ?? '—', payload.api);
    if (payload.in !== undefined) console.log('→ Request:', payload.in);
    console.error('✗ Error:', payload.error);
    if (payload.note) console.log('Note:', payload.note);
    console.groupEnd();
    return;
  }

  console.groupCollapsed(`${prefix} ${step}`);
  if (payload?.api) console.log('API:', payload.method ?? '—', payload.api);
  if (payload?.in !== undefined) console.log('→ Request:', payload.in);
  if (payload?.out !== undefined) console.log('← Response:', payload.out);
  if (payload?.note) console.log('Note:', payload.note);
  console.groupEnd();
}

export function billingTraceRedirect(url: string, label: string): void {
  if (!isEnabled()) return;
  stepCounter += 1;
  console.info(
    `[BILLING_TRACE ${String(stepCounter).padStart(2, '0')}] Redirect → ${label}`,
    { url: url.slice(0, 80) + '...' },
  );
}
