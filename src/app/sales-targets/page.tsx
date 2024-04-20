"use client"
import SalesTargets from "@/components/SalesCaseTypesTargets";
import { Suspense } from "react";

const SalesTargetsPage = () => {
    return (
      <Suspense>
        <SalesTargets />
      </Suspense>
    );
}
export default SalesTargetsPage;