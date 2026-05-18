// ===========================================
// Pagination Constants
// ===========================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 50,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 50] as const,
} as const;

// Helper to get valid page number
export function getValidPage(page: unknown): number {
  const parsed = Number(page);
  return isNaN(parsed) || parsed < 1
    ? PAGINATION.DEFAULT_PAGE
    : Math.floor(parsed);
}

// Helper to get valid limit
export function getValidLimit(limit: unknown): number {
  const parsed = Number(limit);
  if (isNaN(parsed) || parsed < PAGINATION.MIN_LIMIT) {
    return PAGINATION.DEFAULT_LIMIT;
  }
  return Math.min(Math.floor(parsed), PAGINATION.MAX_LIMIT);
}

// Calculate total pages
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

// Get page range for display (e.g., "1-10 of 100")
export function getPageRange(
  page: number,
  limit: number,
  total: number,
): { start: number; end: number } {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return { start: Math.max(start, 1), end };
}
