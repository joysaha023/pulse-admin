"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/states";
import { useUser } from "@/components/layout/user-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { profileSchema, type ProfileInput } from "@/lib/validations";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsView() {
  const user = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  return (
    <>
      <PageHeader title="Settings" description="Your profile and appearance." />
      <div className="grid max-w-3xl gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Demo only: changes are validated but not stored. Role: <Badge tone="info">{user.role}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              noValidate
              className="space-y-4"
              onSubmit={handleSubmit(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              })}
            >
              <div>
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" {...register("name")} aria-invalid={!!errors.name} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                <FieldError message={errors.email?.message} />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save profile</Button>
                {saved && (
                  <span role="status" className="text-sm text-success">
                    Saved (demo)
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how Pulse Admin looks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 sm:max-w-md">
              {THEMES.map(({ value, label, icon: Icon }) => {
                const active = mounted && theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex h-20 flex-col items-center justify-center gap-1.5 rounded-md border text-sm font-medium transition-colors",
                      active ? "border-primary bg-accent text-primary" : "hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
