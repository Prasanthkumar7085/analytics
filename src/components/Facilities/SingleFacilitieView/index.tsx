"use client";
import CaseTypes from "@/components/DashboardPage/CaseType";
import Stats from "@/components/DashboardPage/Stats";
import InsurancePayors from "@/components/InsurancePayors";
import Trends from "@/components/Trends";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getSingleFacilityCaseTypesRevenueAPI,
  getSingleFacilityCaseTypesVolumeAPI,
  getSingleFacilityDetailsAPI
} from "@/services/facilitiesAPIs";
import { getFacilitiesRevenueStatsDetailsAPI, getFacilitiesVolumeStatsDetailsAPI } from "@/services/statsAPI";
import { ArrowBack } from "@mui/icons-material";
import { Avatar, Grid } from "@mui/material";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import SingleFacilitieCaseTypeDetails from "./SingleFacilitiesCaseTypeDetails";

const FacilitiesView = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [caseTypeLoading, setCaseTypeLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Volume");
  const [singleFacilityDetails, setSingleFacilityDetails] = useState<any>();


  //get revenue stats count
  const getRevenueStatsCount = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getFacilitiesRevenueStatsDetailsAPI(id, queryParams);
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
      const response = await getFacilitiesVolumeStatsDetailsAPI(id, queryParams);
      setVolumeStatsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  //get the stats counts
  const getStatsCounts = async (fromDate: any, toDate: any) => {
    setLoading(true);
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathName}${queryString}`);

      await getRevenueStatsCount(queryParams);
      await getVolumeStatsCount(queryParams)

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  //query preparation method
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


  //get the caseTypesRevenue data
  const getCaseTypesRevenueStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {

      const response = await getSingleFacilityCaseTypesRevenueAPI(id as string, queryParams);
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

  //get volumn case types data
  const getCaseTypesVolumeStats = async (queryParams: any) => {
    setCaseTypeLoading(true);
    try {
      const response = await getSingleFacilityCaseTypesVolumeAPI(id as string, queryParams);
      if (response.status == 200 || response?.status == 201) {
        let totalCases = 0;
        let completedCases = 0;
        let pendingCases = 0;

        response?.data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          completedCases += entry.completed_cases ? +entry.completed_cases : 0;
          pendingCases += entry.pending_cases ? +entry.pending_cases : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: completedCases, dolorSymbol: false },
          { value: pendingCases, dolorSymbol: false },
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

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      getStatsCounts(fromDate, toDate);
      setDateFilterDefaultValue([new Date(fromDate), new Date(toDate)]);
      queryPreparations(fromDate, toDate, tabValue);

    }
    else {
      setDateFilterDefaultValue("");
      getStatsCounts("", "");
      router.push(`/facilities/${id}`);
      queryPreparations(fromDate, toDate, tabValue);
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

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getStatsCounts(searchParams?.from_date, searchParams?.to_date);
      queryPreparations(searchParams?.from_date, searchParams?.to_date, tabValue);
      getSingleFacilityDetails();
    }
    if (searchParams?.from_date) {
      setDateFilterDefaultValue([
        new Date(searchParams?.from_date),
        new Date(searchParams?.to_date),
      ]);
    }
  }, []);

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
                    {singleFacilityDetails?.[0]?.facility_name}
                  </p>
                </div>
              </div>
              <div className="person flex items-center">
                <Avatar sx={{ height: "30px", width: "30px" }} />
                <div className="pl-3">
                  <p className="m-0">Marketer Name</p>
                  <p className="m-0">
                    {singleFacilityDetails?.[0]?.sales_rep_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="gridItem flex justify-end">
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
              />
            </Grid>

            <Grid item xs={12}>
              <SingleFacilitieCaseTypeDetails
                pageName={"facilities"}
                searchParams={searchParams}
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
                    Insurance Payors
                  </h3>
                </div>
                <div className="cardBody">
                  <InsurancePayors
                    searchParams={searchParams}
                    pageName={"facilities"}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={5}>
              <Trends searchParams={searchParams} pageName={"facilities"} />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesView;
