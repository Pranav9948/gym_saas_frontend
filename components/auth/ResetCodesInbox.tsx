'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Copy, KeyRound, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import type { PasswordResetCode } from '@/types'

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

function formatExpiry(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ResetCodesInbox({
  title,
  description,
  queryKey,
  queryFn,
}: {
  title: string
  description: string
  queryKey: readonly unknown[]
  queryFn: () => Promise<{ data: PasswordResetCode[] }>
}) {
  const { toast } = useToast()
  const query = useQuery({
    queryKey,
    queryFn,
    refetchInterval: 10_000,
  })

  const codes = query.data?.data ?? []

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({ title: 'Copied', description: 'Give this code to the person who requested the reset.' })
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Copy the code manually.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      {query.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading reset codes…" />
        </div>
      ) : query.error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load reset codes</p>
          <p className="text-destructive/80">
            {query.error instanceof ApiException
              ? query.error.getUserMessage()
              : query.error instanceof Error
                ? query.error.message
                : 'Please try again.'}
          </p>
        </div>
      ) : codes.length === 0 ? (
        <EmptyState
          icon={<KeyRound className="h-8 w-8" />}
          title="No pending codes"
          description="When someone on your team forgets their password, the 6-digit code appears here for 15 minutes."
        />
      ) : (
        <div className="grid gap-4">
          {codes.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{item.requesterName}</p>
                  <p className="text-sm text-muted-foreground">{item.requesterEmail}</p>
                  <p className="text-xs text-muted-foreground">
                    {titleCase(item.requesterRole)} · {item.gymName} · Expires{' '}
                    {formatExpiry(item.expiresAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-3xl font-bold tracking-[0.35em] text-foreground">
                    {item.code}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => void copyCode(item.code)}
                    aria-label="Copy code"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
