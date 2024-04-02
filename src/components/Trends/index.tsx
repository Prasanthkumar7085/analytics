import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TrendsDataGraph from "./TrendsDataGraph";
import Image from "next/image";
const Trends = ({ searchParams, apiurl }: any) => {
  const [tabValue, setTabValue] = useState<string>("volume");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div className="eachDataCard" id="TrendsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Trends
          </h3>
          <Tabs onChange={handleChange} value={tabValue}>
            <Tab value={"volume"} label={"Volume"} />
            <Tab value={"revenue"} label={"Revenue"} />
          </Tabs>
        </div>
        <div className="cardBody">
          {tabValue == "volume" ? (
            <TrendsDataGraph graphType={"volume"} searchParams={searchParams} apiurl={apiurl} />
          ) : (
            <TrendsDataGraph graphType={"revenue"} searchParams={searchParams} apiurl={apiurl} />
          )}
        </div>
      </div>
      <div style={{ width: "100%" }}></div>
    </>
  );
};

export default Trends;
