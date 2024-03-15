import Image from "next/image";
import RevenueDataGraph from "./RevenueDataGraph";
import styles from "./index.module.css";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { getRevenueAPI } from "@/services/getRevenueAPIs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Backdrop, CircularProgress } from "@mui/material";

const RevenueBlock = () => {

  const [totalGraphData, setTotalGraphData] = useState<any>([]);
  const [labelsData, setLablesData] = useState<any>([])
  const [billedData, setBilledData] = useState<any>([])
  const [totalRevenueData, setTotalRevenueData] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const updateTheResponseForGraph = (data: any) => {
    if (!data) {
      return;
    }

    let totalRevenue: any = [];
    const months = data.map((item: any) => item.month);
    const generatedAmounts = data.map((item: any) => +item.generated_amount);
    const paidAmounts = data.map((item: any) => +item.paid_amount);
    setLablesData(months);
    setBilledData(generatedAmounts);
    setTotalRevenueData(paidAmounts);
  };

  const getRevenue = async (fromDate: any, toDate: any) => {
    setLoading(true)
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
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getRevenue("", "");
  }, []);

  const onChangeData = (fromDate: any, toDate: any) => {
    getRevenue(fromDate, toDate);
  };

  return (
    <div className={styles.casetype} style={{ position: "relative" }}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
            <Image
              className={styles.icon}
              alt=""
              src="/navbar/icon.svg"
              height={20}
              width={20}
            />
          </div>
          <div className={styles.heading}>Revenue</div>
        </div>
        <GlobalDateRangeFilter onChangeData={onChangeData} />
      </div>
      <div style={{ width: "98%" }}>
        <RevenueDataGraph labelsData={labelsData}
          billedData={billedData}
          totalRevenueData={totalRevenueData} />
      </div>

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
  );
};

export default RevenueBlock;
