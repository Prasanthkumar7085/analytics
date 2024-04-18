"use client"
import SalesTargets from "@/components/SalesTargets";
import { Suspense } from "react";

const SalesTargetsPage = () => {
    return (
        <Suspense>
            <SalesTargets />
        </Suspense>
    )
}
export default SalesTargetsPage;