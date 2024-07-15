import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import BillingStatsCards from "./BillingStatsCard";
import BillingOverViewCaseTypes from "./BillingCaseTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getBillingStatsCardDataAPI,
  getcaseTyeWiseBillingStatsAPI,
  getcaseTyeWiseRevenueStatsAPI,
  getRevenueStatsCardDataAPI,
} from "@/services/BillingAnalytics/overViewAPIs";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getDatesForStatsCards,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import MonthWiseCaseTypesStats from "./MonthWiseStats";
import MonthWiseTrendsGraph from "./MonthWiseTrends";
import {
  addMonths,
  endOfMonth,
  set,
  startOfMonth,
} from "rsuite/esm/internals/utils/date";
import dayjs from "dayjs";

const BillingOverView = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [billingCardsDetails, setBillingStatsCardsDetails] = useState<any>();
  const [revenueCardsDetails, setRevenueStatsCardsDetails] = useState<any>();
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>({});
  const [caseTypesWiseStatsData, setCaseTypeWiseStats] = useState<any>();
  const [totalSumValues, setTotalSumValues] = useState<any>();
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [selectedTabValue, setSelectedTabValue] = useState<any>("billed");
  const [tabValue, setTabValue] = useState<any>();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  //prepare query params
  const queryPreparations = async (
    fromDate: any,
    toDate: any,
    tabValue: any
  ) => {
    let queryParams: any = { tab: "billed" };

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (tabValue) {
      queryParams["tab"] = tabValue;
    }
    let queryString = prepareURLEncodedParams("", queryParams);

    router.push(`${pathname}${queryString}`);
    setDashBoardQueryParams(queryParams);
    try {
      await getBillingStatsCount(queryParams);
      await getRevenueStatsCount(queryParams);
      if (tabValue == "billed") {
        await getcaseTyeWiseBillingStats(queryParams);
      } else {
        await getcaseTyeWiseRevenueStats(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBillingStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getBillingStatsCardDataAPI(queryParams);
      setBillingStatsCardsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getRevenueStatsCardDataAPI(queryParams);
      setRevenueStatsCardsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getcaseTyeWiseBillingStats = async (queryParams: any) => {
    try {
      const response = await getcaseTyeWiseBillingStatsAPI(queryParams);
      let data = [...response?.data];
      let rearrangedData = rearrangeDataWithCasetypes(data);
      setCaseTypeWiseStats(rearrangedData);
      getTotalSumOfColumns(rearrangedData, "billing");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getcaseTyeWiseRevenueStats = async (queryParams: any) => {
    try {
      const response = await getcaseTyeWiseRevenueStatsAPI(queryParams);
      let data = [...response?.data];
      let rearrangedData = rearrangeDataWithCasetypes(data);
      setCaseTypeWiseStats(rearrangedData);
      getTotalSumOfColumns(rearrangedData, "revenue");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSumOfColumns = (data: any, type: "billing" | "revenue") => {
    let firstColumn = 0;
    let secondColumn = 0;

    data?.forEach((entry: any) => {
      if (type === "billing") {
        firstColumn += entry.billed_cases ? +entry.billed_cases : 0;
        secondColumn += entry.billed_amount ? +entry.billed_amount : 0;
      } else if (type === "revenue") {
        firstColumn += entry.targeted_amount ? +entry.targeted_amount : 0;
        secondColumn += entry.received_amount ? +entry.received_amount : 0;
      }
    });

    const result = [
      { value: "Total", dolorSymbol: false },
      { value: firstColumn, dolorSymbol: type === "billing" ? false : true },
      { value: secondColumn, dolorSymbol: true },
    ];
    setTotalSumValues(result);
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
    queryPreparations(defaultDates[0], defaultDates[1], params?.get("tab"));
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
    if (Object?.keys(dashBoardQueryParams)?.length !== 0) {
      queryPreparations(
        params?.get("from_date"),
        params?.get("to_date"),
        params?.get("tab")
      );
    } else {
      callCaseTypesStatsCounts();
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);
  return (
    <>
      <Grid container spacing={2} className="mb-5">
        <Grid item xs={4}>
          <BillingStatsCards
            loading={loading}
            billingCardsDetails={billingCardsDetails}
            revenueCardsDetails={revenueCardsDetails}
            searchParams={searchParams}
          />
        </Grid>
        <Grid item xs={8}>
          <BillingOverViewCaseTypes
            caseTypesWiseStatsData={caseTypesWiseStatsData}
            loading={loading}
            totalRevenueSum={totalSumValues}
            queryPreparations={queryPreparations}
            dateFilterDefaultValue={dateFilterDefaultValue}
            setDateFilterDefaultValue={setDateFilterDefaultValue}
            selectedTabValue={selectedTabValue}
            setSelectedTabValue={setSelectedTabValue}
          />
        </Grid>
        <Grid item xs={12}>
          <MonthWiseCaseTypesStats
            searchParams={searchParams}
            pathName={"overview"}
          />
        </Grid>
        <Grid item xs={12}>
          <MonthWiseTrendsGraph
            searchParams={searchParams}
            pathName={"overview"}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default BillingOverView;
