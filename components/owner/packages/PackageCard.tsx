"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPackageFeatureLabel } from "@/constants/package-features";
import { formatCurrency } from "@/lib/helpers/formatting";
import { cn } from "@/lib/utils";
import type { MembershipPackage } from "@/types";
import { Clock, Dumbbell, Pencil, Trash2, Users } from "lucide-react";
import {
  formatDuration,
  packageCoverClass,
  perDayPrice,
  resolvePackageImageUrl,
} from "./packages-utils";

export function PackageCard({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: MembershipPackage;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const features = pkg.features ?? [];
  const daily = perDayPrice(pkg.price, pkg.durationDays);
  const extraFeatures = Math.max(0, features.length - 4);
  const imageUrl = resolvePackageImageUrl(pkg.imageUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex size-full items-center justify-center bg-gradient-to-br",
              packageCoverClass(pkg.name),
            )}
          >
            <Dumbbell className="size-12 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex gap-1">
          <Button
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-white/90 text-foreground shadow-sm hover:bg-white"
            aria-label={`Edit ${pkg.name}`}
            onClick={onEdit}
          >
            <Pencil className="size-3.5 text-green-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-white/90 text-destructive shadow-sm hover:bg-white"
            aria-label={`Delete ${pkg.name}`}
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <Badge className="absolute right-3 top-3 border-0 bg-white/90 text-foreground shadow-sm text-black">
          <Clock className="size-3" />
          {formatDuration(pkg.durationDays)}
        </Badge>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(pkg.price, pkg.currency)}
          </p>
          {daily != null ? (
            <p className="text-xs text-white/80">
              {formatCurrency(daily, pkg.currency)} / day
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {pkg.name}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {pkg.description || "No description yet"}
            </p>
          </div>
          <Badge variant={pkg.isActive ? "secondary" : "outline"}>
            {pkg.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1">
          {features.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              No facilities selected
            </span>
          ) : (
            <>
              {features.slice(0, 4).map((featureId) => (
                <Badge
                  key={featureId}
                  variant="outline"
                  className="font-normal"
                >
                  {formatPackageFeatureLabel(
                    featureId,
                    pkg.featureLimits?.[featureId],
                  )}
                </Badge>
              ))}
              {extraFeatures > 0 ? (
                <Badge variant="secondary" className="font-normal">
                  +{extraFeatures} more
                </Badge>
              ) : null}
            </>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            {pkg.memberCount ?? 0} member
            {(pkg.memberCount ?? 0) === 1 ? "" : "s"}
          </p>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </article>
  );
}
