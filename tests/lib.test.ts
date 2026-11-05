import { describe, expect, it } from "vitest";
import { computeMetrics } from "@/lib/metrics";
import { db } from "@/lib/mock-db";
import { paginate, parseListParams, queryCustomers, queryOrders } from "@/lib/queries";
import { toCsv } from "@/lib/utils";
import { customerUpdateSchema, loginSchema } from "@/lib/validations";

const params = (qs: string) => parseListParams(new URLSearchParams(qs));

describe("toCsv", () => {
  it("escapes quotes and commas", () => {
    const csv = toCsv([{ a: 'He said "hi", ok' }], [{ header: "A", value: (r) => r.a }]);
    expect(csv).toBe('A\n"He said ""hi"", ok"');
  });

  it("neutralises spreadsheet formulas", () => {
    const csv = toCsv([{ a: "=SUM(A1:A9)" }], [{ header: "A", value: (r) => r.a }]);
    expect(csv.split("\n")[1]).toBe("'=SUM(A1:A9)");
  });
});

describe("parseListParams", () => {
  it("applies defaults and clamps page size", () => {
    const p = params("pageSize=9999&page=-3");
    expect(p.page).toBe(1);
    expect(p.pageSize).toBe(100);
    expect(p.order).toBe("desc");
  });

  it("splits multi-value status", () => {
    expect(params("status=active,churned").status).toEqual(["active", "churned"]);
  });
});

describe("customer queries", () => {
  it("generates stable seeded data", () => {
    expect(db.customers).toHaveLength(200);
    expect(db.orders).toHaveLength(500);
  });

  it("filters by status and plan", () => {
    const rows = queryCustomers(params("status=active&plan=pro"));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((c) => c.status === "active" && c.plan === "pro")).toBe(true);
  });

  it("searches name/email/company case-insensitively", () => {
    const target = db.customers[0];
    const rows = queryCustomers(params(`search=${encodeURIComponent(target.email.toUpperCase())}`));
    expect(rows.map((c) => c.id)).toContain(target.id);
  });

  it("sorts ascending and descending", () => {
    const asc = queryCustomers(params("sort=mrr&order=asc")).map((c) => c.mrr);
    const desc = queryCustomers(params("sort=mrr&order=desc")).map((c) => c.mrr);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("ignores unknown sort keys instead of crashing", () => {
    expect(() => queryCustomers(params("sort=__proto__"))).not.toThrow();
  });

  it("paginates and reports the filtered total", () => {
    const p = params("page=2&pageSize=20");
    const res = paginate(queryCustomers(p), p);
    expect(res.data).toHaveLength(20);
    expect(res.total).toBe(200);
  });

  it("returns every row with all=1", () => {
    const p = params("all=1");
    expect(paginate(queryOrders(p), p).data).toHaveLength(500);
  });
});

describe("computeMetrics", () => {
  it("returns series sized for each range", () => {
    expect(computeMetrics("7d").revenueSeries).toHaveLength(7);
    expect(computeMetrics("30d").signupsSeries).toHaveLength(30);
    expect(computeMetrics("90d").revenueSeries).toHaveLength(13);
    expect(computeMetrics("12m").revenueSeries).toHaveLength(12);
  });

  it("plan distribution adds up to all customers", () => {
    const total = computeMetrics("30d").planDistribution.reduce((s, p) => s + p.count, 0);
    expect(total).toBe(db.customers.length);
  });
});

describe("validation", () => {
  it("rejects bad logins", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "123456" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.co", password: "123" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.co", password: "123456" }).success).toBe(true);
  });

  it("rejects unknown plan values on customer update", () => {
    const res = customerUpdateSchema.safeParse({
      name: "Ann Lee",
      email: "ann@x.io",
      company: "X",
      plan: "gold",
      status: "active",
    });
    expect(res.success).toBe(false);
  });
});
