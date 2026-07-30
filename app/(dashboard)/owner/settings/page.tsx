'use client'

import React from 'react'
import Link from 'next/link'
import { UploadCloud, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PageHeader } from '@/components/common'
import { gym, owner } from '@/lib/owner-mock'
import { ROUTES } from '@/config'

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your gym profile, team and account." />

      <Tabs defaultValue="gym" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gym">Gym Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles" asChild>
            <Link href={ROUTES.OWNER_SETTINGS_ROLES}>Roles</Link>
          </TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Gym Profile */}
        <TabsContent value="gym">
          <Card>
            <CardHeader>
              <CardTitle>Gym Profile</CardTitle>
              <CardDescription>Update your gym details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex size-16 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                  <UploadCloud className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Gym logo</p>
                  <p className="text-xs text-muted-foreground">
                    PNG or SVG, up to 2MB. Drag and drop or click to upload.
                  </p>
                  <Button variant="outline" size="sm" className="mt-1">
                    Upload logo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="gymName">Gym name</Label>
                  <Input id="gymName" defaultValue={gym.name} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue={gym.address} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue={gym.city} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue={gym.country} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact email</Label>
                  <Input id="contactEmail" type="email" defaultValue={gym.contactEmail} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={gym.phone} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>
                Invite an admin or staff member to help run daily operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="inviteEmail">Email</Label>
                  <Input id="inviteEmail" type="email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="Jordan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Blake" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Role</Label>
                  <Select defaultValue="STAFF">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Invited members receive an email to set up their account.
                </p>
                <Button className="gap-2">
                  <Send className="size-4" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your owner account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                    {`${owner.firstName[0]}${owner.lastName[0]}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {owner.firstName} {owner.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{owner.email}</p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {owner.firstName} {owner.lastName}
                  </dd>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{owner.email}</dd>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Role
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{owner.role}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
