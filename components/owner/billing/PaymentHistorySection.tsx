'use client';

import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/common';
import { billingService } from '@/services/billing.service';
import { usePaymentHistory } from '@/hooks/billing';
import { formatBillingDate, formatCurrency } from '@/lib/billing/format';
import type { BillingPaymentHistoryItem } from '@/types/billing';
import { BillingSectionError } from './BillingSectionError';

export function PaymentHistorySection() {
  const { data, isLoading, isError, refetch, isFetching } = usePaymentHistory({
    limit: 10,
  });
  const [payments, setPayments] = React.useState<BillingPaymentHistoryItem[]>([]);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [loadMoreError, setLoadMoreError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.data) {
      setPayments(data.data.payments);
      setCursor(data.data.pagination.nextStartingAfter);
      setHasMore(data.data.pagination.hasMore);
    }
  }, [data]);

  async function handleLoadMore() {
    if (!cursor) return;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await billingService.getPaymentHistory({
        limit: 10,
        starting_after: cursor,
      });

      setPayments((current) => [...current, ...response.data.payments]);
      setCursor(response.data.pagination.nextStartingAfter);
      setHasMore(response.data.pagination.hasMore);
    } catch {
      setLoadMoreError('Unable to load more invoices.');
    } finally {
      setLoadingMore(false);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingSectionError
            message="Unable to load payment history."
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Paid invoices will appear here after your first subscription payment."
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={`${payment.invoiceNumber ?? 'invoice'}-${index}`}>
                      <TableCell className="font-medium">
                        {payment.invoiceNumber ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>{formatBillingDate(payment.paidAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.hostedInvoiceUrl ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={payment.hostedInvoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="size-4" />
                                View
                              </a>
                            </Button>
                          ) : null}
                          {payment.invoicePdf ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={payment.invoicePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="size-4" />
                                PDF
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {hasMore ? (
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore || isFetching}
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Button>
                {loadMoreError ? (
                  <p className="text-sm text-destructive">{loadMoreError}</p>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
