import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Runs the `authorized` callback from auth.config.ts on every matched request.
export default NextAuth(authConfig).auth;

export const config = {
  // API routes check the session themselves and answer 401 (JSON) instead of redirecting.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
