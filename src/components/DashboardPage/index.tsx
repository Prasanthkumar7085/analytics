"use client";
import {
  averageUptoDateTargets,
  getDatesForStatsCards,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { getDashboardCaseTypesVolumeStatsAPI } from "@/services/caseTypesAPIs";
import { getVolumeStatsDetailsAPI } from "@/services/statsAPI";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addMonths,
  endOfMonth,
  startOfMonth,
} from "rsuite/esm/internals/utils/date";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import CaseType from "./CaseType";
import RevenueBlock from "./RevenueAndVolume";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
const DashboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [caseTypeLoading, setCaseTypeLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Volume");
  const [statsSeletedDate, setSeletedStatsDate] = useState<any>([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [dayWiseTargetsEnable, setDayWiseTargetsEnable] = useState<boolean>();
  const [statsQueryParams, setStatsQueryParams] = useState<any>({});
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>({});
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
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

    setStatsQueryParams(queryParams);
    setSeletedStatsDate([queryParams.from_date, queryParams.to_date]);
    try {
      await getVolumeStatsCount(queryParams);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //prepare query params
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
    let queryString = prepareURLEncodedParams("", queryParams);

    router.push(`${pathname}${queryString}`);
    setDashBoardQueryParams(queryParams);
    try {
      if (
        checkDateForCurrentMonth(queryParams) &&
        Object?.keys(queryParams)?.length > 1
      ) {
        await getCaseTypesVolumeStats(queryParams);
      } else {
        await getCaseTypesVolumeStatsWithoutDayWiseTargets(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const checkDateForCurrentMonth = (queryParams: any) => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let thisMonth = [startOfMonth(new Date()), new Date()];
    const currentDate = dayjs();
    const dateToCheck = dayjs(queryParams["from_date"]);
    if (
      dateToCheck.month() === currentDate.month() &&
      dateToCheck.year() === currentDate.year() &&
      Object?.keys(queryParams)?.length > 1
    ) {
      setDayWiseTargetsEnable(true);
      return true;
    } else {
      setDayWiseTargetsEnable(false);
      return false;
    }
  };

  //get the caseTypesVolume with dayWise targets
  const getCaseTypesVolumeStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getDashboardCaseTypesVolumeStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
        let data = response?.data?.map((entry: any) => {
          return {
            ...entry,
            dayTargets: averageUptoDateTargets(
              entry?.total_targets,
              queryParams["to_date"]
            ),
          };
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

  //get the caseTypesVolume without  dayWise targets
  const getCaseTypesVolumeStatsWithoutDayWiseTargets = async (
    queryParams: any
  ) => {
    setCaseTypeLoading(true);
    try {
      const response = await getDashboardCaseTypesVolumeStatsAPI(queryParams);
      if (response.status == 200 || response?.status == 201) {
        let data = [...response?.data];
        let rearrangedData = rearrangeDataWithCasetypes(data);

        setCaseTypesStatsData(rearrangedData);

        let totalCases = 0;
        let totalTargets = 0;

        data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          totalTargets += entry.total_targets ? +entry.total_targets : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: totalTargets, dolorSymbol: false },
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

  const callCaseTypesStatsCounts = () => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let thisMonth = [startOfMonth(new Date()), new Date()];
    let lastmonth = [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ];
    let defaultDates = getDatesForStatsCards(thisMonth);
    queryPreparations(defaultDates[0], defaultDates[1]);
    if (
      dayjs(thisMonth[0]).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")
    ) {
      setDateFilterDefaultValue(lastmonth);
    } else {
      setDateFilterDefaultValue([thisMonth[0], yesterday]);
    }
  };

  //api call to get stats count
  useEffect(() => {
    if (Object.keys(dashBoardQueryParams)?.length !== 0) {
      queryPreparations(params?.get("from_date"), params?.get("to_date"));
    } else {
      callCaseTypesStatsCounts();
    }
  }, [params]);

  useEffect(() => {
    getStatsCounts(params?.get("from_date"), params?.get("to_date"));
  }, [params]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <>
      <Grid container spacing={2} className="mb-5">
        <Grid item xs={4}>
          <Stats
            revenueStatsDetails={revenueStatsDetails}
            volumeStatsDetails={volumeStatsDetails}
            loading={loading}
            onChange={() => {}}
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
            dayWiseTargetsEnable={dayWiseTargetsEnable}
            searchParams={searchParams}
          />
        </Grid>
        <Grid item xs={12}>
          <RevenueBlock searchParams={searchParams} />
        </Grid>
        <Grid item xs={12}>
          <SalesRep searchParams={searchParams} />
        </Grid>
      </Grid>
    </>
  );
};
export default DashboardPage;
