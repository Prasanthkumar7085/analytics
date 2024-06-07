import Image from "next/image";
import { useState } from "react";
import CaseTypesDetailsMonthTable from "./CaseTypeDetailsMonthTable";
import { useSelector } from "react-redux";
const MonthWiseCaseTypeDetails = ({ pageName, searchParams }: any) => {
  const [value, setValue] = useState("Volume");
  const [selectedDate, setSelectedDate] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );

  return (
    <div className="eachDataCard s-no-column" id="mothWiseCaseTypeData">
      <div className="cardHeader" style={{ marginRight: "150px" }}>
        <h3>
          <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
          Month Wise Case Type Data
        </h3>
      </div>
      <div className="cardBody">
        <CaseTypesDetailsMonthTable
          tabValue={value}
          pageName={pageName}
          searchParams={searchParams}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};
export default MonthWiseCaseTypeDetails;
