import { db } from "@/lib/mock-db";
import type { Customer, CustomerStatus, Metrics, Plan, Range } from "@/types";

const DAY = 86_400_000;
const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90, "12m": 365 };

export function isRange(v: string | null): v is Range {
  return v === "7d" || v === "30d" || v === "90d" || v === "12m";
}

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round(((a - b) / b) * 1000) / 10);
const fmt = (t: number, opts: Intl.DateTimeFormatOptions) =>
  new Date(t).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

interface Bucket {
  label: string;
  start: number;
  end: number;
}

/** 7d/30d → daily, 90d → weekly, 12m → monthly. */
function buckets(range: Range, now: number): Bucket[] {
  const out: Bucket[] = [];
  if (range === "12m") {
    const d = new Date(now);
    for (let i = 11; i >= 0; i--) {
      const start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1);
      const end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i + 1, 1);
      out.push({ label: fmt(start, { month: "short" }), start, end });
    }
    return out;
  }
  const step = range === "90d" ? 7 * DAY : DAY;
  const n = range === "7d" ? 7 : range === "30d" ? 30 : 13;
  for (let i = 0; i < n; i++) {
    const start = now - (n - i) * step;
    out.push({
      label: fmt(start, { month: "short", day: "numeric" }),
      start,
      end: i === n - 1 ? now + 1 : start + step,
    });
  }
  return out;
}

function churnRate(customers: Customer[]) {
  if (customers.length === 0) return 0;
  const churned = customers.filter((c) => c.status === "churned").length;
  return Math.round((churned / customers.length) * 1000) / 10;
}

export function computeMetrics(range: Range, now = Date.now()): Metrics {
  const span = RANGE_DAYS[range] * DAY;
  const start = now - span;
  const prevStart = start - span;
  const { customers, orders } = db;

  const paid = orders.filter((o) => o.status === "paid");
  const sumPaid = (from: number, to: number) =>
    paid.reduce((s, o) => {
      const t = Date.parse(o.createdAt);
      return t >= from && t < to ? s + o.amount : s;
    }, 0);
  const signups = (from: number, to: number) =>
    customers.filter((c) => {
      const t = Date.parse(c.createdAt);
      return t >= from && t < to;
    }).length;

  const totalRevenue = sumPaid(start, now + 1);
  const newSignups = signups(start, now + 1);
  const active = customers.filter((c) => c.status === "active");
  const activeBefore = active.filter((c) => Date.parse(c.createdAt) <= start).length;
  const churn = churnRate(customers);
  const churnBefore = churnRate(customers.filter((c) => Date.parse(c.createdAt) <= start));

  const bs = buckets(range, now);

  const planCount = (["free", "pro", "enterprise"] as Plan[]).map((plan) => ({
    plan,
    count: customers.filter((c) => c.plan === plan).length,
  }));
  const mrrByPlan = (["pro", "enterprise"] as Plan[]).map((plan) => ({
    plan,
    mrr: customers.filter((c) => c.plan === plan).reduce((s, c) => s + c.mrr, 0),
  }));
  const countryMap = new Map<string, number>();
  for (const c of customers) countryMap.set(c.country, (countryMap.get(c.country) ?? 0) + 1);

  return {
    totalRevenue,
    activeCustomers: active.length,
    newSignups,
    churnRate: churn,
    changes: {
      totalRevenue: pct(totalRevenue, sumPaid(prevStart, start)),
      activeCustomers: pct(active.length, activeBefore),
      newSignups: pct(newSignups, signups(prevStart, start)),
      churnRate: pct(churn, churnBefore),
    },
    revenueSeries: bs.map((b) => ({ label: b.label, revenue: sumPaid(b.start, b.end) })),
    signupsSeries: bs.map((b) => ({ label: b.label, signups: signups(b.start, b.end) })),
    planDistribution: planCount,
    mrrByPlan,
    topCountries: [...countryMap.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    statusDistribution: (["active", "inactive", "churned"] as CustomerStatus[]).map((status) => ({
      status,
      count: customers.filter((c) => c.status === status).length,
    })),
  };
}
