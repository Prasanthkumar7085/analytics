import SalesRepresentatives from "@/components/SalesRepresentatives";
import { Suspense } from "react";

const SalesRepresentativesPage = () => {
  return (
    <Suspense>
      <SalesRepresentatives />
    </Suspense>
  );
};

export default SalesRepresentativesPage;
