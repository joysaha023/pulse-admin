import { Suspense } from "react";
import { PageHeader } from "@/components/common/states";
import { CustomersTable } from "@/components/customers/customers-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" description="Search, filter and manage everyone on your platform." />
      {/* useSearchParams() inside the table needs a Suspense boundary */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <CustomersTable />
      </Suspense>
    </>
  );
}
