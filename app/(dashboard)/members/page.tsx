"use client";

import {
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
  Pagination,
} from "@/components/common";
import { StaffAddMemberDialog } from "@/components/staff/StaffAddMemberDialog";
import { StaffEditMemberDialog } from "@/components/staff/StaffEditMemberDialog";
import {
  DaysLeftChip,
  PaymentStatusBadge,
  StaffPageHeader,
  canMarkMemberPaid,
  formatMoney,
  isMemberOverdue,
  monthlyPackagePrice,
  personInitials,
} from "@/components/staff/staff-ui";
import { TrainerChip } from "@/components/trainers/TrainerPhoto";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERMISSIONS } from "@/config";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { ApiException } from "@/lib/api/errors";
import { membersService, queryKeys } from "@/services";
import type { Member } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Plus, Search, Users } from "lucide-react";
import React from "react";

const PAGE_SIZE = 10;

export default function StaffMembersPage() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<Member | null>(null);
  const [payingMember, setPayingMember] = React.useState<Member | null>(null);

  const canCreate = hasPermission(PERMISSIONS.MEMBER.CREATE);
  const canUpdate = hasPermission(PERMISSIONS.MEMBER.UPDATE);
  const canMarkPaid = canUpdate;

  const membersQuery = useQuery({
    queryKey: queryKeys.members.list({
      page,
      limit: PAGE_SIZE,
      search: query || undefined,
      paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    }),
    queryFn: () =>
      membersService.getMembers({
        page,
        limit: PAGE_SIZE,
        search: query || undefined,
        paymentStatus:
          paymentStatus === "all"
            ? undefined
            : (paymentStatus as "PAID" | "PENDING" | "OVERDUE" | "UNPAID"),
      }),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => membersService.markPaid(id),
    onSuccess: () => {
      toast({
        title: "Payment recorded",
        description: "The gym owner has been notified.",
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
      setPayingMember(null);
    },
    onError: (error) => {
      toast({
        title: "Could not mark payment",
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const members = membersQuery.data?.members ?? [];
  const total = membersQuery.data?.meta.total ?? 0;
  const totalPages = membersQuery.data?.meta.totalPages ?? 1;
  const filtered = Boolean(query || paymentStatus !== "all");

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Members"
        description="Create members, assign a trainer for personal training, and record fees."
        actions={
          canCreate ? (
            <Button
              className="w-full sm:w-auto"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-4" />
              Add member
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="space-y-4 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name or email"
                className="pl-9"
                aria-label="Search members"
              />
            </div>
            <Select
              value={paymentStatus}
              onValueChange={(value) => {
                setPaymentStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Filter by payment"
              >
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {membersQuery.isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <LoadingSpinner label="Loading members…" />
            </div>
          ) : membersQuery.isError ? (
            <EmptyState
              icon={<Users className="size-8 text-muted-foreground" />}
              title="Could not load members"
              description="Check your connection and try again."
            />
          ) : members.length === 0 ? (
            <EmptyState
              icon={<Users className="size-8 text-muted-foreground" />}
              title={filtered ? "No matching members" : "No members yet"}
              description={
                filtered
                  ? "Try a different search or payment filter."
                  : canCreate
                    ? "Add a member and choose a package. Personal training packages require a trainer."
                    : "No members have been added yet."
              }
              action={
                canCreate && !filtered ? (
                  <Button onClick={() => setAddOpen(true)}>
                    <Plus className="size-4" />
                    Add member
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {members.map((member) => (
                  <MemberMobileCard
                    key={member.id}
                    member={member}
                    canUpdate={canUpdate}
                    canMarkPaid={canMarkPaid}
                    onEdit={() => setEditingMember(member)}
                    onMarkPaid={() => setPayingMember(member)}
                  />
                ))}
              </div>

              <div className="-mx-4 hidden overflow-x-auto md:mx-0 md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Monthly</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Days left</TableHead>
                      <TableHead>Trainer</TableHead>
                      {canUpdate ? (
                        <TableHead className="text-right">Actions</TableHead>
                      ) : null}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => {
                      const overdue = isMemberOverdue(member);
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9">
                                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                  {personInitials(
                                    member.firstName,
                                    member.lastName,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="truncate font-medium text-foreground">
                                  {member.firstName} {member.lastName}
                                </div>
                                <p className="truncate text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {member.membershipPackage?.name ?? "—"}
                              </p>
                              {member.membershipPackage ? (
                                <p className="text-xs text-muted-foreground">
                                  {formatMoney(
                                    member.membershipPackage.price,
                                    member.membershipPackage.currency,
                                  )}{" "}
                                  / {member.membershipPackage.durationDays} days
                                </p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium tabular-nums">
                            {member.membershipPackage
                              ? `${formatMoney(
                                  monthlyPackagePrice(
                                    member.membershipPackage.price,
                                    member.membershipPackage.durationDays,
                                  ),
                                  member.membershipPackage.currency,
                                )}/mo`
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge
                              status={member.paymentStatus}
                              overdue={overdue}
                            />
                          </TableCell>
                          <TableCell>
                            <DaysLeftChip
                              remainingDays={member.remainingDays}
                            />
                          </TableCell>
                          <TableCell>
                            <TrainerChip
                              user={member.assignedTrainer?.user}
                              photoSize="sm"
                            />
                          </TableCell>
                          {canUpdate ? (
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingMember(member)}
                                  className="h-9 gap-1.5 rounded-lg border-slate-700 bg-slate-900/60 px-3 text-slate-300 shadow-sm border-blue-200 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                                >
                                  <Pencil className="size-3.5" />
                                  <span>Edit</span>
                                </Button>

                                {canMarkMemberPaid(member) ? (
                                  <Button
                                    size="sm"
                                    onClick={() => setPayingMember(member)}
                                    className="h-9 gap-1.5 rounded-lg border border-emerald-500/60 bg-emerald-600 px-3 text-white shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-500 hover:text-white"
                                  >
                                    <Check className="size-4" />
                                    <span>Mark paid</span>
                                  </Button>
                                ) : null}
                              </div>
                            </TableCell>
                          ) : null}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {total} member{total === 1 ? "" : "s"}
                </p>
                {totalPages > 1 ? (
                  <div className="overflow-x-auto">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      isLoading={membersQuery.isFetching}
                    />
                  </div>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <StaffAddMemberDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.members.all,
          });
        }}
      />

      <StaffEditMemberDialog
        member={editingMember}
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null);
        }}
        onSuccess={() => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.members.all,
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(payingMember)}
        title="Mark this payment as paid?"
        description={
          payingMember
            ? `${payingMember.firstName} ${payingMember.lastName}'s fees will be recorded as paid, and the gym owner will be notified.`
            : undefined
        }
        confirmText="Mark paid"
        onCancel={() => setPayingMember(null)}
        onConfirm={async () => {
          if (!payingMember) return;
          await markPaidMutation.mutateAsync(payingMember.id);
        }}
      />
    </div>
  );
}

function MemberMobileCard({
  member,
  canUpdate,
  canMarkPaid,
  onEdit,
  onMarkPaid,
}: {
  member: Member;
  canUpdate: boolean;
  canMarkPaid: boolean;
  onEdit: () => void;
  onMarkPaid: () => void;
}) {
  const overdue = isMemberOverdue(member);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-none ring-1 ring-foreground/10">
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {personInitials(member.firstName, member.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {member.firstName} {member.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
            <PaymentStatusBadge
              status={member.paymentStatus}
              overdue={overdue}
            />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Package</dt>
              <dd className="truncate">
                {member.membershipPackage?.name ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Monthly</dt>
              <dd className="tabular-nums">
                {member.membershipPackage
                  ? `${formatMoney(
                      monthlyPackagePrice(
                        member.membershipPackage.price,
                        member.membershipPackage.durationDays,
                      ),
                      member.membershipPackage.currency,
                    )}/mo`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Trainer</dt>
              <dd className="mt-1">
                <TrainerChip
                  user={member.assignedTrainer?.user}
                  photoSize="sm"
                />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Next payment</dt>
              <dd className="mt-1">
                <DaysLeftChip remainingDays={member.remainingDays} />
              </dd>
            </div>
          </dl>
          {canUpdate ? (
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onEdit}
              >
                <Pencil className="size-3.5" />
                Edit member
              </Button>
              {canMarkPaid && canMarkMemberPaid(member) ? (
                <Button className="w-full" size="sm" onClick={onMarkPaid}>
                  Mark paid
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
