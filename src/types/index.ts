export type Role = "admin" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Plan = "free" | "pro" | "enterprise";
export type CustomerStatus = "active" | "inactive" | "churned";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: Plan;
  status: CustomerStatus;
  mrr: number; // monthly recurring revenue
  country: string;
  createdAt: string; // ISO date
}

export type OrderStatus = "paid" | "pending" | "failed" | "refunded";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  plan: Plan;
  createdAt: string;
}

export type Range = "7d" | "30d" | "90d" | "12m";

export interface Metrics {
  totalRevenue: number;
  activeCustomers: number;
  newSignups: number;
  churnRate: number;
  /** % change versus the previous period of the same length */
  changes: {
    totalRevenue: number;
    activeCustomers: number;
    newSignups: number;
    churnRate: number;
  };
  revenueSeries: { label: string; revenue: number }[];
  signupsSeries: { label: string; signups: number }[];
  planDistribution: { plan: Plan; count: number }[];
  mrrByPlan: { plan: Plan; mrr: number }[];
  topCountries: { country: string; count: number }[];
  statusDistribution: { status: CustomerStatus; count: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Query-string state shared by the tables, the URL and the API. */
export type ListParams = {
  page: number;
  pageSize: number;
  sort: string;
  order: "asc" | "desc";
  search: string;
  status: string[];
  plan: string;
  country: string;
  from: string;
  to: string;
};
