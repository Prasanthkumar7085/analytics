"use client";
import SingleCaseTypeDetails from "@/components/CaseTypes/SingleCaseTypeDetails";
import { Suspense } from "react";

const SingleCaseTypePage = () => {
  return (
    <Suspense>
      <SingleCaseTypeDetails />
    </Suspense>
  );
};
export default SingleCaseTypePage;
