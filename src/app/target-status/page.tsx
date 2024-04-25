"use client";
import MonthWiseTargetStatus from "@/components/TargetStatus";
import { Suspense } from "react";

const MonthWiseTargetStatusPage = () => {
  return (
    <Suspense>
      <MonthWiseTargetStatus />
    </Suspense>
  );
};
export default MonthWiseTargetStatusPage;
