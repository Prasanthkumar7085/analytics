"use client";
import {
  getDashboardCaseTypesRevenueStatsAPI,
  getDashboardCaseTypesVolumeStatsAPI,
} from "@/services/caseTypesAPIs";
import {
  getRevenueStatsDetailsAPI,
  getVolumeStatsDetailsAPI,
} from "@/services/statsAPI";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import CaseType from "./CaseType";
import RevenueBlock from "./RevenueAndVolume";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [caseTypeLoading, setCaseTypeLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Volume");


  //get revenue stats count
  const getRevenueStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getRevenueStatsDetailsAPI(queryParams);
      setRevenueStatsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  //get volume stats count
  const getVolumeStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getVolumeStatsDetailsAPI(queryParams);
      setVolumeStatsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  //get the stats counts
  const getStatsCounts = async (fromDate: any, toDate: any) => {
    let queryParams: any = {};

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }

    try {
      await getRevenueStatsCount(queryParams)
      await getVolumeStatsCount(queryParams)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  //prepare query params
  const queryPreparations = async (fromDate: any, toDate: any, tabValue: string) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    try {
      if (tabValue == "Revenue") {
        await getCaseTypesRevenueStats(queryParams)
      }
      else {
        await getCaseTypesVolumeStats(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  //get the caseTypesVolume data
  const getCaseTypesVolumeStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getDashboardCaseTypesVolumeStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
         let totalCases = 0;
         let totalTargets = 0;

         response?.data?.forEach((entry: any) => {
           totalCases += entry.total_cases ? +entry.total_cases : 0;
           totalTargets += entry.total_targets ? +entry.total_targets : 0;
         });

         const result = [
           { value: "Total", dolorSymbol: false },
           { value: totalCases, dolorSymbol: false },
           { value: totalTargets, dolorSymbol: false },
         ];
        setTotalSumValues(result);
        setCaseTypesStatsData(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCaseTypeLoading(false);
    }
  };

  const getCaseTypesRevenueStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getDashboardCaseTypesRevenueStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
        let paidRevenueSum = 0;
        let totalRevenueSum = 0;
        let pendingRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.paid_amount ? +entry.paid_amount : 0;
          totalRevenueSum += entry.generated_amount
            ? +entry.generated_amount
            : 0;
          pendingRevenueSum += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: totalRevenueSum, dolorSymbol: true },
          { value: paidRevenueSum, dolorSymbol: true },
          { value: pendingRevenueSum, dolorSymbol: true },
        ];
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
    getStatsCounts("", "");
    queryPreparations("", "", "Volume");
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
            queryPreparations={queryPreparations}
            totalRevenueSum={totalRevenueSum}
            setTabValue={setTabValue}
            tabValue={tabValue}
          />
        </Grid>
        <Grid item xs={12}>
          <RevenueBlock />
        </Grid>
        <Grid item xs={12}>
          <SalesRep />
        </Grid>
      </Grid>
    </>
  );
};
export default DashboardPage;
