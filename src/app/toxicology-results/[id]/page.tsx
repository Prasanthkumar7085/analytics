"use client";
import ToxiCologyResults from "@/components/PatientResults/ToxiCologyResults";
import { Suspense } from "react";

const ToxiCologyPatientResults = () => {
  return (
    <Suspense>
      <div>
        <ToxiCologyResults />
      </div>
    </Suspense>
  );
};
export default ToxiCologyPatientResults;
