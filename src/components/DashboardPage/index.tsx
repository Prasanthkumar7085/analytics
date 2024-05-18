"use client";
import { averageUptoDateTargets, getDatesForStatsCards, getThisMonthDates, rearrangeDataWithCasetypes } from "@/lib/helpers/apiHelpers";
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
import { startOfMonth } from "rsuite/esm/utils/dateUtils";
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
  const [statsSeletedDate, setSeletedStatsDate] = useState<any>([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();

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
  };

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
  };

  //get the stats counts
  const getStatsCounts = async (fromDate: any, toDate: any) => {
    let thisMonth = [startOfMonth(new Date()), new Date()];
    let defaultDates = getDatesForStatsCards(thisMonth);

    let queryParams: any = {
      from_date: defaultDates?.[0],
      to_date: defaultDates?.[1],
    };

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    setSeletedStatsDate([queryParams.from_date, queryParams.to_date]);
    try {
      await getRevenueStatsCount(queryParams);
      await getVolumeStatsCount(queryParams);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
        await getCaseTypesRevenueStats(queryParams);
      } else {
        await getCaseTypesVolumeStats(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the caseTypesVolume data
  const getCaseTypesVolumeStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getDashboardCaseTypesVolumeStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
        let data = response?.data?.map((entry: any) => {
          return { ...entry, dayTargets: averageUptoDateTargets(entry?.total_targets) };
        });

        let rearrangedData = rearrangeDataWithCasetypes(data);
        setCaseTypesStatsData(rearrangedData);

        let totalCases = 0;
        let totalTargets = 0;
        let dayTargets = 0;

        data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          dayTargets += entry.dayTargets ? +entry.dayTargets : 0;
          totalTargets += entry.total_targets ? +entry.total_targets : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: totalTargets, dolorSymbol: false },
          { value: Math.ceil(dayTargets), dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },

        ];
        setTotalSumValues(result);
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
        let rearrangedData = rearrangeDataWithCasetypes(response?.data);
        setCaseTypesStatsData(rearrangedData);
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
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let thisMonth = [startOfMonth(new Date()), new Date()];
    let defaultDates = getDatesForStatsCards(thisMonth);
    setDateFilterDefaultValue([thisMonth[0], yesterday]);
    queryPreparations(defaultDates[0], defaultDates[1], "Volume");

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
            statsSeletedDate={statsSeletedDate}
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
            dateFilterDefaultValue={dateFilterDefaultValue}
            setDateFilterDefaultValue={setDateFilterDefaultValue}
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
