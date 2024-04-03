import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { getRevenueAPI } from "@/services/revenueAPIs";
import { Backdrop } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RevenueDataGraph from "./RevenueDataGraph";

const RevenueBlock = () => {
  const [labelsData, setLablesData] = useState<any>([]);
  const [billedData, setBilledData] = useState<any>([]);
  const [totalRevenueData, setTotalRevenueData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
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

  const getRevenue = async (fromDate: any, toDate: any) => {
    setLoading(true);
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

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

  useEffect(() => {
    getRevenue("", "");
  }, []);

  const onChangeData = (fromDate: any, toDate: any) => {
    getRevenue(fromDate, toDate);
  };

  return (
    <>
      <div className="eachDataCard" id="RevenueTableData" style={{ position: "relative" }}>
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Revenue
          </h3>
          <GlobalDateRangeFilter onChangeData={onChangeData} />
        </div>
        <div className="cardBody">
          <RevenueDataGraph
            labelsData={labelsData}
            billedData={billedData}
            totalRevenueData={totalRevenueData}
            loading={loading}
          />

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
