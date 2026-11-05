"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { OrderStatusBadge, PlanBadge } from "@/components/dashboard/status-badges";
import { formatCurrency, formatDate, type CsvColumn } from "@/lib/utils";
import type { Order } from "@/types";

export const ORDER_COLUMNS: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <Link href={`/customers/${row.original.customerId}`} className="font-medium hover:underline">
        {row.original.customerName}
      </Link>
    ),
  },
  { accessorKey: "plan", header: "Plan", cell: ({ row }) => <PlanBadge plan={row.original.plan} /> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.amount)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>,
  },
];

export const ORDER_CSV: CsvColumn<Order>[] = [
  { header: "Order ID", value: (o) => o.id },
  { header: "Customer ID", value: (o) => o.customerId },
  { header: "Customer", value: (o) => o.customerName },
  { header: "Plan", value: (o) => o.plan },
  { header: "Status", value: (o) => o.status },
  { header: "Amount (USD)", value: (o) => o.amount },
  { header: "Date", value: (o) => o.createdAt.slice(0, 10) },
];
