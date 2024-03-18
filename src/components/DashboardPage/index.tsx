"use client";
import { useEffect, useState } from "react";
import CaseType from "./CaseType";
import RevenueBlock from "./Revenue";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
import styles from "./index.module.css";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";
import { mapCaseTypeTitleWithCaseType } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import Grid from "@mui/material/Grid";
const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [caseTypeLoading, setCaseTypeLoading] = useState(true)
  const [tabValue, setTabValue] = useState("Revenue");

  //get the stats counts
  const getStatsCounts = async (fromDate: any, toDate: any) => {
    setLoading(true);
    let urls = ["/overview/stats-revenue", "/overview/stats-volume"];


    let queryParams: any = {};

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }

    try {
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await getStatsDetailsAPI(url, queryParams);
          return response;
        })
      );
      responses.forEach((result, num) => {
        if (result.status === "fulfilled") {
          tempResult.push(result.value);
        }
        if (result.status === "rejected") {
        }
      });
      setRevenueStatsDetails(tempResult[0]?.data);
      setVolumeStatsDetails(tempResult[1]?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  //get the caseTypesVolume data
  const getCaseTypesVolumeStats = async (fromDate: any, toDate: any) => {
    setCaseTypeLoading(true);
    let url = "/overview/case-types-volume"
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getCaseTypesStatsAPI(url, queryParams);
      if (response.status == 200 || response?.status == 201) {
        let totalCases = 0;
        let completedCases = 0;
        let pendingCases = 0;

        response?.data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          completedCases += entry.completed_cases ? +entry.completed_cases : 0;
          pendingCases += entry.pending_cases ? +entry.pending_cases : 0
        });

        const result = [{ value: "Total", dolorSymbol: false }, { value: totalCases, dolorSymbol: false }, { value: completedCases, dolorSymbol: false }, { value: pendingCases, dolorSymbol: false }];
        setTotalSumValues(result);
        setCaseTypesStatsData(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCaseTypeLoading(false);
    }
  };

  const getCaseTypesRevenueStats = async (fromDate: any, toDate: any) => {
    setCaseTypeLoading(true);
    let url = "/overview/case-types-revenue";
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }
      const response = await getCaseTypesStatsAPI(url, queryParams);
      if (response.status == 200 || response?.status == 201) {
        let paidRevenueSum = 0;
        let totalRevenueSum = 0;
        let pendingRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.paid_amount ? +entry.paid_amount : 0;
          totalRevenueSum += entry.generated_amount ? +entry.generated_amount : 0;
          pendingRevenueSum += entry.pending_amount ? +entry.pending_amount : 0
        });

        const result = [{ value: "Total", dolorSymbol: false }, { value: totalRevenueSum, dolorSymbol: true }, { value: paidRevenueSum, dolorSymbol: true }, { value: pendingRevenueSum, dolorSymbol: true }];
        setTotalSumValues(result);
        setCaseTypesStatsData(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCaseTypeLoading(false);
    }
  };



  //api call to get stats count
  useEffect(() => {
    getStatsCounts("", "")
    getCaseTypesRevenueStats("", "");
  }, []);

  return (
    <>
      <Grid container spacing={2} className="mb-5">
        <Grid item xs={4}>
          <Stats
            revenueStatsDetails={revenueStatsDetails}
            volumeStatsDetails={volumeStatsDetails}
            loading={loading}
            onChange={() => { }}
            getStatsCounts={getStatsCounts}
          />
        </Grid>
        <Grid item xs={8}>
          <CaseType
            caseTypesStatsData={caseTypesStatsData}
            loading={caseTypeLoading}
            getCaseTypesRevenueStats={getCaseTypesRevenueStats}
            getCaseTypesVolumeStats={getCaseTypesVolumeStats}
            totalRevenueSum={totalRevenueSum}
            setTabValue={setTabValue}
            tabValue={tabValue}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className="mb-5">
        <RevenueBlock />
      </Grid>
      <Grid item xs={8}>
        <SalesRep />
      </Grid>
    </>
  );
};
export default DashboardPage;
