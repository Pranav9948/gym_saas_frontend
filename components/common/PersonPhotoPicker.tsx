'use client'

import React from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export function PersonPhotoPicker({
  label = 'Photo',
  hint = 'Optional PNG, JPEG, or WEBP · up to 2MB',
  previewUrl,
  disabled,
  onFileChange,
}: {
  label?: string
  hint?: string
  previewUrl: string | null
  disabled?: boolean
  onFileChange: (file: File | null) => void
}) {
  const { toast } = useToast()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        description: 'Keep the photo under 2MB.',
        variant: 'destructive',
      })
      return
    }

    onFileChange(file)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={onPick}
      />
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-36 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={disabled}
              onClick={() => onFileChange(null)}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground',
            disabled && 'pointer-events-none opacity-60',
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ImagePlus className="size-5" />
          </span>
          <span className="text-sm font-medium">Add an optional photo</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}
    </div>
  )
}
