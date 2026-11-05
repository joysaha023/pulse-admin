import { faker } from "@faker-js/faker";
import type { Customer, CustomerStatus, Order, OrderStatus, Plan } from "@/types";

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "India",
  "Bangladesh",
  "Canada",
  "Australia",
  "France",
  "Brazil",
  "Japan",
] as const;

export const PLAN_PRICE: Record<Plan, number> = { free: 0, pro: 49, enterprise: 299 };

const DAY = 86_400_000;

interface DB {
  customers: Customer[];
  orders: Order[];
}

function build(): DB {
  faker.seed(42); // stable data between reloads
  const now = Date.now();

  const customers: Customer[] = Array.from({ length: 200 }, (_, i) => {
    const plan = faker.helpers.weightedArrayElement<Plan>([
      { weight: 5, value: "free" },
      { weight: 3, value: "pro" },
      { weight: 2, value: "enterprise" },
    ]);
    const status = faker.helpers.weightedArrayElement<CustomerStatus>([
      { weight: 7, value: "active" },
      { weight: 2, value: "inactive" },
      { weight: 1, value: "churned" },
    ]);
    const seats = plan === "pro" ? faker.number.int({ min: 1, max: 5 }) : faker.number.int({ min: 1, max: 4 });
    const mrr = status === "active" && plan !== "free" ? PLAN_PRICE[plan] * seats : 0;
    return {
      id: `cus_${String(i + 1).padStart(4, "0")}`,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      company: faker.company.name(),
      plan,
      status,
      mrr,
      country: faker.helpers.arrayElement(COUNTRIES),
      createdAt: new Date(now - faker.number.int({ min: 0, max: 400 * DAY })).toISOString(),
    };
  });

  const payers = customers.filter((c) => c.plan !== "free");
  const orders: Order[] = Array.from({ length: 500 }, (_, i) => {
    const c = faker.helpers.arrayElement(payers);
    const created = Date.parse(c.createdAt);
    return {
      id: `ord_${String(i + 1).padStart(4, "0")}`,
      customerId: c.id,
      customerName: c.name,
      amount: PLAN_PRICE[c.plan] * faker.number.int({ min: 1, max: 3 }),
      status: faker.helpers.weightedArrayElement<OrderStatus>([
        { weight: 75, value: "paid" },
        { weight: 10, value: "pending" },
        { weight: 8, value: "failed" },
        { weight: 7, value: "refunded" },
      ]),
      plan: c.plan,
      createdAt: new Date(created + faker.number.int({ min: 0, max: Math.max(1, now - created) })).toISOString(),
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { customers, orders };
}

// Keep one instance across hot reloads in dev.
const g = globalThis as unknown as { __pulseDb?: DB };
export const db: DB = g.__pulseDb ?? (g.__pulseDb = build());
