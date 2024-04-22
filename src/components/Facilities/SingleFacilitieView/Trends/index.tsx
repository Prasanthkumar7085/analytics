import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import TrendsDataGraphForFacilities from "./TrendsGraphDataForFacilities";
const TrendsForFacilities = ({ searchParams, pageName, tabValue }: any) => {
  return (
    <>
      <div className="eachDataCard" id="TrendsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Trends
          </h3>
        </div>
        <div className="cardBody">
          {tabValue == "Volume" ? (
            <TrendsDataGraphForFacilities
              graphType={"volume"}
              searchParams={searchParams}
              pageName={pageName}
            />
          ) : (
            <TrendsDataGraphForFacilities
              graphType={"revenue"}
              searchParams={searchParams}
              pageName={pageName}
            />
          )}
        </div>
      </div>
      <div style={{ width: "100%" }}></div>
    </>
  );
};

export default TrendsForFacilities;
