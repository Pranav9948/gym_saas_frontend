'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  PACKAGE_FEATURE_GROUPS,
  isLimitedPackageFeature,
} from '@/constants/package-features'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { MembershipPackage } from '@/types'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { DURATION_PRESETS, resolvePackageImageUrl } from './packages-utils'

const DEFAULT_MONTHLY_LIMIT = '2'
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export type PackageFormPayload = {
  name: string
  description?: string
  durationDays: number
  price: number
  features: string[]
  featureLimits: Record<string, number>
  imageFile: File | null
  removeImage: boolean
}

const emptyForm = {
  name: '',
  description: '',
  durationDays: '30',
  price: '',
  features: [] as string[],
  featureLimits: {} as Record<string, string>,
}

export function PackageFormDialog({
  open,
  editing,
  isSaving,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  editing: MembershipPackage | null
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: PackageFormPayload) => void
}) {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [form, setForm] = React.useState(emptyForm)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [removeImage, setRemoveImage] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description ?? '',
        durationDays: String(editing.durationDays),
        price: String(editing.price),
        features: editing.features ?? [],
        featureLimits: Object.fromEntries(
          Object.entries(editing.featureLimits ?? {}).map(([id, times]) => [
            id,
            String(times),
          ]),
        ),
      })
      setPreviewUrl(resolvePackageImageUrl(editing.imageUrl))
    } else {
      setForm(emptyForm)
      setPreviewUrl(null)
    }
    setImageFile(null)
    setRemoveImage(false)
  }, [open, editing])

  React.useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const durationValid = Number(form.durationDays) >= 1
  const priceValid =
    form.price !== '' &&
    Number(form.price) >= 0 &&
    Number.isFinite(Number(form.price))
  const canSave =
    form.name.trim().length >= 2 && durationValid && priceValid && !isSaving

  const onPickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid image',
        description: 'Use a PNG, JPEG, or WEBP file.',
        variant: 'destructive',
      })
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({
        title: 'Image too large',
        description: 'Keep the package image under 2MB.',
        variant: 'destructive',
      })
      return
    }

    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const clearImage = () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setImageFile(null)
    setPreviewUrl(null)
    setRemoveImage(Boolean(editing?.imageUrl))
  }

  const toggleFeature = (id: string, checked: boolean) => {
    setForm((current) => {
      const features = checked
        ? [...current.features, id]
        : current.features.filter((featureId) => featureId !== id)
      const featureLimits = { ...current.featureLimits }
      if (isLimitedPackageFeature(id)) {
        if (checked) {
          featureLimits[id] = featureLimits[id] || DEFAULT_MONTHLY_LIMIT
        } else {
          delete featureLimits[id]
        }
      }
      return { ...current, features, featureLimits }
    })
  }

  const toggleFeatureGroup = (groupId: string, checked: boolean) => {
    const group = PACKAGE_FEATURE_GROUPS.find((item) => item.id === groupId)
    if (!group) return
    const ids = group.items.map((item) => item.id)
    setForm((current) => {
      const withoutGroup = current.features.filter((id) => !ids.includes(id))
      const features = checked ? [...withoutGroup, ...ids] : withoutGroup
      const featureLimits = { ...current.featureLimits }
      for (const id of ids) {
        if (!isLimitedPackageFeature(id)) continue
        if (checked) {
          featureLimits[id] = featureLimits[id] || DEFAULT_MONTHLY_LIMIT
        } else {
          delete featureLimits[id]
        }
      }
      return { ...current, features, featureLimits }
    })
  }

  const save = () => {
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      features: form.features,
      featureLimits: Object.fromEntries(
        form.features.filter(isLimitedPackageFeature).flatMap((id) => {
          const times = Number(form.featureLimits[id])
          if (!Number.isInteger(times) || times < 1 || times > 31) {
            return [[id, 2]] as Array<[string, number]>
          }
          return [[id, times]] as Array<[string, number]>
        }),
      ),
      imageFile,
      removeImage: removeImage && !imageFile,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Edit package' : 'New membership package'}
          </DialogTitle>
          <DialogDescription>
            Add a photo, set duration and price, then tick the facilities this
            plan includes. Duration sets how long a member stays active.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Package image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onPickImage}
            />
            {previewUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Package preview"
                  className="h-40 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={clearImage}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="size-5" />
                </span>
                <span className="text-sm font-medium">Add an optional photo</span>
                <span className="text-xs">PNG, JPEG, or WEBP · up to 2MB</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkg-name">Name</Label>
            <Input
              id="pkg-name"
              value={form.name}
              onChange={(event) =>
                setForm((s) => ({ ...s, name: event.target.value }))
              }
              placeholder="e.g. Gold Quarterly"
            />
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => {
                const selected = Number(form.durationDays) === preset.days
                return (
                  <Button
                    key={preset.days}
                    type="button"
                    size="sm"
                    variant={selected ? 'default' : 'outline'}
                    className={selected ? undefined : 'bg-background'}
                    onClick={() =>
                      setForm((s) => ({ ...s, durationDays: String(preset.days) }))
                    }
                  >
                    {preset.label}
                  </Button>
                )
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pkg-duration">Days</Label>
                <Input
                  id="pkg-duration"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(event) =>
                    setForm((s) => ({ ...s, durationDays: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pkg-price">Price</Label>
                <Input
                  id="pkg-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) =>
                    setForm((s) => ({ ...s, price: event.target.value }))
                  }
                  placeholder="e.g. 4000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkg-desc">Description</Label>
            <Textarea
              id="pkg-desc"
              value={form.description}
              onChange={(event) =>
                setForm((s) => ({ ...s, description: event.target.value }))
              }
              placeholder="What makes this plan worth joining?"
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label>Included in this package</Label>
              <p className="text-xs text-muted-foreground">
                Tick only what this gym actually offers. Steam bath, cold
                therapy, and massage can be limited per month.
              </p>
            </div>
            <div className="space-y-3">
              {PACKAGE_FEATURE_GROUPS.map((group) => {
                const groupIds = group.items.map((item) => item.id)
                const selectedInGroup = groupIds.filter((id) =>
                  form.features.includes(id),
                ).length
                const allSelected = selectedInGroup === group.items.length

                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-border bg-muted/20 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`feature-group-${group.id}`}
                          checked={
                            allSelected
                              ? true
                              : selectedInGroup > 0
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={(checked) =>
                            toggleFeatureGroup(group.id, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`feature-group-${group.id}`}
                          className="font-medium"
                        >
                          {group.label}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {selectedInGroup}/{group.items.length}
                      </span>
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {group.items.map((item) => {
                        const selected = form.features.includes(item.id)
                        const limited = isLimitedPackageFeature(item.id)

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              'rounded-lg p-1.5',
                              limited && selected
                                ? 'sm:col-span-2 border border-border bg-background p-2'
                                : 'hover:bg-background/80',
                            )}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={`feature-${item.id}`}
                                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
                              >
                                <Checkbox
                                  id={`feature-${item.id}`}
                                  checked={selected}
                                  onCheckedChange={(checked) =>
                                    toggleFeature(item.id, checked === true)
                                  }
                                />
                                <span className="text-sm">{item.label}</span>
                              </label>
                              {limited && selected ? (
                                <div className="flex items-center gap-2 pl-6 sm:pl-0">
                                  <Label
                                    htmlFor={`limit-${item.id}`}
                                    className="whitespace-nowrap text-xs text-muted-foreground"
                                  >
                                    Times / month
                                  </Label>
                                  <Input
                                    id={`limit-${item.id}`}
                                    type="number"
                                    min={1}
                                    max={31}
                                    className="h-8 w-16"
                                    value={form.featureLimits[item.id] ?? ''}
                                    onChange={(event) =>
                                      setForm((current) => ({
                                        ...current,
                                        featureLimits: {
                                          ...current.featureLimits,
                                          [item.id]: event.target.value,
                                        },
                                      }))
                                    }
                                    aria-label={`${item.label} times per month`}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button disabled={!canSave} onClick={save} className="gap-2">
            <Upload className="size-4" />
            {isSaving ? 'Saving…' : editing ? 'Save changes' : 'Create package'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
