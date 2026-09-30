'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StaffPageHeader } from '@/components/staff/staff-ui'
import { TrainerPhoto } from '@/components/trainers/TrainerPhoto'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { queryKeys, trainersService } from '@/services'
import { useAuthStore } from '@/store/authStore'

export default function TrainerSettingsPage() {
  const { user } = useAuth()
  const setUser = useAuthStore((state) => state.setUser)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: queryKeys.trainers.me(),
    queryFn: () => trainersService.getMe(),
  })

  const profile = meQuery.data?.data
  const [firstName, setFirstName] = React.useState(user?.firstName ?? '')
  const [lastName, setLastName] = React.useState(user?.lastName ?? '')
  const [specialization, setSpecialization] = React.useState('')
  const [bio, setBio] = React.useState('')

  React.useEffect(() => {
    if (!profile) return
    setFirstName(profile.user.firstName)
    setLastName(profile.user.lastName)
    setSpecialization(profile.specialization ?? '')
    setBio(profile.bio ?? '')
  }, [profile])

  const save = useMutation({
    mutationFn: () =>
      trainersService.updateMe({
        firstName,
        lastName,
        specialization,
        bio,
      }),
    onSuccess: (response) => {
      if (user) {
        setUser({
          ...user,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          avatarUrl: response.data.user.avatarUrl,
        })
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.me() })
      toast({ title: 'Profile updated', description: 'Your trainer details were saved.' })
    },
    onError: (error) => {
      toast({
        title: 'Could not update profile',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  const upload = useMutation({
    mutationFn: (file: File) => trainersService.uploadMyAvatar(file),
    onSuccess: (response) => {
      if (user) {
        setUser({
          ...user,
          avatarUrl: response.data.user.avatarUrl,
        })
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.me() })
      toast({ title: 'Photo updated', description: 'Your profile picture is now live.' })
    },
    onError: (error) => {
      toast({
        title: 'Could not upload photo',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Use a PNG, JPEG, or WEBP under 2 MB.',
        variant: 'destructive',
      })
    },
  })

  const avatarUrl = profile?.user.avatarUrl ?? user?.avatarUrl

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Settings"
        description="Update your name, coaching details, and profile photo."
      />

      <Card>
        <CardContent className="space-y-5 px-4 pt-5 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <TrainerPhoto
              user={{
                firstName,
                lastName,
                avatarUrl,
              }}
              size="xl"
            />
            <div>
              <Label htmlFor="trainer-photo">Profile photo</Label>
              <Input
                id="trainer-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-2"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) upload.mutate(file)
                }}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPEG, or WEBP. Max 2 MB.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Specialization</Label>
              <Input
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(event) => setBio(event.target.value)} />
            </div>
          </div>

          <Button disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? 'Saving…' : 'Save profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
