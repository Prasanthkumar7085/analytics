"use client"
import PatientResultTable from "@/components/PatientResults/PatientResultTable";
import { Suspense } from "react";

const PatientResults = () => {

    return (
        <Suspense>
            <div>
                <PatientResultTable />
            </div>
        </Suspense>
    );
}
export default PatientResults;