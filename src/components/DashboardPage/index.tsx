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
  //get the stats counts
  const getStatsCounts = async () => {
    setLoading(true);
    let urls = ["/overview/stats-revenue", "/overview/stats-volume"];
    try {
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await getStatsDetailsAPI(url);
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
  const getCaseTypesStats = async () => {
    setLoading(true);
    try {
      const response = await getCaseTypesStatsAPI();
      if (response.status == 200 || response?.status == 201) {
        let paidRevenueSum = 0;
        let totalRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.revenue ? +entry.revenue : 0;
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
      setLoading(false);
    }
  };

  //api call to get stats count
  useEffect(() => {
    getStatsCounts();
    getCaseTypesStats();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Stats
            revenueStatsDetails={revenueStatsDetails}
            volumeStatsDetails={volumeStatsDetails}
            loading={loading}
            onChange={() => { }}
          />
        </Grid>
        <Grid item xs={8}>
          <CaseType
            caseTypesStatsData={caseTypesStatsData}
            loading={loading}
            getCaseTypesStats={getCaseTypesStats}
            totalRevenueSum={totalRevenueSum}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <RevenueBlock />
      </Grid>
      <Grid item xs={8}>
        <SalesRep />
      </Grid>
    </>
  );
};
export default DashboardPage;
