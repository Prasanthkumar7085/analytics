"use client";
import CaseTypes from "@/components/DashboardPage/CaseType";
import Stats from "@/components/DashboardPage/Stats";
import InsurancePayorsForSalesRep from "@/components/InsurancePayors/InsurancePayorsForSalesRep";
import Trends from "@/components/Trends";
import GlobalCaseTypesAutoComplete from "@/components/core/GlobalCaseTypesAutoComplete";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import GlobalTabsForSinglePage from "@/components/core/GlobalTabsForSinglePage";
import {
  averageUptoDateTargets,
  averageUptoDateTargetsForSalesReps,
  changeDateToUTC,
  getDatesForStatsCards,
  rearrangeDataWithCasetypes
} from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getSingleRepDeatilsAPI,
  getSingleSalesRepCaseTypesRevenueAPI,
  getSingleSalesRepCaseTypesVolumeAPI,
} from "@/services/salesRepsAPIs";
import {
  getSalesRepRevenueStatsDetailsAPI,
  getSalesRepVolumeStatsDetailsAPI,
} from "@/services/statsAPI";
import { ArrowBack } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { startOfMonth } from "rsuite/esm/utils/dateUtils";
import Facilities from "./Facilities";
import SingleSalesRepCaseTypeDetails from "./SingleSalesRepCaseTypeDetails";
import dayjs from "dayjs";
const SalesRepView = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathName = usePathname();

  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );
  const [statsSeletedDate, setSeletedStatsDate] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [salesRepDetails, setSalesRepDetails] = useState<any>();
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [caseTypeLoading, setCaseTypeLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Volume");
  const [selectedCaseValueForInsurance, setSelectedCaseValueForInsurance] =
    useState<any>(null);
  const [dayWiseTargetsEnable, setDayWiseTargetsEnable] = useState<boolean>()
  const [selectedCaseValueForFacilities, setSelectedCaseValueForFacilities] =
    useState<any>(null);

  //get revenue stats count
  const getRevenueStatsCount = async (queryParams: any) => {
    try {
      const response = await getSalesRepRevenueStatsDetailsAPI(id, queryParams);
      setRevenueStatsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //get volume stats count
  const getVolumeStatsCount = async (queryParams: any) => {
    try {
      const response = await getSalesRepVolumeStatsDetailsAPI(id, queryParams);
      setVolumeStatsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //get the stats counts
  const getStatsCounts = async () => {
    setLoading(true);
    let thisMonth = [startOfMonth(new Date()), new Date()];
    let defaultDates = getDatesForStatsCards(thisMonth);

    try {
      let queryParams: any = {};

      if (defaultDates?.[0]) {
        queryParams["from_date"] = defaultDates?.[0];
      }
      if (defaultDates?.[1]) {
        queryParams["to_date"] = defaultDates?.[1];
      }
      setSeletedStatsDate([queryParams.from_date, queryParams.to_date]);

      await getVolumeStatsCount(queryParams);
      await getRevenueStatsCount(queryParams);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  //query preparation method
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
      let queryString = prepareURLEncodedParams("", queryParams);

      router.replace(`${pathName}${queryString}`);
      if (tabValue == "Revenue") {
        await getCaseTypesRevenueStats(queryParams);
      } else {
        if (checkDateForCurrentMonth(queryParams) && Object?.keys(queryParams)?.length) {
          await getCaseTypesVolumeStats(queryParams);
        } else {
          await getCaseTypesVolumeStatsWithoutDayWiseTargets(queryParams);
        }
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
    if (dateToCheck.month() === currentDate.month() && dateToCheck.year() === currentDate.year() && Object?.keys(queryParams)?.length) {
      setDayWiseTargetsEnable(true);
      return true;
    }
    else {
      setDayWiseTargetsEnable(false);
      return false;
    }
  }


  //get the caseTypesRevenue data
  const getCaseTypesRevenueStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getSingleSalesRepCaseTypesRevenueAPI(
        id as string,
        queryParams
      );
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

  //get volumn case types data
  const getCaseTypesVolumeStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getSingleSalesRepCaseTypesVolumeAPI(
        id as string,
        queryParams
      );
      if (response.status == 200 || response?.status == 201) {

        let data = response?.data?.map((entry: any) => {
          return { ...entry, dayTargets: averageUptoDateTargetsForSalesReps(entry?.total_targets, queryParams["to_date"]) };
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

  const getCaseTypesVolumeStatsWithoutDayWiseTargets = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getSingleSalesRepCaseTypesVolumeAPI(
        id as string,
        queryParams
      );
      if (response.status == 200 || response?.status == 201) {

        let data = [...response?.data]
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

  //get to know the sale reep details
  const getSignleSalesRepDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleRepDeatilsAPI(id as string);
      if (response.status == 200 || response?.status == 201) {
        setSalesRepDetails(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getStatsCounts();
      getSignleSalesRepDetails();
      if (searchParams?.from_date) {
        setDateFilterDefaultValue(
          changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
        );
      }
    } else {
      router.back();
    }
  }, []);

  useEffect(() => {
    queryPreparations(searchParams?.from_date, searchParams?.to_date, tabValue);
  }, [tabValue]);

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations(fromDate, toDate, tabValue);
    } else {
      setDateFilterDefaultValue("");
      router.replace(`/sales-representatives/${id}`);
      queryPreparations("", "", tabValue);
    }
  };

  return (
    <div>
      <div className="salesPersonDataDetails">
        <div className="personDetails">
          <div className="grid grid-cols-2 w-full items-center">
            <div className="gridItem flex items-center">
              {userType == "MARKETER" ? (
                ""
              ) : (
                <div
                  onClick={() => router.back()}
                  className="w-[30px] h-[30px] border border-[#BF1B39] flex items-center justify-center mr-5 rounded cursor-pointer hover:bg-#bf1b39"
                >
                  <ArrowBack className="w-[20px] text-[#bf1b39]" />
                </div>
              )}

              <div className="person flex items-center mr-10">
                <Avatar sx={{ height: "30px", width: "30px" }} />
                <div className="pl-3">
                  <p className="m-0">{salesRepDetails?.[0]?.sales_rep}</p>
                  {salesRepDetails?.[0]?.manager ? (
                    <p className="mt-0">
                      Manager: {salesRepDetails?.[0]?.manager}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="gridItem flex items-center justify-end">
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />
            </div>
          </div>
        </div>
        <div className="personData">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Stats
                revenueStatsDetails={revenueStatsDetails}
                volumeStatsDetails={volumeStatsDetails}
                loading={loading}
                onChange={() => { }}
                statsSeletedDate={statsSeletedDate}
              />
            </Grid>
            <Grid item xs={8}>
              <CaseTypes
                caseTypesStatsData={caseTypesStatsData}
                loading={caseTypeLoading}
                queryPreparations={queryPreparations}
                totalRevenueSum={totalRevenueSum}
                setTabValue={setTabValue}
                tabValue={tabValue}
                dayWiseTargetsEnable={dayWiseTargetsEnable}
              />
            </Grid>

            <Grid item xs={12}>
              <SingleSalesRepCaseTypeDetails
                pageName={"sales-reps"}
                searchParams={searchParams}
                tabValue={tabValue}
                setCaseTypeValue={setSelectedCaseValueForFacilities}
              />
            </Grid>
            <Grid item xs={7}>
              <div
                className="eachDataCard s-no-column"
                id="InsurancePayorsData"
              >
                <div className="cardHeader">
                  <h3>
                    <Image
                      alt=""
                      src="/tableDataIcon.svg"
                      height={20}
                      width={20}
                    />
                    Insurance Payors {tabValue}
                  </h3>
                  <div style={{ width: "20%" }} className="searchInput">
                    <GlobalCaseTypesAutoComplete
                      selectedCaseValue={selectedCaseValueForInsurance}
                      setSelectedCaseValue={setSelectedCaseValueForInsurance}
                    />
                  </div>
                </div>
                <div className="cardBody">
                  <InsurancePayorsForSalesRep
                    searchParams={searchParams}
                    pageName={"sales-reps"}
                    tabValue={tabValue}
                    selectedCaseValue={selectedCaseValueForInsurance}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={5}>
              <Trends
                searchParams={searchParams}
                pageName={"sales-reps"}
                tabValue={tabValue}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="eachDataCard s-no-column" id="FacilitiesData">
                <div className="cardHeader">
                  <h3>
                    <Image
                      alt=""
                      src="/tableDataIcon.svg"
                      height={20}
                      width={20}
                    />
                    Facilities {tabValue}
                  </h3>
                  <div style={{ width: "20%" }} className="searchInput">
                    <GlobalCaseTypesAutoComplete
                      selectedCaseValue={selectedCaseValueForFacilities}
                      setSelectedCaseValue={setSelectedCaseValueForFacilities}
                    />
                  </div>
                </div>
                <div className="cardBody">
                  <Facilities
                    searchParams={searchParams}
                    tabValue={tabValue}
                    selectedCaseValue={selectedCaseValueForFacilities}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default SalesRepView;
