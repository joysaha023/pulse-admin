import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground/20">P</span>
          Pulse Admin
        </div>
        <div>
          <p className="text-3xl font-semibold leading-tight">See your whole SaaS business in one place.</p>
          <p className="mt-3 max-w-md text-sm opacity-80">
            Revenue, customers and orders, with the filters and charts your team actually needs.
          </p>
        </div>
        <p className="text-xs opacity-70">Demo environment with generated data.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Sign in to your admin account.</p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
