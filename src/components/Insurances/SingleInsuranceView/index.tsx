"use client";
import Trends from "@/components/Trends";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { Avatar, Grid } from "@mui/material";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import {
  getInsurancesCaseTypesAPI,
  getSingleInsurancesDetailsAPI,
} from "@/services/insurancesAPI";
import formatMoney from "@/lib/Pipes/moneyFormat";
import InsuranceCaseTypes from "./InsuranceCaseTypes";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { addSerial } from "@/lib/Pipes/addSerial";
import TrendsGraphForInsurance from "./TrendsGraphForInsurance";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";

const InsuranceView = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [singleInsuranceDetails, setSingleInsuranceDetails] = useState<any>();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [insuranceData, setInsuranceData] = useState([]);
  const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);

  //query preparation method
  const queryPreparations = async (fromDate: any, toDate: any) => {
    let queryParams: any = {};

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }

    try {
      await getSingleInsuranceCaseTypesDetails(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const getSingleInsuranceCaseTypesDetails = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathName}${queryString}`);

      const response = await getInsurancesCaseTypesAPI(
        id as string,
        queryParams
      );
      if (response?.status == 200 || response?.status == 201) {
        const modifieData = addSerial(
          response?.data,
          1,
          response?.data?.length
        );
        setInsuranceData(modifieData);
        let totalVolume = 0;
        let completeVolume = 0;
        let expectedAmount = 0;
        let totalAmount = 0;
        let pendingVolume = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalVolume += entry.total_cases ? +entry.total_cases : 0;
          completeVolume += entry.completed_cases ? +entry.completed_cases : 0;
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          expectedAmount += entry.expected_amount ? +entry.expected_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          pendingVolume += entry.pending_cases ? +entry.pending_cases : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalVolume, dolorSymbol: false },
          { value: completeVolume, dolorSymbol: false },
          { value: pendingVolume, dolorSymbol: false },
        ];

        setTortalInsurancePayors(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations(fromDate, toDate);
    } else {
      setDateFilterDefaultValue([]);
      queryPreparations("", "");
    }
  };

  useEffect(() => {
    getSingleInsuranceDetails();
    queryPreparations(searchParams?.from_date, searchParams?.to_date);
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
                  <p className="m-0">
                    {singleInsuranceDetails?.[0]?.insurance_payor_name}
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
            <Grid item xs={12}>
              <InsuranceCaseTypes
                searchParams={searchParams}
                insuranceData={insuranceData}
                totalInsurancePayors={totalInsurancePayors}
                loading={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TrendsGraphForInsurance
                searchParams={searchParams}
                pageName={"insurances"}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default InsuranceView;
