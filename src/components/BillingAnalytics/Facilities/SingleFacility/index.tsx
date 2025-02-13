import {
  changeDateToUTC,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { ArrowBack } from "@mui/icons-material";
import {
  getFacilityBillingStatsCardDataAPI,
  getFacilitycaseTyeWiseBillingStatsAPI,
  getFacilitycaseTyeWiseRevenueStatsAPI,
  getFacilityRevenueStatsCardDataAPI,
} from "@/services/BillingAnalytics/facilitiesAPIs";
import { Avatar, Grid, Typography } from "@mui/material";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import BillingOverViewCaseTypes from "../../OverView/BillingCaseTypes";
import BillingStatsCards from "../../OverView/BillingStatsCard";
import MonthWiseCaseTypesStats from "../../OverView/MonthWiseStats";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import BilledAndRevenueTabs from "@/components/core/BilledAndRevenueTabs";
import { getSingleFacilityDetailsAPI } from "@/services/facilitiesAPIs";
import InsuranceWiseDetails from "./InsuranceWiseDetails";

const SingleFacilityBillingAndRevenueDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { id } = useParams();
  const [billingCardsDetails, setBillingStatsCardsDetails] = useState<any>();
  const [revenueCardsDetails, setRevenueStatsCardsDetails] = useState<any>();
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>();
  const [caseTypesWiseStatsData, setCaseTypeWiseStats] = useState<any>();
  const [totalSumValues, setTotalSumValues] = useState<any>();
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [selectedTabValue, setSelectedTabValue] = useState<any>("billed");
  const [tabValue, setTabValue] = useState<any>();
  const [singleFacilityDetails, setSingleFacilityDetails] = useState<any>();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [caseTypeLoading, setCaseTypeLoading] = useState<boolean>(false);

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

    router.replace(`${pathname}${queryString}`);
    setDashBoardQueryParams(queryParams);
    try {
      if (queryParams?.tab == "billed") {
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

  //get single facility details
  const getSingleFacilityDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleFacilityDetailsAPI(id as string);
      if (response.status == 200 || response?.status == 201) {
        setSingleFacilityDetails(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBillingStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getFacilityBillingStatsCardDataAPI(
        queryParams,
        id
      );
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
      const response = await getFacilityRevenueStatsCardDataAPI(
        queryParams,
        id
      );
      setRevenueStatsCardsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getcaseTyeWiseBillingStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getFacilitycaseTyeWiseBillingStatsAPI(
        queryParams,
        id
      );
      let data = [...response?.data];
      let rearrangedData = rearrangeDataWithCasetypes(data);
      setCaseTypeWiseStats(rearrangedData);
      getTotalSumOfColumns(rearrangedData, "billing");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setCaseTypeLoading(false);
    }
  };

  const getcaseTyeWiseRevenueStats = async (queryParams: any) => {
    setCaseTypeLoading(true);

    try {
      const response = await getFacilitycaseTyeWiseRevenueStatsAPI(
        queryParams,
        id
      );
      let data = [...response?.data];
      let rearrangedData = rearrangeDataWithCasetypes(data);
      setCaseTypeWiseStats(rearrangedData);
      getTotalSumOfColumns(rearrangedData, "revenue");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setCaseTypeLoading(false);
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

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations(fromDate, toDate, searchParams?.tab);
    } else {
      setDateFilterDefaultValue("");
      router.replace(`/billing/facilities/${id}`);
      queryPreparations(fromDate, toDate, searchParams?.tab);
    }
  };

  //api call to get stats count
  useEffect(() => {
    queryPreparations(
      searchParams?.from_date,
      searchParams?.to_date,
      searchParams?.tab
    );
  }, [searchParams?.tab]);

  useEffect(() => {
    if (Object.keys(searchParams)?.length !== 0) {
      if (searchParams?.tab == "billed") {
        getBillingStatsCount(searchParams);
      } else {
        getRevenueStatsCount(searchParams);
      }
    }
  }, [searchParams?.from_date || searchParams?.to_date]);

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getSingleFacilityDetails();
    }
    if (searchParams?.from_date) {
      setDateFilterDefaultValue(
        changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
      );
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);
  return (
    <div>
      <div className="salesPersonDataDetails">
        <div className="personDetails">
          <div className="grid grid-cols-2 w-full items-center">
            <div className="gridItem flex items-center">
              <div
                onClick={() => router.back()}
                className="w-[30px] h-[30px] border border-[#BF1B39] flex items-center justify-center mr-5 rounded cursor-pointer hover:bg-#bf1b39"
              >
                <ArrowBack className="w-[20px] text-[#bf1b39]" />
              </div>
              <div className="person flex items-center mr-10">
                <Avatar sx={{ height: "30px", width: "30px" }} />
                <div className="pl-3">
                  <p className="m-0">Facility Name</p>
                  <p className="m-0">
                    {" "}
                    {singleFacilityDetails?.[0]?.facility_name}
                  </p>
                </div>
              </div>
              <div className="person flex items-center">
                <Avatar sx={{ height: "30px", width: "30px" }} />
                <div className="pl-3">
                  <p className="m-0">Marketer Name</p>
                  <p className="m-0">
                    {" "}
                    {singleFacilityDetails?.[0]?.sales_rep_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="gridItem flex items-center justify-end">
              <BilledAndRevenueTabs
                selectedTabValue={selectedTabValue}
                setSelectedTabValue={setSelectedTabValue}
              />
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />
            </div>
          </div>
        </div>

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
              loading={caseTypeLoading}
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
              pathName={"facilities"}
            />
          </Grid>
          <Grid item xs={12}>
            <InsuranceWiseDetails searchParams={searchParams} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default SingleFacilityBillingAndRevenueDetails;
