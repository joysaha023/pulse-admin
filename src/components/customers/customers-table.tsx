"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/states";
import { CUSTOMER_CSV, getCustomerColumns } from "@/components/customers/customer-columns";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { useUser } from "@/components/layout/user-context";
import { DataTable } from "@/components/tables/data-table";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { ExportCsvButton } from "@/components/tables/export-csv-button";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCustomers } from "@/hooks/use-data";
import { useTableParams } from "@/hooks/use-table-params";
import { fetchJson } from "@/lib/api-client";
import type { Customer } from "@/types";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "churned", label: "Churned" },
];

export function CustomersTable() {
  const isAdmin = useUser().role === "admin";
  const { params, setParams, hasFilters } = useTableParams();
  const { data, isLoading, isFetching, isError, refetch } = useCustomers(params);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: (id: string) => fetchJson<{ ok: true }>(`/api/customers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
      setDeleting(null);
    },
  });

  const columns = useMemo(
    () => getCustomerColumns({ isAdmin, onEdit: setEditing, onDelete: setDeleting }),
    [isAdmin],
  );

  return (
    <>
      <DataTable
        caption="Customers"
        columns={columns}
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
              searchPlaceholder="Search name, email or company"
              statusOptions={STATUS_OPTIONS}
              showCountry
            />
            <ExportCsvButton<Customer>
              endpoint="/api/customers"
              params={params}
              filename="customers.csv"
              columns={CUSTOMER_CSV}
            />
          </div>
        }
        emptyState={
          <EmptyState
            title="No customers match your filters"
            description="Try a different search term or remove some filters."
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  onClick={() => setParams({ search: "", status: [], plan: "", country: "", from: "", to: "" })}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        }
      />

      <EditCustomerDialog customer={editing} onClose={() => setEditing(null)} />

      <Dialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete customer?"
        description={deleting ? `${deleting.name} will be removed from the demo data.` : undefined}
      >
        {remove.isError && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {remove.error.message}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={remove.isPending} onClick={() => deleting && remove.mutate(deleting.id)}>
            {remove.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}
