import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("en-US");

export const formatCurrency = (n: number) => currency.format(n);
export const formatNumber = (n: number) => number.format(n);

/** UTC so server and client render the same string (no hydration mismatch). */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

/** Builds CSV text. Text cells starting with = + - @ are prefixed to block spreadsheet formula injection. */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const esc = (v: string | number) => {
    let s = String(v);
    if (typeof v === "string" && /^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = columns.map((c) => esc(c.header)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(c.value(r))).join(","));
  return [head, ...body].join("\n");
}

export function downloadFile(filename: string, content: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
