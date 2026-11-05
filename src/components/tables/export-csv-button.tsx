"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildQuery, fetchJson } from "@/lib/api-client";
import { downloadFile, toCsv, type CsvColumn } from "@/lib/utils";
import type { ListParams, PaginatedResponse } from "@/types";

interface Props<T> {
  endpoint: string;
  params: ListParams;
  filename: string;
  columns: CsvColumn<T>[];
}

/** Exports every row matching the current search/filters/sort (not just the visible page). */
export function ExportCsvButton<T>({ endpoint, params, filename, columns }: Props<T>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function exportRows() {
    setBusy(true);
    setError(false);
    try {
      const res = await fetchJson<PaginatedResponse<T>>(`${endpoint}${buildQuery({ ...params, page: 1, all: 1 })}`);
      downloadFile(filename, toCsv(res.data, columns));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={exportRows} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
        Export CSV
      </Button>
      {error && (
        <span role="alert" className="text-sm text-destructive">
          Export failed
        </span>
      )}
    </div>
  );
}
