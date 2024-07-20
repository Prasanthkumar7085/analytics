"use client";
import ToxiCologyPatientDetails from "@/components/PatientResults/ToxiCologyResults/PatientDetailsDialog";
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
