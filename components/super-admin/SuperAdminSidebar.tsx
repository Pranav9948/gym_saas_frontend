'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/plans', label: 'Plans', icon: ShoppingCart },
  { href: '/super-admin/gyms', label: 'Gyms', icon: Users },
  { href: '/super-admin/owners', label: 'Owners', icon: Users },
  { href: '/super-admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/super-admin/settings', label: 'Settings', icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Super Admin</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-40"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={cn(
            'fixed left-0 top-0 h-full w-64 bg-background border-r z-40 transition-transform duration-200',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return <div className="hidden md:flex flex-col w-64 border-r h-screen bg-muted/30">{sidebarContent}</div>;
}
