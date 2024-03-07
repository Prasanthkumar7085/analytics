import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TrendsDataGraph from "./TrendsDataGraph";

const Trends = () => {
  const [tabValue, setTabValue] = useState<string>("revenue");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ width: "100%" }}>
      <Tabs onChange={handleChange} value={tabValue}>
        <Tab value={"revenue"} label={"Revenue"} />
        <Tab value={"volume"} label={"Volume"} />
      </Tabs>
      {tabValue == "volume" ? (
        <TrendsDataGraph graphType={"volume"} />
      ) : (
        <TrendsDataGraph graphType={"revenue"} />
      )}
    </div>
  );
};

export default Trends;
