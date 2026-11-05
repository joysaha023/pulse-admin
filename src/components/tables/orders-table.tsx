"use client";

import { EmptyState } from "@/components/common/states";
import { DataTable } from "@/components/tables/data-table";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { ExportCsvButton } from "@/components/tables/export-csv-button";
import { ORDER_COLUMNS, ORDER_CSV } from "@/components/tables/order-columns";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-data";
import { useTableParams } from "@/hooks/use-table-params";
import type { Order } from "@/types";

const STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export function OrdersTable() {
  const { params, setParams, hasFilters } = useTableParams();
  const { data, isLoading, isFetching, isError, refetch } = useOrders(params);

  return (
    <DataTable
      caption="Orders"
      columns={ORDER_COLUMNS}
      data={data?.data ?? []}
      total={data?.total ?? 0}
      page={params.page}
      pageSize={params.pageSize}
      sort={params.sort}
      order={params.order}
      onSortChange={(sort, order) => setParams({ sort, order })}
      onPageChange={(page) => setParams({ page })}
      onPageSizeChange={(pageSize) => setParams({ pageSize })}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => refetch()}
      toolbar={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <DataTableToolbar
            params={params}
            setParams={setParams}
            hasFilters={hasFilters}
            searchPlaceholder="Search order ID or customer"
            statusOptions={STATUS_OPTIONS}
          />
          <ExportCsvButton<Order> endpoint="/api/orders" params={params} filename="orders.csv" columns={ORDER_CSV} />
        </div>
      }
      emptyState={
        <EmptyState
          title="No orders match your filters"
          description="Try a different search term or remove some filters."
          action={
            hasFilters ? (
              <Button variant="outline" onClick={() => setParams({ search: "", status: [], plan: "", from: "", to: "" })}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      }
    />
  );
}
