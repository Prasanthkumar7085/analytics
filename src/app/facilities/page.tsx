"use client"
import FacilitiesList from "@/components/Facilities";
import { Suspense } from "react";

const FacilitiesPage = () => {
  return (
    <Suspense>
      <FacilitiesList />
    </Suspense>
  );
};
export default FacilitiesPage;