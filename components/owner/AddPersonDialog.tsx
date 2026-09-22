'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Dumbbell, Shield, User, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FormField, LoadingSpinner } from '@/components/common'
import {
  addAdminPersonSchema,
  addMemberPersonSchema,
  addStaffPersonSchema,
  addTrainerPersonSchema,
  type PersonType,
  type AddAdminPersonFormData,
  type AddMemberPersonFormData,
  type AddStaffPersonFormData,
  type AddTrainerPersonFormData,
} from '@/schemas/owner-person.schema'
import {
  membersService,
  packagesService,
  queryKeys,
  tenantService,
  trainersService,
} from '@/services'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface AddPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (type: PersonType) => void
  defaultType?: PersonType
}

export function AddPersonDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultType = 'member',
}: AddPersonDialogProps) {
  const { toast } = useToast()
  const [personType, setPersonType] = React.useState<PersonType>(defaultType)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const trainersQuery = useQuery({
    queryKey: queryKeys.trainers.list({ limit: 100 }),
    queryFn: () => trainersService.getTrainers({ page: 1, limit: 100 }),
    enabled: open && personType === 'member',
  })

  const packagesQuery = useQuery({
    queryKey: queryKeys.packages.list(false),
    queryFn: () => packagesService.list(false),
    enabled: open && personType === 'member',
  })

  const memberForm = useForm<AddMemberPersonFormData>({
    resolver: zodResolver(addMemberPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      assignedTrainerId: '',
      packageId: '',
      paymentStatus: 'PAID',
    },
  })

  const staffForm = useForm<AddStaffPersonFormData>({
    resolver: zodResolver(addStaffPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const adminForm = useForm<AddAdminPersonFormData>({
    resolver: zodResolver(addAdminPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const trainerForm = useForm<AddTrainerPersonFormData>({
    resolver: zodResolver(addTrainerPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      specialization: '',
      bio: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      setPersonType(defaultType)
    }
  }, [open, defaultType])

  const resetAll = () => {
    memberForm.reset()
    staffForm.reset()
    adminForm.reset()
    trainerForm.reset()
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetAll()
    }
    onOpenChange(nextOpen)
  }

  const handleMemberSubmit = memberForm.handleSubmit(async (data) => {
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
        title: 'Member added',
        description: `${data.firstName} ${data.lastName} was added successfully.`,
      })
      handleClose(false)
      onSuccess?.('member')
    } catch (error) {
      toast({
        title: 'Could not add member',
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

  const handleStaffSubmit = staffForm.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'STAFF',
        password: data.password,
      })
      toast({
        title: 'Staff created',
        description: `${data.firstName} ${data.lastName} can log in with the credentials you set.`,
      })
      handleClose(false)
      onSuccess?.('staff')
    } catch (error) {
      toast({
        title: 'Could not create staff',
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

  const handleAdminSubmit = adminForm.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'ADMIN',
        password: data.password,
      })
      toast({
        title: 'Admin created',
        description: `${data.firstName} ${data.lastName} can log in with admin access.`,
      })
      handleClose(false)
      onSuccess?.('admin')
    } catch (error) {
      toast({
        title: 'Could not create admin',
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

  const handleTrainerSubmit = trainerForm.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'TRAINER',
        password: data.password,
        specialization: data.specialization.trim(),
        bio: data.bio?.trim() || undefined,
      })
      toast({
        title: 'Trainer created',
        description: `${data.firstName} ${data.lastName} was added as a trainer.`,
      })
      handleClose(false)
      onSuccess?.('trainer')
    } catch (error) {
      toast({
        title: 'Could not create trainer',
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

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (personType === 'member') void handleMemberSubmit()
    else if (personType === 'staff') void handleStaffSubmit()
    else if (personType === 'admin') void handleAdminSubmit()
    else void handleTrainerSubmit()
  }

  const trainers = trainersQuery.data?.trainers ?? []
  const packages = packagesQuery.data?.data ?? []
  const assignedTrainerId = memberForm.watch('assignedTrainerId')
  const selectedPackageId = memberForm.watch('packageId')
  const selectedPaymentStatus = memberForm.watch('paymentStatus')

  const submitLabel =
    personType === 'member'
      ? 'Add member'
      : personType === 'staff'
        ? 'Create staff'
        : personType === 'admin'
          ? 'Create admin'
          : 'Create trainer'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>Add person</DialogTitle>
          <DialogDescription>
            Add a gym member, staff, admin, or trainer to your gym.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4">
            <Tabs
              value={personType}
              onValueChange={(value) => setPersonType(value as PersonType)}
            >
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
                <TabsTrigger value="member" className="gap-1.5 text-xs sm:text-sm">
                  <Users className="size-3.5 shrink-0" />
                  Member
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-1.5 text-xs sm:text-sm">
                  <User className="size-3.5 shrink-0" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-1.5 text-xs sm:text-sm">
                  <Shield className="size-3.5 shrink-0" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="trainer" className="gap-1.5 text-xs sm:text-sm">
                  <Dumbbell className="size-3.5 shrink-0" />
                  Trainer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="member" className="mt-4 space-y-3 pb-2">
                <FormField
                  name="firstName"
                  control={memberForm.control}
                  label="First name"
                  error={memberForm.formState.errors.firstName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="lastName"
                  control={memberForm.control}
                  label="Last name"
                  error={memberForm.formState.errors.lastName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="email"
                  control={memberForm.control}
                  label="Email"
                  type="email"
                  error={memberForm.formState.errors.email?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="phone"
                  control={memberForm.control}
                  label="Phone (optional)"
                  placeholder="+14155550142"
                  error={memberForm.formState.errors.phone?.message}
                  disabled={isSubmitting}
                />
                <div className="space-y-2">
                  <Label htmlFor="memberPackage">Package *</Label>
                  {packagesQuery.isLoading ? (
                    <LoadingSpinner label="Loading packages…" />
                  ) : (
                    <Select
                      value={selectedPackageId || undefined}
                      onValueChange={(value) =>
                        memberForm.setValue('packageId', value, {
                          shouldValidate: true,
                        })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="memberPackage" className="w-full">
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} · {pkg.durationDays} days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {memberForm.formState.errors.packageId?.message ? (
                    <p className="text-xs text-destructive">
                      {memberForm.formState.errors.packageId.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment status</Label>
                  <Select
                    value={selectedPaymentStatus}
                    onValueChange={(value) =>
                      memberForm.setValue(
                        'paymentStatus',
                        value as 'PAID' | 'PENDING',
                        { shouldValidate: true },
                      )
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="paymentStatus" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTrainer">Assigned trainer (optional)</Label>
                  {trainersQuery.isLoading ? (
                    <LoadingSpinner label="Loading trainers…" />
                  ) : (
                    <Select
                      value={assignedTrainerId || 'none'}
                      onValueChange={(value) =>
                        memberForm.setValue(
                          'assignedTrainerId',
                          value === 'none' ? '' : value,
                          { shouldValidate: true },
                        )
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="assignedTrainer" className="w-full">
                        <SelectValue placeholder="No trainer assigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No trainer</SelectItem>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.user.firstName} {trainer.user.lastName}
                            {trainer.specialization
                              ? ` · ${trainer.specialization}`
                              : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {memberForm.formState.errors.assignedTrainerId?.message ? (
                    <p className="text-xs text-destructive">
                      {memberForm.formState.errors.assignedTrainerId.message}
                    </p>
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value="staff" className="mt-4 space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">
                  Front-desk staff can manage members and mark attendance.
                </p>
                <FormField
                  name="firstName"
                  control={staffForm.control}
                  label="First name"
                  error={staffForm.formState.errors.firstName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="lastName"
                  control={staffForm.control}
                  label="Last name"
                  error={staffForm.formState.errors.lastName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="email"
                  control={staffForm.control}
                  label="Email"
                  type="email"
                  error={staffForm.formState.errors.email?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="password"
                  control={staffForm.control}
                  label="Password"
                  type="password"
                  error={staffForm.formState.errors.password?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="confirmPassword"
                  control={staffForm.control}
                  label="Confirm password"
                  type="password"
                  error={staffForm.formState.errors.confirmPassword?.message}
                  disabled={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="admin" className="mt-4 space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">
                  Admins can manage members, trainers, and daily operations.
                </p>
                <FormField
                  name="firstName"
                  control={adminForm.control}
                  label="First name"
                  error={adminForm.formState.errors.firstName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="lastName"
                  control={adminForm.control}
                  label="Last name"
                  error={adminForm.formState.errors.lastName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="email"
                  control={adminForm.control}
                  label="Email"
                  type="email"
                  error={adminForm.formState.errors.email?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="password"
                  control={adminForm.control}
                  label="Password"
                  type="password"
                  error={adminForm.formState.errors.password?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="confirmPassword"
                  control={adminForm.control}
                  label="Confirm password"
                  type="password"
                  error={adminForm.formState.errors.confirmPassword?.message}
                  disabled={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="trainer" className="mt-4 space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">
                  Trainers get a login and can be assigned to gym members.
                </p>
                <FormField
                  name="firstName"
                  control={trainerForm.control}
                  label="First name"
                  error={trainerForm.formState.errors.firstName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="lastName"
                  control={trainerForm.control}
                  label="Last name"
                  error={trainerForm.formState.errors.lastName?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="email"
                  control={trainerForm.control}
                  label="Email"
                  type="email"
                  error={trainerForm.formState.errors.email?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="specialization"
                  control={trainerForm.control}
                  label="Specialization"
                  placeholder="Strength training"
                  error={trainerForm.formState.errors.specialization?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="bio"
                  control={trainerForm.control}
                  label="Bio (optional)"
                  error={trainerForm.formState.errors.bio?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="password"
                  control={trainerForm.control}
                  label="Password"
                  type="password"
                  error={trainerForm.formState.errors.password?.message}
                  disabled={isSubmitting}
                />
                <FormField
                  name="confirmPassword"
                  control={trainerForm.control}
                  label="Confirm password"
                  type="password"
                  error={trainerForm.formState.errors.confirmPassword?.message}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="mt-2 shrink-0 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} className={cn('min-w-28')}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
