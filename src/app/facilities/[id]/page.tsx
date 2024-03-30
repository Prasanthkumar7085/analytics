import FacilitiesView from "@/components/Facilities/SingleFacilitieView";
import { Suspense } from "react";

const SingleFacilityViewPage = () => {
    return (
        <Suspense>
            <FacilitiesView />
        </Suspense>
    )
}
export default SingleFacilityViewPage;