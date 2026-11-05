"use client";

import { cn } from "@/lib/utils";
import type { Range } from "@/types";

const OPTIONS: { value: Range; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
];

export function RangeSelect({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div role="group" aria-label="Date range" className="inline-flex rounded-md border bg-card p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-9 rounded px-3 text-sm font-medium transition-colors",
            value === o.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
