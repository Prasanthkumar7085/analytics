import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ArrowBack } from "@mui/icons-material";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { changeDateToUTC, getUniqueMonths } from "@/lib/helpers/apiHelpers";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { getSingleCaseTypeMonthWiseFacilityDetailsAPI } from "@/services/caseTypesAPIs";
import { addSerial } from "@/lib/Pipes/addSerial";
import SingleCaseTypeFacilitiesTable from "./SingleCaseTypeFacilityDetails";
import GlobalCaseTypesAutoComplete from "@/components/core/GlobalCaseTypesAutoComplete";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";

const SingleCaseTypeDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const params = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [caseTypeFacilityDetails, setCaseTypeFacilityDetails] = useState<any>(
    []
  );
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [monthWiseTotalSum, setMonthWiseTotalSum] = useState<any>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<any>(null);
  const [completeData, setCompleteData] = useState([]);

  const queryPreparations = async ({
    fromDate,
    toDate,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
  }: any) => {
    let queryParams: any = {};

    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    try {
      await getSingleCaseTypeDetails(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get single Case type details
  const getSingleCaseTypeDetails = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getSingleCaseTypeMonthWiseFacilityDetailsAPI({
        id,
        queryParams,
      });
      let queryString = prepareURLEncodedParams("", queryParams);
      router.push(`${pathname}${queryString}`);
      if (response.status == 200 || response?.status == 201) {
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);
        let groupedData = groupDataForVolume(response?.data);
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.facility_name.localeCompare(b.facility_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        const groupedDataSum = groupDatasumValue(response?.data);
        setCaseTypeFacilityDetails(modifieData);
        setMonthWiseTotalSum(groupedDataSum);
        setCompleteData(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupDataForVolume = (data: any) => {
    const groupedData: any = {};
    data?.forEach((item: any) => {
      const {
        facility_id,
        facility_name,
        month,
        total_cases,
        sales_rep_name,
        sales_rep_id,
      } = item;
      if (!groupedData[facility_id]) {
        groupedData[facility_id] = {
          facility_id,
          facility_name,
          sales_rep_name,
          sales_rep_id,
        };
      }
      const formattedMonth = month.replace(/\s/g, "");
      groupedData[facility_id][formattedMonth] = total_cases;
    });
    return groupedData;
  };

  // Grouping the data by month sum
  const groupDatasumValue = (data: any) => {
    const groupedDataSum: any = {};
    data?.forEach((item: any) => {
      const { month, total_cases } = item;
      const formattedMonth = month.replace(/\s/g, "");
      const amount = parseFloat(total_cases);
      if (!groupedDataSum[formattedMonth]) {
        groupedDataSum[formattedMonth] = [0];
      }
      groupedDataSum[formattedMonth][0] += amount;
    });
    return groupedDataSum;
  };

  const filterDataByZeroValues = (data: any) => {
    return data.filter((item: any) => {
      for (const key in item) {
        if (
          key !== "facility_id" &&
          key !== "facility_name" &&
          key !== "serial" &&
          key !== "sales_rep_name" &&
          key !== "sales_rep_id"
        ) {
          if (parseFloat(item[key]) !== 0) {
            return true;
          }
        }
      }
      return false;
    });
  };

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations({ fromDate: fromDate, toDate: toDate });
    } else {
      setDateFilterDefaultValue([]);
      queryPreparations({ fromDate: "", toDate: "" });
    }
  };
  useEffect(() => {
    queryPreparations({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
    });
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
                <div className="pl-3">
                  <p className="m-0">ssss</p>
                </div>
              </div>
            </div>

            <div className="gridItem flex justify-end ">
              <GlobalCaseTypesAutoComplete
                selectedCaseValue={selectedCaseType}
                setSelectedCaseValue={setSelectedCaseType}
              />
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />
            </div>
          </div>
        </div>
        <div
          className="eachDataCard s-no-column"
          id="mothWiseSingleCaseTypeData"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SingleCaseTypeFacilitiesTable
                searchParams={searchParams}
                caseTypeFacilityDetails={filterDataByZeroValues(
                  caseTypeFacilityDetails
                )}
                monthWiseTotalSum={monthWiseTotalSum}
                loading={loading}
                headerMonths={headerMonths}
                completeData={completeData}
                groupDatasumValue={groupDatasumValue}
                setCaseTypeFacilityDetails={setCaseTypeFacilityDetails}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default SingleCaseTypeDetails;
