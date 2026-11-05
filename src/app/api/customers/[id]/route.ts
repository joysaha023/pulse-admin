import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/api-guard";
import { db } from "@/lib/mock-db";
import { customerUpdateSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireSession();
  if (guard.error) return guard.error;

  const { id } = await params;
  const customer = db.customers.find((c) => c.id === id);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  const orders = db.orders.filter((o) => o.customerId === id);
  return NextResponse.json({ customer, orders });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireSession({ admin: true });
  if (guard.error) return guard.error;

  const { id } = await params;
  const customer = db.customers.find((c) => c.id === id);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const body: unknown = await req.json().catch(() => null);
  const parsed = customerUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  Object.assign(customer, parsed.data);
  return NextResponse.json(customer);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireSession({ admin: true });
  if (guard.error) return guard.error;

  const { id } = await params;
  const before = db.customers.length;
  db.customers = db.customers.filter((c) => c.id !== id);
  if (db.customers.length === before) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
