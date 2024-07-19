"use client";
import ToxiCologyPatientDetails from "@/components/PatientResults/ToxiCologyResults/PatientDetails";
import { Suspense } from "react";

const ToxiCologyPatientResultDetails = () => {
  return (
    <Suspense>
      <div>
        <ToxiCologyPatientDetails />
      </div>
    </Suspense>
  );
};
export default ToxiCologyPatientResultDetails;
