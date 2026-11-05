import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  /** For metrics like churn, a rise is bad news. */
  lowerIsBetter?: boolean;
}

export function KpiCard({ label, value, change, icon: Icon, lowerIsBetter = false }: KpiCardProps) {
  const up = change > 0;
  const good = change === 0 ? true : lowerIsBetter ? !up : up;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold tracking-tight">{value}</p>
          <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", good ? "text-success" : "text-destructive")}>
            {change !== 0 && <Arrow className="h-3.5 w-3.5" aria-hidden />}
            <span>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="font-normal text-muted-foreground">vs previous period</span>
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card aria-hidden>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-36" />
      </CardContent>
    </Card>
  );
}
