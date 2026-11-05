import Link from "next/link";

export const metadata = { title: "Access denied" };

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-5xl font-bold text-destructive">403</p>
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p className="text-sm text-muted-foreground">Your role doesn&apos;t allow you to view this page.</p>
      <Link
        href="/dashboard"
        className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
