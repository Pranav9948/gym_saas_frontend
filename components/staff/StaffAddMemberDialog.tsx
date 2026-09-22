'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, LoadingSpinner } from '@/components/common'
import {
  PackagePriceSummary,
  formatMoney,
  monthlyPackagePrice,
} from '@/components/staff/staff-ui'
import {
  addMemberPersonSchema,
  type AddMemberPersonFormData,
} from '@/schemas/owner-person.schema'
import { membersService, packagesService, trainersService, queryKeys } from '@/services'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'

interface StaffAddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StaffAddMemberDialog({
  open,
  onOpenChange,
  onSuccess,
}: StaffAddMemberDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AddMemberPersonFormData>({
    resolver: zodResolver(addMemberPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      assignedTrainerId: '',
      packageId: '',
      paymentStatus: 'PENDING',
    },
  })

  const packagesQuery = useQuery({
    queryKey: queryKeys.packages.list(false),
    queryFn: () => packagesService.list(false),
    enabled: open,
  })

  const trainersQuery = useQuery({
    queryKey: queryKeys.trainers.list({ limit: 100 }),
    queryFn: () => trainersService.getTrainers({ page: 1, limit: 100 }),
    enabled: open,
  })

  const selectedPackageId = form.watch('packageId')
  const assignedTrainerId = form.watch('assignedTrainerId')
  const paymentStatus = form.watch('paymentStatus')
  const packages = packagesQuery.data?.data ?? []
  const trainers = trainersQuery.data?.trainers ?? []
  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId)
  const needsTrainer = Boolean(
    selectedPackage?.features?.includes('personal_training'),
  )

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (data) => {
    if (needsTrainer && !data.assignedTrainerId) {
      form.setError('assignedTrainerId', {
        message: 'Assign a trainer for personal training packages.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await membersService.createMember({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        assignedTrainerId: data.assignedTrainerId || undefined,
        packageId: data.packageId,
        paymentStatus: data.paymentStatus,
      })
      toast({
        title: 'Member created',
        description: `${data.firstName} ${data.lastName} was added.`,
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Could not create member',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,740px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Choose a package. If it includes personal training, assign a trainer.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                name="firstName"
                control={form.control}
                label="First name"
                error={form.formState.errors.firstName?.message}
                disabled={isSubmitting}
              />
              <FormField
                name="lastName"
                control={form.control}
                label="Last name"
                error={form.formState.errors.lastName?.message}
                disabled={isSubmitting}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              label="Email"
              type="email"
              error={form.formState.errors.email?.message}
              disabled={isSubmitting}
            />
            <FormField
              name="phone"
              control={form.control}
              label="Phone (optional)"
              placeholder="+14155550142"
              error={form.formState.errors.phone?.message}
              disabled={isSubmitting}
            />

            <div className="space-y-2">
              <Label htmlFor="staff-member-package">Package</Label>
              {packagesQuery.isLoading ? (
                <LoadingSpinner size="sm" label="Loading packages…" />
              ) : packages.length === 0 ? (
                <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                  No packages are available yet. Ask the gym owner to create one
                  before adding members.
                </p>
              ) : (
                <Select
                  value={selectedPackageId || undefined}
                  onValueChange={(value) =>
                    form.setValue('packageId', value, { shouldValidate: true })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="staff-member-package" className="w-full">
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} · {formatMoney(
                          monthlyPackagePrice(pkg.price, pkg.durationDays),
                          pkg.currency,
                        )}
                        /mo
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedPackage ? (
                <PackagePriceSummary
                  name={selectedPackage.name}
                  price={selectedPackage.price}
                  durationDays={selectedPackage.durationDays}
                  currency={selectedPackage.currency}
                />
              ) : null}
              {form.formState.errors.packageId?.message ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.packageId.message}
                </p>
              ) : null}
            </div>

            {needsTrainer ? (
              <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <Label htmlFor="staff-member-trainer">Trainer *</Label>
                <p className="text-xs text-muted-foreground">
                  This package includes personal training, so a trainer is required.
                </p>
                {trainersQuery.isLoading ? (
                  <LoadingSpinner size="sm" label="Loading trainers…" />
                ) : trainers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No trainers yet. Create a trainer first, then assign them here.
                  </p>
                ) : (
                  <Select
                    value={assignedTrainerId || undefined}
                    onValueChange={(value) =>
                      form.setValue('assignedTrainerId', value, {
                        shouldValidate: true,
                      })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="staff-member-trainer" className="w-full">
                      <SelectValue placeholder="Assign a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.user.firstName} {trainer.user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {form.formState.errors.assignedTrainerId?.message ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.assignedTrainerId.message}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="staff-member-trainer-optional">
                  Trainer (optional)
                </Label>
                <Select
                  value={assignedTrainerId || 'none'}
                  onValueChange={(value) =>
                    form.setValue(
                      'assignedTrainerId',
                      value === 'none' ? '' : value,
                      {
                        shouldValidate: true,
                      },
                    )
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="staff-member-trainer-optional" className="w-full">
                    <SelectValue placeholder="No trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No trainer</SelectItem>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.user.firstName} {trainer.user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="staff-member-payment">Payment status</Label>
              <Select
                value={paymentStatus}
                onValueChange={(value) =>
                  form.setValue('paymentStatus', value as 'PAID' | 'PENDING', {
                    shouldValidate: true,
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="staff-member-payment" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 w-full shrink-0 [&>button]:w-full sm:[&>button]:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                packages.length === 0 ||
                (needsTrainer && trainers.length === 0)
              }
            >
              {isSubmitting ? 'Saving…' : 'Create member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
