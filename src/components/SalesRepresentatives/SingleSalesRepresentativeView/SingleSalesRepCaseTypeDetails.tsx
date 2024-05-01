import RevenuCaseTypesDetails from "@/components/CaseTypes/RevenueCaseTypeDetails";
import VolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import Image from "next/image";
import { useState } from "react";
const SingleSalesRepCaseTypeDetails = ({
  pageName,
  searchParams,
  tabValue,
  setCaseTypeValue
}: any) => {
  const [value, setValue] = useState(tabValue);
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
            setCaseTypeValue={setCaseTypeValue}
          />
        )}
      </div>
    </div>
  );
};
export default SingleSalesRepCaseTypeDetails;
