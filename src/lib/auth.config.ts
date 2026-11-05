import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/types";

/**
 * Edge-safe config (no bcrypt / Node APIs) so middleware can import it.
 * The Credentials provider lives in auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (path === "/login") {
        // Logged-in users have no business on the login page.
        return isLoggedIn ? Response.redirect(new URL("/dashboard", nextUrl)) : true;
      }
      if (path === "/unauthorized") return true;
      // false → Auth.js redirects to /login?callbackUrl=<this url>
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
} satisfies NextAuthConfig;
