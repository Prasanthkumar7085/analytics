"use client";
import BillingOverView from "@/components/BillingAnalytics/OverView";
import { Suspense } from "react";

const BillingDashBoard = () => {
  return (
    <Suspense>
      <BillingOverView />
    </Suspense>
  );
};
export default BillingDashBoard;
