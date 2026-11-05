import { Badge } from "@/components/ui/badge";
import type { CustomerStatus, OrderStatus, Plan } from "@/types";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const tone = status === "active" ? "success" : status === "inactive" ? "warning" : "danger";
  return <Badge tone={tone}>{status}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === "paid" ? "success" : status === "pending" ? "warning" : status === "failed" ? "danger" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function PlanBadge({ plan }: { plan: Plan }) {
  return <Badge tone={plan === "enterprise" ? "info" : "neutral"}>{plan}</Badge>;
}
