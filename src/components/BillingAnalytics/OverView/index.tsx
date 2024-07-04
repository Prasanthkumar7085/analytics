import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import BillingStatsCards from "./BillingStatsCard";
import BillingOverViewCaseTypes from "./BillingCaseTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getBillingStatsCardDataAPI,
  getRevenueStatsCardDataAPI,
} from "@/services/BillingAnalytics/overViewAPIs";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";

const BillingOverView = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [billingCardsDetails, setBillingStatsCardsDetails] = useState<any>();
  const [revenueCardsDetails, setRevenueStatsCardsDetails] = useState<any>();
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>();
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
          <BillingOverViewCaseTypes />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </>
  );
};
export default BillingOverView;
