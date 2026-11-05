"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input, Select } from "@/components/ui/input";
import { COUNTRIES } from "@/lib/countries";
import { useDebounce } from "@/hooks/use-debounce";
import type { ListParams } from "@/types";

interface Props {
  params: ListParams;
  setParams: (patch: Partial<ListParams>) => void;
  hasFilters: boolean;
  searchPlaceholder: string;
  statusOptions: { value: string; label: string }[];
  showCountry?: boolean;
}

/** Search box that writes to the URL 300ms after the user stops typing. */
function SearchInput({
  initial,
  placeholder,
  onSearch,
}: {
  initial: string;
  placeholder: string;
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    if (debounced !== initial) onSearch(debounced);
    // Only react to the user's typing; `initial` changing from the URL must not re-fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}

export function DataTableToolbar({
  params,
  setParams,
  hasFilters,
  searchPlaceholder,
  statusOptions,
  showCountry = false,
}: Props) {
  // Bumping this remounts SearchInput so "Clear filters" also empties the text box.
  const [resetKey, setResetKey] = useState(0);

  const statusLabel = params.status.length
    ? `Status (${params.status.length})`
    : "Status";

  function toggleStatus(value: string, checked: boolean) {
    const next = checked ? [...params.status, value] : params.status.filter((s) => s !== value);
    setParams({ status: next });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          key={resetKey}
          initial={params.search}
          placeholder={searchPlaceholder}
          onSearch={(search) => setParams({ search })}
        />

        <Dropdown
          label="Filter by status"
          trigger={
            <>
              {statusLabel} <ChevronDown className="h-4 w-4" aria-hidden />
            </>
          }
        >
          {statusOptions.map((o) => (
            <label key={o.value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm px-3 text-sm hover:bg-muted">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                checked={params.status.includes(o.value)}
                onChange={(e) => toggleStatus(o.value, e.target.checked)}
              />
              {o.label}
            </label>
          ))}
        </Dropdown>

        <Select
          aria-label="Filter by plan"
          value={params.plan}
          onChange={(e) => setParams({ plan: e.target.value })}
          className="sm:w-36"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </Select>

        {showCountry && (
          <Select
            aria-label="Filter by country"
            value={params.country}
            onChange={(e) => setParams({ country: e.target.value })}
            className="sm:w-44"
          >
            <option value="">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          From
          <Input
            type="date"
            value={params.from}
            max={params.to || undefined}
            onChange={(e) => setParams({ from: e.target.value })}
            className="w-full sm:w-40"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          To
          <Input
            type="date"
            value={params.to}
            min={params.from || undefined}
            onChange={(e) => setParams({ to: e.target.value })}
            className="w-full sm:w-40"
          />
        </label>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setParams({ search: "", status: [], plan: "", country: "", from: "", to: "" });
              setResetKey((k) => k + 1);
            }}
          >
            <X className="h-4 w-4" aria-hidden /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
