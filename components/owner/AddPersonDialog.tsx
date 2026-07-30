'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dumbbell, User, Users } from 'lucide-react'
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
import { FormField } from '@/components/common'
import {
  addMemberPersonSchema,
  addStaffPersonSchema,
  addTrainerPersonSchema,
  type PersonType,
  type AddMemberPersonFormData,
  type AddStaffPersonFormData,
  type AddTrainerPersonFormData,
} from '@/schemas/owner-person.schema'
import { membersService, tenantService, trainersService } from '@/services'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface AddPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
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

  const memberForm = useForm<AddMemberPersonFormData>({
    resolver: zodResolver(addMemberPersonSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      assignedTrainerId: '',
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
      })
      toast({
        title: 'Member added',
        description: `${data.firstName} ${data.lastName} was added successfully.`,
      })
      handleClose(false)
      onSuccess?.()
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
      onSuccess?.()
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

  const handleTrainerSubmit = trainerForm.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      const userResponse = await tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'STAFF',
        password: data.password,
      })

      await trainersService.createTrainer({
        userId: userResponse.data.id,
        specialization: data.specialization,
        bio: data.bio || undefined,
      })

      toast({
        title: 'Trainer created',
        description: `${data.firstName} ${data.lastName} was added as a trainer.`,
      })
      handleClose(false)
      onSuccess?.()
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
    else void handleTrainerSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Add person</DialogTitle>
          <DialogDescription>
            Add a gym member, front-desk staff, or trainer to your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="px-6 pt-4">
            <Tabs
              value={personType}
              onValueChange={(value) => setPersonType(value as PersonType)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="member" className="gap-1.5">
                  <Users className="size-3.5" />
                  Member
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-1.5">
                  <User className="size-3.5" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="trainer" className="gap-1.5">
                  <Dumbbell className="size-3.5" />
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
              </TabsContent>

              <TabsContent value="staff" className="mt-4 space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">
                  Creates a staff account they can use to log in immediately.
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

              <TabsContent value="trainer" className="mt-4 space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">
                  Creates a staff login and promotes them to trainer.
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

          <DialogFooter className="mt-2 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className={cn(personType === 'staff' && 'min-w-28')}
            >
              {personType === 'member'
                ? 'Add member'
                : personType === 'staff'
                  ? 'Create staff'
                  : 'Create trainer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
