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
import { rearrangeDataWithCasetypes } from "@/lib/helpers/apiHelpers";
import MonthWiseCaseTypesStats from "./MonthWiseStats";

const BillingOverView = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [billingCardsDetails, setBillingStatsCardsDetails] = useState<any>();
  const [revenueCardsDetails, setRevenueStatsCardsDetails] = useState<any>();
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>();
  const [caseTypesWiseStatsData, setCaseTypeWiseStats] = useState<any>();
  const [totalSumValues, setTotalSumValues] = useState<any>();
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [tabValue, setTabValue] = useState<any>();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  //prepare query params
  const queryPreparations = async (fromDate: any, toDate: any) => {
    let queryParams: any = {};

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
      await getBillingStatsCount(queryParams);
      await getRevenueStatsCount(queryParams);
      await getcaseTyeWiseBillingStats(queryParams);
      // await getcaseTyeWiseRevenueStats(queryParams);
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
    let totalCases = 0;
    let totalAmount = 0;

    data?.forEach((entry: any) => {
      if (type === "billing") {
        totalCases += entry.billed_cases ? +entry.billed_cases : 0;
        totalAmount += entry.billed_amount ? +entry.billed_amount : 0;
      } else if (type === "revenue") {
        totalCases += entry.targeted_amount ? +entry.targeted_amount : 0;
        totalAmount += entry.received_amount ? +entry.received_amount : 0;
      }
    });

    const result = [
      { value: "Total", dolorSymbol: false },
      { value: totalCases, dolorSymbol: false },
      { value: totalAmount, dolorSymbol: true }, // Assuming totalAmount needs a dollar symbol
    ];
    setTotalSumValues(result);
  };

  //api call to get stats count
  useEffect(() => {
    queryPreparations(params?.get("from_date"), params?.get("to_date"));
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
          <BillingStatsCards
            loading={loading}
            billingCardsDetails={billingCardsDetails}
            revenueCardsDetails={revenueCardsDetails}
          />
        </Grid>
        <Grid item xs={8}>
          <BillingOverViewCaseTypes
            caseTypesWiseStatsData={caseTypesWiseStatsData}
            loading={loading}
            totalRevenueSum={totalSumValues}
            tabValue={tabValue}
            setTabValue={setTabValue}
            queryPreparations={queryPreparations}
            dateFilterDefaultValue={dateFilterDefaultValue}
            setDateFilterDefaultValue={setDateFilterDefaultValue}
          />
        </Grid>
        <Grid item xs={12}>
          <MonthWiseCaseTypesStats searchParams={searchParams} />
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </>
  );
};
export default BillingOverView;
