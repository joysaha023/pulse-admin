"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { ErrorState, EmptyState } from "@/components/common/states";
import { OrderHistoryChart } from "@/components/dashboard/charts";
import { CustomerStatusBadge, OrderStatusBadge, PlanBadge } from "@/components/dashboard/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/use-data";
import { ApiError } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";

export function CustomerDetail({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useCustomer(id);

  const history = useMemo(() => {
    if (!data) return [];
    return data.orders
      .filter((o) => o.status === "paid")
      .slice()
      .reverse()
      .map((o) => ({ label: formatDate(o.createdAt), amount: o.amount }));
  }, [data]);

  const back = (
    <Link href="/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Back to customers
    </Link>
  );

  if (isLoading) {
    return (
      <>
        {back}
        <Skeleton className="mb-4 h-32 w-full" />
        <Skeleton className="h-72 w-full" />
      </>
    );
  }

  if (isError || !data) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <>
        {back}
        <Card>
          {notFound ? (
            <EmptyState title="Customer not found" description="They may have been deleted." />
          ) : (
            <ErrorState onRetry={() => refetch()} />
          )}
        </Card>
      </>
    );
  }

  const { customer, orders } = data;
  const facts: [string, ReactNode][] = [
    ["Company", customer.company],
    ["Email", customer.email],
    ["Country", customer.country],
    ["Joined", formatDate(customer.createdAt)],
    ["MRR", formatCurrency(customer.mrr)],
  ];

  return (
    <>
      {back}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
        <PlanBadge plan={customer.plan} />
        <CustomerStatusBadge status={customer.status} />
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="min-w-0 truncate text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Paid orders over time</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? <OrderHistoryChart data={history} /> : <EmptyState title="No paid orders yet" />}
          </CardContent>
        </Card>

        <Card className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>Order history ({orders.length})</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto p-2 sm:p-3">
            {orders.length === 0 ? (
              <EmptyState title="No orders" />
            ) : (
              <table className="w-full min-w-[480px] text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Order</th>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2.5 font-mono text-xs">{o.id}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{formatDate(o.createdAt)}</td>
                      <td className="px-3 py-2.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(o.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
