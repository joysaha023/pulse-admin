"use client";

import type { ReactNode } from "react";
import { ErrorState, PageHeader } from "@/components/common/states";
import { CountriesChart, DonutChart, MrrChart, RevenueChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetrics } from "@/hooks/use-data";

function ChartCard({ title, loading, children, className }: { title: string; loading: boolean; children: ReactNode; className?: string }) {
  return (
    <Card className={`min-w-0 ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{loading ? <Skeleton className="h-72 w-full" /> : children}</CardContent>
    </Card>
  );
}

export function AnalyticsView() {
  const { data, isLoading, isError, refetch } = useMetrics("12m");

  return (
    <>
      <PageHeader title="Analytics" description="Twelve-month view of revenue, plans and geography." />
      {isError ? (
        <Card>
          <ErrorState onRetry={() => refetch()} />
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <ChartCard title="Revenue, last 12 months" loading={isLoading || !data} className="lg:col-span-2">
            {data && <RevenueChart data={data.revenueSeries} />}
          </ChartCard>
          <ChartCard title="MRR by plan" loading={isLoading || !data}>
            {data && <MrrChart data={data.mrrByPlan} />}
          </ChartCard>
          <ChartCard title="Customer status" loading={isLoading || !data}>
            {data && (
              <DonutChart
                label="Customers by status, donut chart"
                data={data.statusDistribution.map((s) => ({ name: s.status, value: s.count }))}
              />
            )}
          </ChartCard>
          <ChartCard title="Top countries" loading={isLoading || !data} className="lg:col-span-2">
            {data && <CountriesChart data={data.topCountries} />}
          </ChartCard>
        </div>
      )}
    </>
  );
}
