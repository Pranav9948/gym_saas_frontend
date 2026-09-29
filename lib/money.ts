const USD_TO_INR = 83;

export function amountToInr(amount: number, currency?: string | null): number {
  const code = (currency ?? 'INR').toUpperCase();
  if (code === 'USD') {
    return Math.round(amount * USD_TO_INR);
  }
  return amount;
}

export function formatInr(amount: number, sourceCurrency?: string | null): string {
  const inr = amountToInr(amount, sourceCurrency);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
}

export function formatInrCompact(amount: number, sourceCurrency?: string | null): string {
  const inr = amountToInr(amount, sourceCurrency);
  return `₹${new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(inr)}`;
}
