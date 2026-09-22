"use client";

import { EmptyState, LoadingSpinner, PageHeader } from "@/components/common";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  PACKAGE_FEATURE_GROUPS,
  formatPackageFeatureLabel,
  isLimitedPackageFeature,
} from "@/constants/package-features";
import { useToast } from "@/hooks/use-toast";
import { ApiException } from "@/lib/api/errors";
import { formatCurrency } from "@/lib/helpers/formatting";
import { packagesService } from "@/services";
import { queryKeys } from "@/services/queryKeys";
import type { MembershipPackage } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

const emptyForm = {
  name: "",
  description: "",
  durationDays: "",
  price: "",
  features: [] as string[],
  featureLimits: {} as Record<string, string>,
};

const DEFAULT_MONTHLY_LIMIT = "2";

function formatDuration(days: number) {
  if (days === 1) return "1 day";
  if (days % 365 === 0) {
    const years = days / 365;
    return years === 1 ? "1 year" : `${years} years`;
  }
  if (days % 30 === 0) {
    const months = days / 30;
    return months === 1 ? "1 month" : `${months} months`;
  }
  return `${days} days`;
}

export default function OwnerPackagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MembershipPackage | null>(null);
  const [deleting, setDeleting] = React.useState<MembershipPackage | null>(
    null,
  );
  const [form, setForm] = React.useState(emptyForm);

  const packagesQuery = useQuery({
    queryKey: queryKeys.packages.list(false),
    queryFn: () => packagesService.list(false),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        durationDays: Number(form.durationDays),
        price: Number(form.price),
        features: form.features,
        featureLimits: Object.fromEntries(
          form.features.filter(isLimitedPackageFeature).flatMap((id) => {
            const times = Number(form.featureLimits[id]);
            if (!Number.isInteger(times) || times < 1 || times > 31) {
              return [[id, 2]] as Array<[string, number]>;
            }
            return [[id, times]] as Array<[string, number]>;
          }),
        ),
      };
      if (editing) {
        return packagesService.update(editing.id, payload);
      }
      return packagesService.create(payload);
    },
    onSuccess: () => {
      toast({
        title: editing ? "Package updated" : "Package created",
        description: editing
          ? `${form.name.trim()} was saved.`
          : `${form.name.trim()} is now available when onboarding members.`,
      });
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
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
  const durationValid = Number(form.durationDays) >= 1;
  const priceValid =
    form.price !== "" &&
    Number(form.price) >= 0 &&
    Number.isFinite(Number(form.price));
  const canSave =
    form.name.trim().length >= 2 &&
    durationValid &&
    priceValid &&
    !saveMutation.isPending;
  const assignedCount = deleting?.memberCount ?? 0;
  const canHardDelete = assignedCount === 0;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (pkg: MembershipPackage) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description ?? "",
      durationDays: String(pkg.durationDays),
      price: String(pkg.price),
      features: pkg.features ?? [],
      featureLimits: Object.fromEntries(
        Object.entries(pkg.featureLimits ?? {}).map(([id, times]) => [
          id,
          String(times),
        ]),
      ),
    });
    setFormOpen(true);
  };

  const toggleFeature = (id: string, checked: boolean) => {
    setForm((current) => {
      const features = checked
        ? [...current.features, id]
        : current.features.filter((featureId) => featureId !== id);
      const featureLimits = { ...current.featureLimits };
      if (isLimitedPackageFeature(id)) {
        if (checked) {
          featureLimits[id] = featureLimits[id] || DEFAULT_MONTHLY_LIMIT;
        } else {
          delete featureLimits[id];
        }
      }
      return { ...current, features, featureLimits };
    });
  };

  const toggleFeatureGroup = (groupId: string, checked: boolean) => {
    const group = PACKAGE_FEATURE_GROUPS.find((item) => item.id === groupId);
    if (!group) return;
    const ids = group.items.map((item) => item.id);
    setForm((current) => {
      const withoutGroup = current.features.filter((id) => !ids.includes(id));
      const features = checked ? [...withoutGroup, ...ids] : withoutGroup;
      const featureLimits = { ...current.featureLimits };
      for (const id of ids) {
        if (!isLimitedPackageFeature(id)) continue;
        if (checked) {
          featureLimits[id] = featureLimits[id] || DEFAULT_MONTHLY_LIMIT;
        } else {
          delete featureLimits[id];
        }
      }
      return { ...current, features, featureLimits };
    });
  };

  const setMonthlyLimit = (id: string, value: string) => {
    setForm((current) => ({
      ...current,
      featureLimits: { ...current.featureLimits, [id]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership packages"
        description="Packages you create here are stored in your gym database and used when onboarding members. Duration automatically sets each member’s expiration date."
        actions={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="size-4" />
            Add package
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          {packagesQuery.isLoading ? (
            <LoadingSpinner label="Loading packages from your gym…" />
          ) : packagesQuery.isError ? (
            <EmptyState
              title="Could not load packages"
              description="We could not fetch packages from the database. Check your connection and try again."
            />
          ) : packages.length === 0 ? (
            <EmptyState
              title="No packages yet"
              description="Add a package such as Monthly, Quarterly, Yearly, or a custom plan. Members will pick from this list when you onboard them."
              action={
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="size-4" />
                  Add package
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Includes</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="font-medium">{pkg.name}</div>
                      <p className="text-sm text-muted-foreground">
                        {pkg.description || "No description"}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {(pkg.features ?? []).length === 0 ? (
                        <span className="text-sm text-muted-foreground">
                          None selected
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(pkg.features ?? []).slice(0, 3).map((featureId) => (
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
                          {(pkg.features ?? []).length > 3 ? (
                            <Badge variant="secondary" className="font-normal">
                              +{(pkg.features ?? []).length - 3} more
                            </Badge>
                          ) : null}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDuration(pkg.durationDays)}</TableCell>
                    <TableCell>
                      {formatCurrency(pkg.price, pkg.currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {pkg.memberCount ?? 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "secondary" : "outline"}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${pkg.name}`}
                        onClick={() => openEdit(pkg)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${pkg.name}`}
                        onClick={() => setDeleting(pkg)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        onOpenChange={(next) => {
          setFormOpen(next);
          if (!next) {
            setEditing(null);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit package" : "New package"}
            </DialogTitle>
            <DialogDescription>
              Create or modify a gym membership plan. Tick the facilities and
              services this package includes. Duration sets how long a member’s
              access stays active.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="pkg-name">Name</Label>
              <Input
                id="pkg-name"
                value={form.name}
                onChange={(event) =>
                  setForm((s) => ({ ...s, name: event.target.value }))
                }
                placeholder="e.g. Quarterly"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pkg-duration">Duration (days)</Label>
                <Input
                  id="pkg-duration"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(event) =>
                    setForm((s) => ({ ...s, durationDays: event.target.value }))
                  }
                  placeholder="e.g. 90"
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
            <div className="space-y-2">
              <Label htmlFor="pkg-desc">Description</Label>
              <Textarea
                id="pkg-desc"
                value={form.description}
                onChange={(event) =>
                  setForm((s) => ({ ...s, description: event.target.value }))
                }
                placeholder="Optional details shown to your team"
              />
            </div>
            <div className="space-y-3">
              <div>
                <Label>Included in this package</Label>
                <p className="text-xs text-muted-foreground">
                  Tick only what this gym actually offers. Steam bath, cold
                  therapy, and massage are optional — if you tick them, you can
                  set how many visits are allowed per month.
                </p>
              </div>
              <div className="space-y-3">
                {PACKAGE_FEATURE_GROUPS.map((group) => {
                  const groupIds = group.items.map((item) => item.id);
                  const selectedInGroup = groupIds.filter((id) =>
                    form.features.includes(id),
                  ).length;
                  const allSelected = selectedInGroup === group.items.length;

                  return (
                    <div
                      key={group.id}
                      className="rounded-lg border border-border p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`feature-group-${group.id}`}
                            checked={
                              allSelected
                                ? true
                                : selectedInGroup > 0
                                  ? "indeterminate"
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
                          const selected = form.features.includes(item.id);
                          const limited = isLimitedPackageFeature(item.id);

                          return (
                            <div
                              key={item.id}
                              className={
                                limited && selected
                                  ? "sm:col-span-2 rounded-md border border-border/80 bg-muted/30 p-2"
                                  : "rounded-md p-1.5 hover:bg-muted/40"
                              }
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
                                      value={form.featureLimits[item.id] ?? ""}
                                      onChange={(event) =>
                                        setMonthlyLimit(
                                          item.id,
                                          event.target.value,
                                        )
                                      }
                                      aria-label={`${item.label} times per month`}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button disabled={!canSave} onClick={() => saveMutation.mutate()}>
              {saveMutation.isPending ? "Saving…" : "Save package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <strong>{deleting.name}</strong> will be permanently removed
                  from your gym database. This cannot be undone.
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
