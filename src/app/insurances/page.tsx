import InsurancesComponent from "@/components/Insurances";
import { Suspense } from "react";

const InsurancesPage = () => {
    return (
        <Suspense>
            <InsurancesComponent />
        </Suspense>
    )
}
export default InsurancesPage;