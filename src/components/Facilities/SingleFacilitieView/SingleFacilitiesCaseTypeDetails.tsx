import RevenuCaseTypesDetails from "@/components/CaseTypes/RevenueCaseTypeDetails";
import VolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import { Tab, Tabs } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
const SingleFacilitieCaseTypeDetails = ({
  pageName,
  searchParams,
  tabValue,
}: any) => {
  const [value, setValue] = useState(tabValue);
  const [selectedDate, setSelectedDate] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="eachDataCard s-no-column" id="mothWiseCaseTypeData">
      <div className="cardHeader">
        <h3>
          <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
          Month Wise Case Type Data
        </h3>
        {/* <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="Volume" label="Volume" />
          <Tab value="Revenue" label="Revenue" />
        </Tabs> */}
        {/* <GlobalDateRangeFilter onChangeData={onChangeData} /> */}
      </div>
      <div className="cardBody">
        {tabValue == "Revenue" ? (
          <RevenuCaseTypesDetails
            tabValue={tabValue}
            pageName={pageName}
            searchParams={searchParams}
            selectedDate={selectedDate}
          />
        ) : (
          <VolumeCaseTypesDetails
            tabValue={tabValue}
            pageName={pageName}
            searchParams={searchParams}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
};
export default SingleFacilitieCaseTypeDetails;
