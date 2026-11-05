"use client";

import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/common/states";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card>
      <ErrorState message={error.message || "An unexpected error occurred."} onRetry={reset} />
    </Card>
  );
}
