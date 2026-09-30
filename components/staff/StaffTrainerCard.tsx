"use client";

import { TrainerPhoto } from "@/components/trainers/TrainerPhoto";
import { Badge } from "@/components/ui/badge";
import { resolveMediaUrl } from "@/lib/helpers/media";
import { cn } from "@/lib/utils";
import type { Trainer } from "@/types";
import { Dumbbell, Mail, Users } from "lucide-react";

const COVERS = [
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-sky-500 via-cyan-500 to-teal-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-500 via-blue-500 to-sky-500",
  "from-rose-500 via-pink-500 to-orange-400",
] as const;

function coverClass(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % COVERS.length;
  }
  return COVERS[hash] ?? COVERS[0];
}

export function StaffTrainerCard({ trainer }: { trainer: Trainer }) {
  const name = `${trainer.user.firstName} ${trainer.user.lastName}`.trim();
  const photo = resolveMediaUrl(trainer.user.avatarUrl);
  const members = trainer._count?.members ?? 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex size-full items-center justify-center bg-gradient-to-br",
              coverClass(name),
            )}
          >
            <Dumbbell className="size-12 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        {trainer.user.isActive != null ? (
          <Badge className="absolute right-3 top-3 border-0 bg-white/90 text-green-800 font-bold shadow-sm">
            {trainer.user.isActive ? "Active" : "Inactive"}
          </Badge>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          <TrainerPhoto
            user={trainer.user}
            size="lg"
            className="size-12 border-2 border-white/80 shadow-md"
          />
          <div className="min-w-0 flex-1 pb-0.5">
            <p className="truncate text-lg font-semibold text-white">{name}</p>
            <p className="truncate text-xs text-white/80">
              {trainer.specialization || "No specialization yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="inline-flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <Mail className="size-3.5 shrink-0" />
          {trainer.user.email}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {trainer.bio || "No bio yet"}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            {members} member{members === 1 ? "" : "s"} assigned
          </p>
        </div>
      </div>
    </article>
  );
}
