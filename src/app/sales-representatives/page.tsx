"use client";
import SalesRepresentatives from "@/components/SalesRepresentatives";
import TeamWiseSalesReps from "@/components/SalesRepresentatives/TeamWiseSalesReps";
import { adminAccess } from "@/lib/helpers/hasAccessOrNot";
import { Suspense } from "react";

const SalesRepresentativesPage = () => {
  return (
    <Suspense>
      <section id="salesRepresentativesPage">
        {adminAccess() ? <TeamWiseSalesReps /> : <SalesRepresentatives />}
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
