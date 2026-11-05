"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Role } from "@/types";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

const UserContext = createContext<SessionUser | null>(null);

export function UserProvider({ user, children }: { user: SessionUser; children: ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): SessionUser {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used inside <UserProvider>");
  return user;
}
