import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import styles from "./salesCaseTypes.module.css";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
const SingleSalesRepCaseTypeDetails = ({ pageName, searchParams }: any) => {
  const [value, setValue] = useState("Volume");
  const [selectedDate, setSelectedDate] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setSelectedDate([fromDate, toDate]);
    } else {
      setSelectedDate([]);
    }
  };

  return (
    <div className="eachDataCard s-no-column" id="mothWiseCaseTypeData">
      <div className="cardHeader">
        <h3>
          <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
          Month Wise Case Type Data
        </h3>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="Volume" label="Volume" />
          <Tab value="Revenue" label="Revenue" />
        </Tabs>
        {/* <GlobalDateRangeFilter onChangeData={onChangeData} /> */}
      </div>
      <div className="cardBody">
        <RevenuVolumeCaseTypesDetails
          tabValue={value}
          pageName={pageName}
          searchParams={searchParams}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};
export default SingleSalesRepCaseTypeDetails;
