export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let message = res.statusText || "Request failed";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // response had no JSON body; keep the status text
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

/** Turns a params object into "?a=1&b=x,y", skipping empty values. */
export function buildQuery(params: Record<string, string | number | string[] | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value.join(",") : value === undefined ? "" : String(value);
    if (v !== "") sp.set(key, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
