import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { getRevenueAPI } from "@/services/revenueAPIs";
import { Backdrop, Tab, Tabs } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RevenueDataGraph from "./RevenueDataGraph";
import { getVolumeAPI } from "@/services/volumeAPI";
import VolumeDataGraph from "./VolumeDataGraph";
import { useSelector } from "react-redux";

const RevenueBlock = () => {
  const [labelsData, setLablesData] = useState<any>([]);
  const [billedData, setBilledData] = useState<any>([]);
  const [totalRevenueData, setTotalRevenueData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Volume");
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const [totalCasesData, setTotalCasesData] = useState<any>([]);
  const [completedCases, setCompletedCases] = useState<any>([]);
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );
  const updateTheResponseForGraph = (data: any) => {
    if (!data) {
      return;
    }
    const months = data.map((item: any) => item.month);
    const generatedAmounts = data.map((item: any) => +item.generated_amount);
    const paidAmounts = data.map((item: any) => +item.paid_amount);
    setLablesData(months);
    setBilledData(generatedAmounts);
    setTotalRevenueData(paidAmounts);
  };
  const updateTheResponseForVolumeGraph = (data: any) => {
    if (!data) {
      return;
    }
    const months = data.map((item: any) => item.month);
    const TotalCases = data.map((item: any) => +item.total_cases);
    const CompletedCases = data.map((item: any) => +item.total_targets);
    setLablesData(months);
    setTotalCasesData(TotalCases);
    setCompletedCases(CompletedCases);
  };

  //prepare query params
  const queryPreparations = async (
    fromDate: any,
    toDate: any,
    tabValue: string
  ) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    try {
      if (tabValue == "Revenue") {
        await getRevenue(queryParams);
      } else {
        await getVolume(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //tabs onchange event
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    queryPreparations(selectedDates[0], selectedDates[1], newValue);
  };

  //get revenue data graph
  const getRevenue = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getRevenueAPI(queryParams);

      if (response?.status == 200 || response?.status == 201) {
        updateTheResponseForGraph(response?.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //get volume data graph
  const getVolume = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getVolumeAPI(queryParams);

      if (response?.status == 200 || response?.status == 201) {
        updateTheResponseForVolumeGraph(response?.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryPreparations("", "", tabValue);
  }, []);

  const onChangeData = (fromDate: any, toDate: any) => {
    queryPreparations(fromDate, toDate, tabValue);
    setSelectedDates([fromDate, toDate]);
  };

  return (
    <>
      <div
        className="eachDataCard"
        id="RevenueTableData"
        style={{ position: "relative" }}
      >
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            {tabValue}
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.9rem",
            }}
          >
            <GlobalDateRangeFilter onChangeData={onChangeData} />
          </div>
        </div>
        <div className="cardBody">
          {tabValue == "Volume" ? (
            <VolumeDataGraph
              labelsData={labelsData}
              totalCasesData={totalCasesData}
              completedCases={completedCases}
              loading={loading}
            />
          ) : (
            <RevenueDataGraph
              labelsData={labelsData}
              billedData={billedData}
              totalRevenueData={totalRevenueData}
              loading={loading}
            />
          )}

          {loading ? (
            <Backdrop
              open={true}
              style={{
                zIndex: 999,
                color: "red",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(256,256,256,0.8)",
              }}
            >
              <object
                type="image/svg+xml"
                data={"/core/loading.svg"}
                width={150}
                height={150}
              />
            </Backdrop>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default RevenueBlock;
