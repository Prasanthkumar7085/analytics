"use client"
import SalesRepresentatives from "@/components/SalesRepresentatives";
import TeamWiseSalesReps from "@/components/SalesRepresentatives/TeamWiseSalesReps";
import { Suspense } from "react";
import { useSelector } from "react-redux";

const SalesRepresentativesPage = () => {
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );
  return (
    <Suspense>
      <section id="salesRepresentativesPage">
        {userType == "LAB_ADMIN" ?
          <TeamWiseSalesReps /> : <SalesRepresentatives />
        }
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
