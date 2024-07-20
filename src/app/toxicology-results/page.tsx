"use client";
import ToxiCologyResults from "@/components/PatientResults/ToxiCologyResults";
import { Suspense } from "react";

const ToxiCologyPatientResultDetails = () => {
  return (
    <Suspense>
      <div>
        <ToxiCologyResults />
      </div>
    </Suspense>
  );
};
export default ToxiCologyPatientResultDetails;
