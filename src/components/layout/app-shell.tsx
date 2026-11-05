"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Brand, SidebarNav } from "@/components/layout/sidebar-nav";
import { titleForPath } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserProvider, type SessionUser } from "@/components/layout/user-context";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false); // desktop: manual collapse
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile drawer

  // Close the drawer after navigating, and on Escape.
  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // Desktop sidebar: icon-only on tablet (md), full on desktop (lg) unless collapsed.
  const labelClass = collapsed ? "hidden" : "hidden lg:inline";

  return (
    <UserProvider user={user}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-card transition-[width] md:flex",
            collapsed ? "w-16" : "w-16 lg:w-60",
          )}
        >
          <Brand labelClass={labelClass} />
          <SidebarNav labelClass={labelClass} />
          <div className="mt-auto hidden border-t p-2 lg:block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 px-3 text-muted-foreground"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" aria-hidden /> Collapse
                </>
              )}
            </Button>
          </div>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} aria-hidden />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-card shadow-xl"
            >
              <div className="flex items-center justify-between border-b pr-2">
                <Brand labelClass="inline" />
                <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarNav labelClass="inline" />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-card/90 px-4 backdrop-blur md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="truncate font-semibold">{titleForPath(pathname)}</p>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main id="main" tabIndex={-1} className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
