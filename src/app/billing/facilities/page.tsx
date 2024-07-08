"use client";
import BillingAndRevenueFacilities from "@/components/BillingAnalytics/Facilities";
import { Suspense } from "react";

const BillingAndRevenueFacilitiesPage = () => {
  return (
    <Suspense>
      <BillingAndRevenueFacilities />
    </Suspense>
  );
};
export default BillingAndRevenueFacilitiesPage;
