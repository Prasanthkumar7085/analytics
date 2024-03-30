import SalesRepView from "@/components/SalesRepresentatives/SingleSalesRepresentativeView";
import { Suspense } from "react";

const SingleRepresentativePage = () => {
    return (
        <Suspense>
            <SalesRepView />
        </Suspense>
    )
}
export default SingleRepresentativePage;