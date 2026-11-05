"use client";

import { DollarSign, TrendingDown, UserPlus, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ErrorState, PageHeader } from "@/components/common/states";
import { DonutChart, RevenueChart, SignupsChart } from "@/components/dashboard/charts";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/kpi-card";
import { RangeSelect } from "@/components/dashboard/range-select";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetrics } from "@/hooks/use-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Range } from "@/types";

function ChartCard({ title, loading, children }: { title: string; loading: boolean; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{loading ? <Skeleton className="h-72 w-full" /> : children}</CardContent>
    </Card>
  );
}

export function DashboardView() {
  const [range, setRange] = useState<Range>("30d");
  const { data, isLoading, isError, refetch } = useMetrics(range);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="How the business is doing right now."
        actions={<RangeSelect value={range} onChange={setRange} />}
      />

      {isError ? (
        <Card>
          <ErrorState onRetry={() => refetch()} />
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading || !data ? (
              Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
            ) : (
              <>
                <KpiCard
                  label="Total revenue"
                  value={formatCurrency(data.totalRevenue)}
                  change={data.changes.totalRevenue}
                  icon={DollarSign}
                />
                <KpiCard
                  label="Active customers"
                  value={formatNumber(data.activeCustomers)}
                  change={data.changes.activeCustomers}
                  icon={Users}
                />
                <KpiCard
                  label="New signups"
                  value={formatNumber(data.newSignups)}
                  change={data.changes.newSignups}
                  icon={UserPlus}
                />
                <KpiCard
                  label="Churn rate"
                  value={`${data.churnRate}%`}
                  change={data.changes.churnRate}
                  icon={TrendingDown}
                  lowerIsBetter
                />
              </>
            )}
          </section>

          <section className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <ChartCard title="Revenue" loading={isLoading || !data}>
              {data && <RevenueChart data={data.revenueSeries} />}
            </ChartCard>
            <ChartCard title="New signups" loading={isLoading || !data}>
              {data && <SignupsChart data={data.signupsSeries} />}
            </ChartCard>
          </section>

          <section className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <ChartCard title="Plan distribution" loading={isLoading || !data}>
              {data && (
                <DonutChart
                  label="Customers by plan, donut chart"
                  data={data.planDistribution.map((p) => ({ name: p.plan, value: p.count }))}
                />
              )}
            </ChartCard>
            <div className="min-w-0 lg:col-span-2">
              <RecentOrders />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
