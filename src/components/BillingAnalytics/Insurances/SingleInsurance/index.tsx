import BilledAndRevenueTabs from "@/components/core/BilledAndRevenueTabs";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getSingleInsurancesDetailsAPI } from "@/services/insurancesAPI";
import { ArrowBack } from "@mui/icons-material";
import { Avatar, Grid } from "@mui/material";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import MonthWiseCaseTypesStats from "../../OverView/MonthWiseStats";
import MonthWiseTrendsGraph from "../../OverView/MonthWiseTrends";

const SingleInsuranceBillingAndRevenueDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { id } = useParams();
  const [singleInsuranceDetails, setSingleInsuranceDetails] = useState<any>();
  const [selectedTabValue, setSelectedTabValue] = useState<any>("billed");
  const [dashBoardQueryParams, setDashBoardQueryParams] = useState<any>();
  const [caseTypesWiseStatsData, setCaseTypeWiseStats] = useState<any>();
  const [totalSumValues, setTotalSumValues] = useState<any>();
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  //get single Insurance details
  const getSingleInsuranceDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleInsurancesDetailsAPI(id as string);
      if (response.status == 200 || response?.status == 201) {
        setSingleInsuranceDetails(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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

  useEffect(() => {
    queryPreparations(
      params?.get("from_date"),
      params?.get("to_date"),
      searchParams?.tab
    );
  }, [searchParams]);
  //api call to get stats count
  useEffect(() => {
    if (id) {
      getSingleInsuranceDetails();
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
                  <p className="m-0">Insurance Name</p>
                  <p className="m-0">
                    {" "}
                    {singleInsuranceDetails?.[0]?.insurance_payor_name}
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
          <Grid item xs={12}>
            <MonthWiseCaseTypesStats
              searchParams={searchParams}
              pathName={"insurance"}
            />
          </Grid>
          <Grid item xs={12}>
            <MonthWiseTrendsGraph searchParams={searchParams} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default SingleInsuranceBillingAndRevenueDetails;
