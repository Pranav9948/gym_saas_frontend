'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormField, PersonPhotoPicker } from '@/components/common'
import {
  addTrainerPersonSchema,
  type AddTrainerPersonFormData,
} from '@/schemas/owner-person.schema'
import { tenantService, trainersService } from '@/services'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'

interface StaffAddTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StaffAddTrainerDialog({
  open,
  onOpenChange,
  onSuccess,
}: StaffAddTrainerDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [photoFile, setPhotoFile] = React.useState<File | null>(null)
  const photoPreview = React.useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile],
  )

  React.useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const form = useForm<AddTrainerPersonFormData>({
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
    if (!open) {
      form.reset()
      setPhotoFile(null)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      const created = await tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'TRAINER',
        password: data.password,
        specialization: data.specialization.trim(),
        bio: data.bio?.trim() || undefined,
      })
      if (photoFile && created.data.trainerId) {
        try {
          await trainersService.uploadAvatar(created.data.trainerId, photoFile)
        } catch {
          toast({
            title: 'Trainer created, photo not saved',
            description: 'You can add a photo later from trainer settings.',
            variant: 'destructive',
          })
          onOpenChange(false)
          onSuccess?.()
          return
        }
      }
      toast({
        title: 'Trainer created',
        description: `${data.firstName} ${data.lastName} can now be assigned to members.`,
      })
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,740px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
          <DialogTitle>Add trainer</DialogTitle>
          <DialogDescription>
            Create a trainer account that members can be assigned to for personal
            training.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
            <PersonPhotoPicker
              label="Trainer photo"
              previewUrl={photoPreview}
              disabled={isSubmitting}
              onFileChange={setPhotoFile}
            />
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
              name="specialization"
              control={form.control}
              label="Specialization"
              placeholder="e.g. Strength training"
              error={form.formState.errors.specialization?.message}
              disabled={isSubmitting}
            />
            <FormField
              name="bio"
              control={form.control}
              label="Bio (optional)"
              error={form.formState.errors.bio?.message}
              disabled={isSubmitting}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                name="password"
                control={form.control}
                label="Password"
                type="password"
                error={form.formState.errors.password?.message}
                disabled={isSubmitting}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                label="Confirm password"
                type="password"
                error={form.formState.errors.confirmPassword?.message}
                disabled={isSubmitting}
              />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Create trainer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
