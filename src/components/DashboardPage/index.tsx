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

  //get the caseTypes data
  const getCaseTypesStats = async (fromDate: any, toDate: any) => {
    setCaseTypeLoading(true);
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getCaseTypesStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
        let paidRevenueSum = 0;
        let totalRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.paid_amount ? +entry.paid_amount : 0;
          totalRevenueSum += entry.volume ? +entry.volume : 0;
        });

        const result = ["Total", totalRevenueSum, paidRevenueSum];
        setTotalSumValues(result);

        let mappedData = response?.data
          ?.map((item: any) => {
            return {
              ...item,
              case_name: mapCaseTypeTitleWithCaseType(item?.case_type_name),
            };
          })
          ?.filter((e: { volume: string }) => e.volume);
        setCaseTypesStatsData(mappedData);
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
    getCaseTypesStats("", "");
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
            getCaseTypesStats={getCaseTypesStats}
            totalRevenueSum={totalRevenueSum}
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
