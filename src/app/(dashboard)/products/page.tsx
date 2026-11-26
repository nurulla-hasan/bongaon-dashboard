import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductFilters } from "./_components/product-filters";
import { ProductFormModal } from "./_components/product-form-modal";
import { ProductsTable } from "./_components/products-table";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Products"
        description="Manage storefront catalog, pricing, stock levels, and visibility."
      >
        <ProductFormModal />
      </SectionHeading>

      <Suspense fallback={null}>
        <ProductFilters />
        <ProductsTable />
      </Suspense>
    </div>
  );
}
