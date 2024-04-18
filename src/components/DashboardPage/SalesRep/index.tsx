"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { addSerial } from "@/lib/Pipes/addSerial";
import { getSalesRepsAPI } from "@/services/salesRepsAPIs";
import { Backdrop } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SalesRep = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  //query preparation method
  const queryPreparations = async ({ fromDate = "", toDate = "" }: any) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    try {
      await getAllSalesReps(queryParams)
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  const getAllSalesReps = async (queryParams: any) => {
    try {
      setLoading(true);
      const response = await getSalesRepsAPI(queryParams);

      if (response.status == 200 || response.status == 201) {
        let data = response?.data;

        const modifieData = addSerial(data, 1, data?.length);
        setSalesReps(modifieData);
        setFooterValuData(data);
      } else {
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const setFooterValuData = (data: any[]) => {
    const billedAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.generated_amount,
      0
    );
    const paidRevenueSum = data.reduce(
      (sum: any, item: any) => sum + +item.paid_amount,
      0
    );
    const pendingAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.pending_amount,
      0
    );
    const totalFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.total_facilities,
      0
    );
    const targetFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.target_facilities,
      0
    );
    const activeFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.active_facilities,
      0
    );
    const targetVolume = data.reduce(
      (sum: any, item: any) => sum + +item.target_volume,
      0
    );
    const totalVolume = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalFacilities, dolorSymbol: false },
      { value: targetFacilities, dolorSymbol: false },
      { value: activeFacilities, dolorSymbol: false },
      { value: totalVolume, dolorSymbol: false },
      { value: targetVolume, dolorSymbol: false },
      { value: billedAmoumnt, dolorSymbol: true },
      { value: paidRevenueSum, dolorSymbol: true },
      { value: pendingAmoumnt, dolorSymbol: true },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    queryPreparations({});
  }, []);

  const onChangeData = (fromDate: any, toDate: any) => {
    queryPreparations({ fromDate, toDate });
    setFromDate(fromDate);
    setToDate(toDate);
  };
  return (
    <div
      className="eachDataCard mb-10 s-no-column"
      id="SalesRepresentativeTableData"
      style={{ position: "relative" }}
    >
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
          loading={loading}
          fromDate={fromDate}
          toDate={toDate}
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
