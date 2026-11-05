import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/api-guard";
import { computeMetrics, isRange } from "@/lib/metrics";

export async function GET(req: NextRequest) {
  const guard = await requireSession();
  if (guard.error) return guard.error;

  const range = req.nextUrl.searchParams.get("range");
  return NextResponse.json(computeMetrics(isRange(range) ? range : "30d"));
}
