"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { buildQuery, fetchJson } from "@/lib/api-client";
import type { Customer, ListParams, Metrics, Order, PaginatedResponse, Range } from "@/types";

export function useCustomers(params: ListParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => fetchJson<PaginatedResponse<Customer>>(`/api/customers${buildQuery(params)}`),
    placeholderData: keepPreviousData,
  });
}

export function useOrders(params: ListParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchJson<PaginatedResponse<Order>>(`/api/orders${buildQuery(params)}`),
    placeholderData: keepPreviousData,
  });
}

export function useMetrics(range: Range) {
  return useQuery({
    queryKey: ["metrics", range],
    queryFn: () => fetchJson<Metrics>(`/api/metrics?range=${range}`),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchJson<{ customer: Customer; orders: Order[] }>(`/api/customers/${id}`),
    retry: false,
  });
}
