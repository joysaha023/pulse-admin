"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { CustomerStatusBadge, PlanBadge } from "@/components/dashboard/status-badges";
import { Dropdown, MenuItem } from "@/components/ui/dropdown";
import { formatCurrency, formatDate, type CsvColumn } from "@/lib/utils";
import type { Customer } from "@/types";

interface Options {
  isAdmin: boolean;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}

export function getCustomerColumns({ isAdmin, onEdit, onDelete }: Options): ColumnDef<Customer, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-0">
          <Link href={`/customers/${row.original.id}`} className="font-medium hover:underline">
            {row.original.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "plan", header: "Plan", cell: ({ row }) => <PlanBadge plan={row.original.plan} /> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "mrr",
      header: "MRR",
      cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.mrr)}</span>,
    },
    { accessorKey: "country", header: "Country" },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Dropdown
          label={`Actions for ${row.original.name}`}
          align="right"
          triggerClassName="h-9 w-9 border-0 bg-transparent p-0"
          trigger={<MoreHorizontal className="h-4 w-4" aria-hidden />}
        >
          {(close) => (
            <>
              <Link
                href={`/customers/${row.original.id}`}
                className="flex min-h-10 items-center gap-2 rounded-sm px-3 text-sm hover:bg-muted"
                onClick={close}
              >
                <Eye className="h-4 w-4" aria-hidden /> View
              </Link>
              {isAdmin && (
                <>
                  <MenuItem
                    onClick={() => {
                      close();
                      onEdit(row.original);
                    }}
                  >
                    <Pencil className="h-4 w-4" aria-hidden /> Edit
                  </MenuItem>
                  <MenuItem
                    className="text-destructive"
                    onClick={() => {
                      close();
                      onDelete(row.original);
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden /> Delete
                  </MenuItem>
                </>
              )}
            </>
          )}
        </Dropdown>
      ),
    },
  ];
}

export const CUSTOMER_CSV: CsvColumn<Customer>[] = [
  { header: "ID", value: (c) => c.id },
  { header: "Name", value: (c) => c.name },
  { header: "Email", value: (c) => c.email },
  { header: "Company", value: (c) => c.company },
  { header: "Plan", value: (c) => c.plan },
  { header: "Status", value: (c) => c.status },
  { header: "MRR (USD)", value: (c) => c.mrr },
  { header: "Country", value: (c) => c.country },
  { header: "Joined", value: (c) => c.createdAt.slice(0, 10) },
];
