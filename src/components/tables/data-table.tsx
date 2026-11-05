"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ErrorState } from "@/components/common/states";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { Dropdown } from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  sort: string;
  order: "asc" | "desc";
  onSortChange: (sort: string, order: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  onRetry: () => void;
  /** Rendered above the table, left of the column picker. */
  toolbar?: ReactNode;
  emptyState: ReactNode;
  caption: string;
}

/** Generic server-driven table: sorting, paging and filtering happen on the API, not here. */
export function DataTable<TData>({
  columns,
  data,
  total,
  page,
  pageSize,
  sort,
  order,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  isLoading,
  isFetching = false,
  isError,
  onRetry,
  toolbar,
  emptyState,
  caption,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    state: { columnVisibility, sorting: sort ? [{ id: sort, desc: order === "desc" }] : [] },
    onColumnVisibilityChange: setColumnVisibility,
  });

  const hideable = table.getAllLeafColumns().filter((c) => c.getCanHide());
  const colCount = table.getVisibleLeafColumns().length;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">{toolbar}</div>
        <Dropdown
          label="Toggle columns"
          align="right"
          trigger={
            <>
              <Columns3 className="h-4 w-4" aria-hidden /> Columns
            </>
          }
        >
          <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Show columns</p>
          {hideable.map((col) => (
            <label key={col.id} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm px-3 text-sm hover:bg-muted">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                checked={col.getIsVisible()}
                onChange={(e) => col.toggleVisibility(e.target.checked)}
              />
              <span className="capitalize">{typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}</span>
            </label>
          ))}
        </Dropdown>
      </div>

      {isError ? (
        <ErrorState onRetry={onRetry} />
      ) : (
        <div className={cn("overflow-x-auto transition-opacity", isFetching && !isLoading && "opacity-60")}>
          <table className="w-full min-w-[640px] text-sm" aria-busy={isLoading || isFetching}>
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header, i) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                        className={cn("px-3 py-3 font-medium sm:px-4", i === 0 && "sticky left-0 z-10 bg-muted")}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className="-mx-1 inline-flex min-h-8 items-center gap-1 rounded px-1 uppercase hover:text-foreground"
                            onClick={() =>
                              onSortChange(header.column.id, sorted === "desc" ? "asc" : sorted === "asc" ? "desc" : "asc")
                            }
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sorted === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
                            )}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }, (_, r) => (
                  <tr key={r} className="border-t">
                    {Array.from({ length: colCount }, (_, c) => (
                      <td key={c} className="px-3 py-3 sm:px-4">
                        <Skeleton className="h-5 w-full max-w-40" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount}>{emptyState}</td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/40">
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-3 sm:px-4",
                          i === 0 && "sticky left-0 z-10 bg-card",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isError && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
