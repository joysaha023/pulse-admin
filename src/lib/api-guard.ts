import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

type Guard = { session: Session; error?: undefined } | { session?: undefined; error: NextResponse };

/** Returns the session, or a ready-made 401/403 response. */
export async function requireSession(opts: { admin?: boolean } = {}): Promise<Guard> {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  if (opts.admin && session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }
  return { session };
}
