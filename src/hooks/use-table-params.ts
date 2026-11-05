"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ListParams } from "@/types";

const PAGE_SIZES = [10, 20, 50];

/** Table state (page, sort, search, filters) lives in the URL so refresh and share links work. */
export function useTableParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const query = sp.toString();

  const params: ListParams = useMemo(() => {
    const q = new URLSearchParams(query);
    const size = Number(q.get("pageSize"));
    return {
      page: Math.max(1, Number(q.get("page")) || 1),
      pageSize: PAGE_SIZES.includes(size) ? size : 10,
      sort: q.get("sort") ?? "createdAt",
      order: q.get("order") === "asc" ? "asc" : "desc",
      search: q.get("search") ?? "",
      status: q.get("status")?.split(",").filter(Boolean) ?? [],
      plan: q.get("plan") ?? "",
      country: q.get("country") ?? "",
      from: q.get("from") ?? "",
      to: q.get("to") ?? "",
    };
  }, [query]);

  const setParams = useCallback(
    (patch: Partial<ListParams>) => {
      const next = new URLSearchParams(query);
      for (const [key, value] of Object.entries(patch)) {
        const v = Array.isArray(value) ? value.join(",") : String(value ?? "");
        if (v === "") next.delete(key);
        else next.set(key, v);
      }
      // Any change other than paging itself sends the user back to page 1.
      if (!("page" in patch)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [query, pathname, router],
  );

  const hasFilters = Boolean(
    params.search || params.status.length || params.plan || params.country || params.from || params.to,
  );

  return { params, setParams, hasFilters };
}
