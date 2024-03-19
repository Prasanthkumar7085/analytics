"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import Image from "next/image";
import styles from "./index.module.css";
import { salesRepsAPI } from "@/services/salesRepsAPIs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { Backdrop, CircularProgress } from "@mui/material";
import { addSerial } from "@/lib/Pipes/addSerial";

const SalesRep = () => {
  const router = useRouter();

  const [salesReps, setSalesReps] = useState([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getAllSalesReps = async ({ fromDate = "", toDate = "" }: any) => {
    try {
      setLoading(true);
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await salesRepsAPI(queryParams);

      if (response.status == 200 || response.status == 201) {
        let data = response?.data;
        const modifieData = addSerial(data, 1, data?.length);
        setSalesReps(modifieData);
        const totalCases = response?.data.reduce(
          (sum: any, item: any) => sum + +item.total_cases,
          0
        );
        const targeted_amount = response?.data.reduce(
          (sum: any, item: any) => sum + +item.expected_amount,
          0
        );

        const billedAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.generated_amount,
          0
        );
        const paidRevenueSum = response?.data.reduce(
          (sum: any, item: any) => sum + +item.paid_amount,
          0
        );
        const pendingAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.pending_amount,
          0
        );

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: targeted_amount, dolorSymbol: true },
          { value: billedAmoumnt, dolorSymbol: true },
          { value: paidRevenueSum, dolorSymbol: true },
          { value: pendingAmoumnt, dolorSymbol: true },

        ];

        setTotalSumValues(result);
      } else {
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSalesReps({});
  }, []);

  const onChangeData = (fromDate: any, toDate: any) => {
    getAllSalesReps({ fromDate, toDate });
  };
  return (
    <div className="eachDataCard mb-10" id="SalesRepresentativeTableData" style={{ position: "relative" }}>
      <div className="cardHeader">
        <h3>
          <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
          Sales Representatives
        </h3>
        <GlobalDateRangeFilter onChangeData={onChangeData} />
      </div>
      <div className="cardBody">
        <SalesRepsTable
          salesReps={salesReps}
          totalRevenueSum={totalRevenueSum}
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
  );
};

export default SalesRep;
