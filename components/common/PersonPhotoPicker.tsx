"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Crop, ImagePlus, Maximize2, Trash2 } from "lucide-react";
import React from "react";
import { ImageCropDialog } from "./image-crop-dialog";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function PersonPhotoPicker({
  label = "Photo",
  hint = "Optional PNG, JPEG, or WEBP · up to 2MB",
  previewUrl,
  disabled,
  onFileChange,
}: {
  label?: string;
  hint?: string;
  previewUrl: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  // 'fit' shows the whole photo (no crop); 'fill' crops to cover the frame.
  const [fitMode, setFitMode] = React.useState<"fit" | "fill">("fit");
  const [cropOpen, setCropOpen] = React.useState(false);
  const [cropImage, setCropImage] = React.useState<string | null>(null);

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid image",
        description: "Use a PNG, JPEG, or WEBP file.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({
        title: "Image too large",
        description: "Keep the photo under 2MB.",
        variant: "destructive",
      });
      return;
    }

    onFileChange(file);
  };

  const openCropDialog = () => {
    if (!previewUrl) return;

    setCropImage(previewUrl);
    setCropOpen(true);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        onChange={onPick}
        className="hidden border-border bg-background shadow-sm ring-1 ring-border/40 placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary"
      />
      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className={cn(
                "h-44 w-full",
                fitMode === "fit" ? "object-contain" : "object-cover",
              )}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled}
                onClick={() =>
                  setFitMode((m) => (m === "fit" ? "fill" : "fit"))
                }
                title={
                  fitMode === "fit"
                    ? "Switch to fill (crop)"
                    : "Switch to fit (full photo)"
                }
              >
                {fitMode === "fit" ? (
                  <>
                    <Crop className="mr-1.5 size-3.5" />
                    Fit
                  </>
                ) : (
                  <>
                    <Maximize2 className="mr-1.5 size-3.5" />
                    Fill
                  </>
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled}
                onClick={openCropDialog}
              >
                <Crop className="mr-1.5 size-3.5" />
                Crop
              </Button>

              <div className="flex gap-2">
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
          </div>
          <p className="text-xs text-muted-foreground">
            {fitMode === "fit"
              ? "Showing the full photo. Switch to Fill to crop and cover the frame."
              : "Cropped to fill the frame. Switch to Fit to see the whole photo."}
          </p>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ImagePlus className="size-5" />
          </span>
          <span className="text-sm font-medium">Add an optional photo</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}

      {cropImage && (
        <ImageCropDialog
          open={cropOpen}
          image={cropImage}
          onCancel={() => {
            setCropOpen(false);
            setCropImage(null);
          }}
          onCropComplete={(croppedFile) => {
            onFileChange(croppedFile);
            setCropOpen(false);
            setCropImage(null);
          }}
        />
      )}
    </div>
  );
}
