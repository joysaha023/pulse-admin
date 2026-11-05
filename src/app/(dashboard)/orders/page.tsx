import { Suspense } from "react";
import { PageHeader } from "@/components/common/states";
import { OrdersTable } from "@/components/tables/orders-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Every payment across all plans." />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <OrdersTable />
      </Suspense>
    </>
  );
}
