"use client";

import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/common/states";
import { OrderStatusBadge } from "@/components/dashboard/status-badges";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ListParams } from "@/types";

const PARAMS: ListParams = {
  page: 1,
  pageSize: 5,
  sort: "createdAt",
  order: "desc",
  search: "",
  status: [],
  plan: "",
  country: "",
  from: "",
  to: "",
};

export function RecentOrders() {
  const { data, isLoading, isError, refetch } = useOrders(PARAMS);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent orders</CardTitle>
        <Link href="/orders" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <div className="overflow-x-auto p-2 sm:p-3">
        {isLoading ? (
          <div className="space-y-2 p-2" aria-busy>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data && data.data.length > 0 ? (
          <table className="w-full min-w-[480px] text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2.5">
                    <Link href={`/customers/${o.customerId}`} className="font-medium hover:underline">
                      {o.customerName}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="px-3 py-2.5">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(o.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No orders yet" />
        )}
      </div>
    </Card>
  );
}
