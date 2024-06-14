"use client"
import TeamWiseSalesReps from "@/components/SalesRepresentatives/TeamWiseSalesReps";
import { Suspense } from "react";

const SalesRepresentativesPage = () => {
  return (
    <Suspense>
      <section id="salesRepresentativesPage">
        {/* <SalesRepresentatives /> */}
        <TeamWiseSalesReps />
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
