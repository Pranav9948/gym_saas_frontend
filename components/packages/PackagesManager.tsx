"use client";

import { EmptyState, LoadingSpinner, PageHeader } from "@/components/common";
import { StatCard } from "@/components/common/StatCard";
import {
  PackageCard,
  PackageFormDialog,
  type PackageFormPayload,
  DURATION_PRESETS,
  formatDuration,
} from "@/components/owner/packages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiException } from "@/lib/api/errors";
import { formatCurrency } from "@/lib/helpers/formatting";
import { packagesService } from "@/services";
import { queryKeys } from "@/services/queryKeys";
import type { MembershipPackage } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers3, Plus, Search, Sparkles, Users } from "lucide-react";
import React from "react";

export function PackagesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MembershipPackage | null>(null);
  const [deleting, setDeleting] = React.useState<MembershipPackage | null>(
    null,
  );
  const [query, setQuery] = React.useState("");
  const [durationFilter, setDurationFilter] = React.useState<number | "all">(
    "all",
  );

  const packagesQuery = useQuery({
    queryKey: queryKeys.packages.list(false),
    queryFn: () => packagesService.list(false),
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      imageFile,
      removeImage,
      ...payload
    }: PackageFormPayload) => {
      const saved = editing
        ? await packagesService.update(editing.id, payload)
        : await packagesService.create(payload);

      if (imageFile) {
        try {
          const withImage = await packagesService.uploadImage(
            saved.data.id,
            imageFile,
          );
          return { pkg: withImage, imageFailed: false as const };
        } catch {
          return { pkg: saved, imageFailed: true as const };
        }
      }
      if (editing && removeImage) {
        const cleared = await packagesService.removeImage(editing.id);
        return { pkg: cleared, imageFailed: false as const };
      }
      return { pkg: saved, imageFailed: false as const };
    },
    onSuccess: (result, variables) => {
      toast({
        title: result.imageFailed
          ? editing
            ? "Package updated, photo not saved"
            : "Package created, photo not saved"
          : editing
            ? "Package updated"
            : "Package created",
        description: result.imageFailed
          ? `${variables.name} was saved. Try adding the photo again from Edit.`
          : editing
            ? `${variables.name} was saved.`
            : `${variables.name} is now available when onboarding members.`,
        variant: result.imageFailed ? "destructive" : "default",
      });
      setFormOpen(false);
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
    },
    onError: (error) => {
      toast({
        title: "Could not save package",
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => packagesService.remove(id),
    onSuccess: () => {
      toast({
        title: "Package deleted",
        description: deleting
          ? `${deleting.name} was removed from your gym.`
          : "The package was removed from your gym.",
      });
      setDeleting(null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
    },
    onError: (error) => {
      toast({
        title: "Could not delete package",
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : "Reassign members using this package first.",
        variant: "destructive",
      });
    },
  });

  const packages = packagesQuery.data?.data ?? [];
  const assignedCount = deleting?.memberCount ?? 0;
  const canHardDelete = assignedCount === 0;
  const membersOnPlans = packages.reduce(
    (sum, pkg) => sum + (pkg.memberCount ?? 0),
    0,
  );
  const topPackage = packages.reduce<MembershipPackage | null>((best, pkg) => {
    if (!best || (pkg.memberCount ?? 0) > (best.memberCount ?? 0)) return pkg;
    return best;
  }, null);

  const filtered = packages.filter((pkg) => {
    const matchesQuery = pkg.name
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesDuration =
      durationFilter === "all" || pkg.durationDays === durationFilter;
    return matchesQuery && matchesDuration;
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership packages"
        description="Create plans with a photo, duration, and facilities. Members pick from this list when you onboard them."
        actions={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="size-4" />
            Add package
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Packages"
          value={String(packages.length)}
          icon={Layers3}
          hint="Active plans members can join"
        />
        <StatCard
          label="Members on a plan"
          value={String(membersOnPlans)}
          icon={Users}
          hint="Assigned across every package"
        />
        <StatCard
          label="Most popular"
          value={
            topPackage
              ? topPackage.name.length > 16
                ? `${topPackage.name.slice(0, 14)}…`
                : topPackage.name
              : "—"
          }
          icon={Sparkles}
          hint={
            topPackage
              ? `${topPackage.memberCount ?? 0} member${(topPackage.memberCount ?? 0) === 1 ? "" : "s"} · ${formatCurrency(topPackage.price, topPackage.currency)}`
              : "Add a package to get started"
          }
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search packages…"
            className="h-10 pl-9"
            aria-label="Search packages"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={durationFilter === "all" ? "default" : "outline"}
            onClick={() => setDurationFilter("all")}
          >
            All
          </Button>
          {DURATION_PRESETS.map((preset) => (
            <Button
              key={preset.days}
              type="button"
              size="sm"
              variant={durationFilter === preset.days ? "default" : "outline"}
              onClick={() => setDurationFilter(preset.days)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {packagesQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading packages from your gym…" />
        </div>
      ) : packagesQuery.isError ? (
        <EmptyState
          title="Could not load packages"
          description="We could not fetch packages from the database. Check your connection and try again."
        />
      ) : packages.length === 0 ? (
        <EmptyState
          title="No packages yet"
          description="Add a monthly, quarterly, or yearly plan — optionally with a photo — so you can assign it when onboarding members."
          action={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="size-4" />
              Add package
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching packages"
          description="Try a different name or duration filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onEdit={() => {
                setEditing(pkg);
                setFormOpen(true);
              }}
              onDelete={() => setDeleting(pkg)}
            />
          ))}
        </div>
      )}

      <PackageFormDialog
        open={formOpen}
        editing={editing}
        isSaving={saveMutation.isPending}
        onOpenChange={(next) => {
          setFormOpen(next);
          if (!next) setEditing(null);
        }}
        onSubmit={(payload) => saveMutation.mutate(payload)}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {canHardDelete
                ? "Delete this package?"
                : "Package cannot be deleted"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && canHardDelete ? (
                <>
                  <strong>{deleting.name}</strong>{" "}
                  ({formatDuration(deleting.durationDays)}) will be permanently
                  removed. This cannot be undone.
                </>
              ) : deleting ? (
                <>
                  <strong>{deleting.name}</strong> is assigned to{" "}
                  {assignedCount} member
                  {assignedCount === 1 ? "" : "s"}. Reassign those members to
                  another package before deleting.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {canHardDelete ? "Cancel" : "Close"}
            </AlertDialogCancel>
            {canHardDelete ? (
              <Button
                variant="destructive"
                disabled={deleteMutation.isPending || !deleting}
                onClick={() => {
                  if (deleting) deleteMutation.mutate(deleting.id);
                }}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete package"}
              </Button>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
