"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations";

const DEMO = {
  admin: { email: "admin@example.com", password: "Admin@123" },
  viewer: { email: "viewer@example.com", password: "Viewer@123" },
} as const;

/** Only allow same-site relative redirects (blocks open-redirect via ?callbackUrl=https://evil.com). */
function safeCallback(url: string | null) {
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const callbackUrl = safeCallback(useSearchParams().get("callbackUrl"));
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const res = await signIn("credentials", { ...values, redirect: false });
    if (!res || res.error) {
      setServerError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  function fill(kind: keyof typeof DEMO) {
    setValue("email", DEMO[kind].email, { shouldValidate: true });
    setValue("password", DEMO[kind].password, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <div className="rounded-md border border-dashed p-3 text-sm">
        <p className="mb-2 font-medium">Demo accounts</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fill("admin")}>
            Fill admin
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => fill("viewer")}>
            Fill viewer (read-only)
          </Button>
        </div>
      </div>
    </form>
  );
}
