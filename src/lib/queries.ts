import { db } from "@/lib/mock-db";
import type { Customer, ListParams, Order, PaginatedResponse } from "@/types";

const DAY = 86_400_000;

export type ServerListParams = ListParams & { all: boolean };

const csv = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

/** Reads and sanitises list query-string params (used by the API routes). */
export function parseListParams(sp: URLSearchParams): ServerListParams {
  return {
    page: Math.max(1, Number(sp.get("page")) || 1),
    pageSize: Math.min(100, Math.max(1, Number(sp.get("pageSize")) || 10)),
    sort: sp.get("sort") ?? "createdAt",
    order: sp.get("order") === "asc" ? "asc" : "desc",
    search: (sp.get("search") ?? "").trim().toLowerCase(),
    status: csv(sp.get("status")),
    plan: sp.get("plan") ?? "",
    country: sp.get("country") ?? "",
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
    all: sp.get("all") === "1",
  };
}

function sortRows<T>(rows: T[], key: keyof T, order: "asc" | "desc"): T[] {
  const dir = order === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
    return String(x).localeCompare(String(y)) * dir;
  });
}

function inDateRange(iso: string, from: string, to: string) {
  const t = Date.parse(iso);
  if (from) {
    const f = Date.parse(from);
    if (!Number.isNaN(f) && t < f) return false;
  }
  if (to) {
    const e = Date.parse(to);
    if (!Number.isNaN(e) && t > e + DAY - 1) return false;
  }
  return true;
}

const CUSTOMER_SORT: (keyof Customer)[] = ["name", "email", "company", "plan", "status", "mrr", "country", "createdAt"];
const ORDER_SORT: (keyof Order)[] = ["id", "customerName", "amount", "status", "plan", "createdAt"];

export function queryCustomers(p: ServerListParams): Customer[] {
  const rows = db.customers.filter((c) => {
    if (p.search && !`${c.name} ${c.email} ${c.company}`.toLowerCase().includes(p.search)) return false;
    if (p.status.length && !p.status.includes(c.status)) return false;
    if (p.plan && c.plan !== p.plan) return false;
    if (p.country && c.country !== p.country) return false;
    return inDateRange(c.createdAt, p.from, p.to);
  });
  const key = CUSTOMER_SORT.find((k) => k === p.sort) ?? "createdAt";
  return sortRows(rows, key, p.order);
}

export function queryOrders(p: ServerListParams): Order[] {
  const rows = db.orders.filter((o) => {
    if (p.search && !`${o.id} ${o.customerName}`.toLowerCase().includes(p.search)) return false;
    if (p.status.length && !p.status.includes(o.status)) return false;
    if (p.plan && o.plan !== p.plan) return false;
    return inDateRange(o.createdAt, p.from, p.to);
  });
  const key = ORDER_SORT.find((k) => k === p.sort) ?? "createdAt";
  return sortRows(rows, key, p.order);
}

export function paginate<T>(rows: T[], p: ServerListParams): PaginatedResponse<T> {
  if (p.all) return { data: rows, total: rows.length, page: 1, pageSize: rows.length };
  const start = (p.page - 1) * p.pageSize;
  return { data: rows.slice(start, start + p.pageSize), total: rows.length, page: p.page, pageSize: p.pageSize };
}
