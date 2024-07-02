import PatientResults from "@/components/PatientResults";
import { Suspense } from "react";

const PatientResultDetails = () => {

    return (
        <Suspense>
            <div>
                <PatientResults />
            </div>
        </Suspense>
    );
}
export default PatientResultDetails;