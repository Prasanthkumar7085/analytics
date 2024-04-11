import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import TrendsDataGraph from "@/components/Trends/TrendsDataGraph";
const TrendsGraphForInsurance = ({ searchParams, pageName }: any) => {
    const [tabValue, setTabValue] = useState<string>("Volume");

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
                        <Tab value={"Volume"} label={"Volume"} />
                        <Tab value={"Revenue"} label={"Revenue"} />
                    </Tabs>

                </div>
                <div className="cardBody">
                    {tabValue == "Volume" ? (
                        <TrendsDataGraph graphType={"volume"} searchParams={searchParams} pageName={pageName} />
                    ) : (
                        <TrendsDataGraph graphType={"revenue"} searchParams={searchParams} pageName={pageName} />
                    )}
                </div>
            </div>
            <div style={{ width: "100%" }}></div>
        </>
    );
};

export default TrendsGraphForInsurance;
