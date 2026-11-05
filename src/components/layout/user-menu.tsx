"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Dropdown, MenuItem } from "@/components/ui/dropdown";
import { useUser } from "@/components/layout/user-context";
import { initials } from "@/lib/utils";

export function UserMenu() {
  const user = useUser();
  return (
    <Dropdown
      label="Account menu"
      align="right"
      triggerClassName="h-10 w-10 rounded-full border-0 bg-primary p-0 text-xs font-semibold text-primary-foreground hover:opacity-90 hover:bg-primary"
      trigger={<span aria-hidden>{initials(user.name)}</span>}
    >
      <div className="border-b px-3 py-2">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <Badge tone={user.role === "admin" ? "info" : "neutral"} className="mt-2">
          {user.role}
        </Badge>
      </div>
      <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4" aria-hidden /> Sign out
      </MenuItem>
    </Dropdown>
  );
}
