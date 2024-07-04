"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import ExportButton from "@/components/core/ExportButton/ExportButton";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { addSerial } from "@/lib/Pipes/addSerial";
import { getDatesForStatsCards } from "@/lib/helpers/apiHelpers";
import { exportToExcelSalesRepTable } from "@/lib/helpers/exportsHelpers";
import { getSalesRepsAPI } from "@/services/salesRepsAPIs";
import { Backdrop, Button } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addMonths,
  endOfMonth,
  startOfMonth,
} from "rsuite/esm/internals/utils/date";

const SalesRep = ({ searchParams }: any) => {
  const [salesReps, setSalesReps] = useState([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [salesRepQueryParams, setSalesRepQueryParams] = useState<any>({});

  //query preparation method
  const queryPreparations = async (fromDate: any, toDate: any) => {
    let queryParams: any = {
      general_sales_reps_exclude_count: false,
    };
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    setSalesRepQueryParams(queryParams);
    try {
      await getAllSalesReps(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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
    const totalFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.total_facilities,
      0
    );
    const activeFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.active_facilities,
      0
    );
    const targetVolume = data.reduce(
      (sum: any, item: any) =>
        sum + +(item.total_targets ? item.total_targets : 0),
      0
    );
    const totalVolume = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalFacilities, dolorSymbol: false },
      { value: activeFacilities, dolorSymbol: false },
      { value: targetVolume, dolorSymbol: false },
      { value: totalVolume, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
    ];
    setTotalSumValues(result);
  };

  const callFunctionDefaultParams = () => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let thisMonth = [startOfMonth(new Date()), new Date()];
    let lastmonth = [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ];
    let defaultDates = getDatesForStatsCards(thisMonth);
    queryPreparations(defaultDates[0], defaultDates[1]);
  };

  useEffect(() => {
    if (Object.keys(salesRepQueryParams)?.length) {
      queryPreparations(searchParams?.from_date, searchParams?.to_date);
    } else {
      callFunctionDefaultParams();
    }
  }, [searchParams]);

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
        <div style={{ display: "flex", flexDirection: "row", gap: "0.9rem" }}>
          {/* <GlobalDateRangeFilter onChangeData={onChangeData} /> */}
          <ExportButton
            onClick={() => {
              exportToExcelSalesRepTable(salesReps, totalRevenueSum);
            }}
            disabled={salesReps?.length === 0 ? true : false}
          />
        </div>
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
