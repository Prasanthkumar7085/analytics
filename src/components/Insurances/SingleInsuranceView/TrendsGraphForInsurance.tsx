import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import TrendsDataGraph from "@/components/Trends/TrendsDataGraph";
import TrendsDataGraphForFacilities from "@/components/Facilities/SingleFacilitieView/Trends/TrendsGraphDataForFacilities";
import { useSelector } from "react-redux";
const TrendsGraphForInsurance = ({ searchParams, pageName }: any) => {
  const [tabValue, setTabValue] = useState<string>("Volume");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );

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

export default TrendsGraphForInsurance;
