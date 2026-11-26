import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { DashboardOverview } from "./_components/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Dashboard Overview"
        description="Monitor Bongaon Bazar orders, inventory, reviews, and customer inquiries."
      >
        <Button render={<Link href="/orders" />}>View All Orders</Button>
      </SectionHeading>

      <DashboardOverview />
    </div>
  );
}
