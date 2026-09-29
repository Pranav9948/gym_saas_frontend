"use client";

import {
  CollapsibleSidebar,
  SidebarHeaderRow,
} from "@/components/layout/CollapsibleSidebar";
import { Button } from "@/components/ui/button";
import { STAFF_NAV_ITEMS, filterNavItems } from "@/config/navigation";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { logout, permissions } = useAuth();
  const navItems = React.useMemo(
    () => filterNavItems(STAFF_NAV_ITEMS, permissions),
    [permissions],
  );

  return (
    <CollapsibleSidebar>
      <div className="flex h-full flex-col">
        <SidebarHeaderRow>
          <h1 className="truncate text-sm font-semibold">GymFlow</h1>
        </SidebarHeaderRow>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn("w-full justify-start gap-2")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </CollapsibleSidebar>
  );
}
