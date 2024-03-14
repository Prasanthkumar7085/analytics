import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import styles from "./salesCaseTypes.module.css";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
const SingleSalesRepCaseTypeDetails = ({ apiUrl }: any) => {
  const [value, setValue] = useState("Volume");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="eachDataCard" id="caseTypesData">
      <div className="cardHeader">
        <h3>
          <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
          Case Type
        </h3>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="Revenue" label="Revenue" />
          <Tab value="Volume" label="Volume" />
        </Tabs>
        <GlobalDateRangeFilter onChangeData={() => {}} />
      </div>
      <div className="cardBody">
        <RevenuVolumeCaseTypesDetails tabValue={value} apiUrl={apiUrl} />
      </div>
    </div>
  );
};
export default SingleSalesRepCaseTypeDetails;
