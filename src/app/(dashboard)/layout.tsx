import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Middleware already blocks anonymous users; this is the second line of defence.
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell
      user={{
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        role: session.user.role,
      }}
    >
      {children}
    </AppShell>
  );
}
