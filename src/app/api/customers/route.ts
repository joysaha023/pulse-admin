import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/api-guard";
import { paginate, parseListParams, queryCustomers } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const guard = await requireSession();
  if (guard.error) return guard.error;

  const params = parseListParams(req.nextUrl.searchParams);
  return NextResponse.json(paginate(queryCustomers(params), params));
}
