import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData, sortData } from "@/lib/Pipes/sortAndGetData";
import {
  changeDateToUTC,
  getUniqueMonths,
  rearrangeDataWithCasetypesInFilters,
} from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getAllCaseTypesListAPI,
  getSingleCaseTypeMonthWiseFacilityDetailsAPI,
} from "@/services/caseTypesAPIs";
import { ArrowBack } from "@mui/icons-material";
import { Grid } from "@mui/material";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import SingleCaseTypeFacilitiesTable from "./SingleCaseTypeFacilityDetails";
import SingleCaseTypeFilters from "./SingleCaseTypeFilters";

const SingleCaseTypeDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const params = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [search, setSearch] = useState("");
  const [caseTypeFacilityDetails, setCaseTypeFacilityDetails] = useState<any>(
    []
  );
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [monthWiseTotalSum, setMonthWiseTotalSum] = useState<any>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<any>(null);
  const [completeData, setCompleteData] = useState([]);
  const [caseTypeOptions, setCaseTypeOptions] = useState<any>([]);

  console.log(caseTypeFacilityDetails, "fdiuwe");
  const queryPreparations = async ({
    fromDate,
    toDate,
    case_id = searchParams?.case_type_id,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
  }: any) => {
    let queryParams: any = {};
    console.log(fromDate, "3rewiewi");
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (searchValue) {
      queryParams["search"] = searchValue;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    if (case_id) {
      queryParams["case_type_id"] = case_id;
    }
    try {
      await getSingleCaseTypeDetails(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get all case types list details for autocomplete
  const getAllCaseTypes = async (case_id: any) => {
    try {
      let response = await getAllCaseTypesListAPI();
      if (response.success) {
        let rearrangedData = rearrangeDataWithCasetypesInFilters(
          response?.data
        );
        setCaseTypeOptions(rearrangedData);
        if (case_id) {
          let caseOption: any = response?.data?.find(
            (item: any) => item?.id == case_id
          );
          setSelectedCaseType(caseOption);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //get single Case type details
  const getSingleCaseTypeDetails = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getSingleCaseTypeMonthWiseFacilityDetailsAPI({
        queryParams,
      });
      let queryString = prepareURLEncodedParams("", queryParams);
      router.replace(`${pathname}${queryString}`);
      if (response.status == 200 || response?.status == 201) {
        await getAllCaseTypes(queryParams?.case_type_id);
        setCompleteData(response?.data);

        // let filteredData = dataFilters(
        //   response?.data,
        //   queryParams?.order_by,
        //   queryParams?.order_type,
        //   queryParams?.search
        // );
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
    console.log(groupedData, "939332030");
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

  const dataFilters = (
    data: any,
    orderBy: string,
    orderType: any,
    search: any
  ) => {
    if (search) {
      const searchTerm = search.toLowerCase().trim();
      data = data.filter(
        (item: any) =>
          item.sales_rep_name?.toLowerCase().includes(searchTerm) ||
          item.facility_name?.toLowerCase().includes(searchTerm)
      );
    }
    if (orderBy && orderType) {
      data = sortAndGetData(data, orderBy, orderType);
    }
    return data;
  };

  const onUpdateData = ({
    search = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
  }: Partial<{
    search: any;
    orderBy: string;
    orderType: "asc" | "desc";
  }>) => {
    console.log("Fdsajds", orderBy);
    const queryParams: any = {
      ...(search && { search }),
      ...(orderBy && { order_by: orderBy }),
      ...(orderType && { order_type: orderType }),
      ...(searchParams?.from_date && { from_date: searchParams?.from_date }),
      ...(searchParams?.to_date && { to_date: searchParams?.to_date }),
      ...(searchParams?.case_type_id && {
        case_type_id: searchParams?.case_type_id,
      }),
    };

    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let filteredData: any = [...completeData];
    // Group and process data
    let groupedData = groupDataForVolume(filteredData);
    console.log(groupedData, "13245==");
    groupedData = dataFilters(groupedData, orderBy, orderType, search);
    console.log(groupedData, "77732773");
    const modifiedData = addSerial(groupedData, 1, groupedData?.length);
    const groupedDataSum = groupDatasumValue(filteredData);

    setCaseTypeFacilityDetails(modifiedData);
    setMonthWiseTotalSum(groupedDataSum);
  };

  useEffect(() => {
    if (searchParams?.case_type_id) {
      queryPreparations({
        fromDate: searchParams?.from_date,
        toDate: searchParams?.to_date,
        case_id: searchParams?.case_type_id,
      });
      if (searchParams?.from_date) {
        setDateFilterDefaultValue(
          changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
        );
      }
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div>
      <div className="salesPersonDataDetails" id="caseTypeFacilityDetails">
        <div className="personDetails justify-between">
          <div className="gridItem flex items-center">
            <div
              onClick={() => router.back()}
              className="w-[30px] h-[30px] border border-[#BF1B39] flex items-center justify-center mr-5 rounded cursor-pointer hover:bg-#bf1b39"
            >
              <ArrowBack className="w-[20px] text-[#bf1b39]" />
            </div>
            <div className="person flex items-center mr-10">
              <div className="pl-3">
                <p className="m-0">Case Type Facility Details</p>
              </div>
            </div>
          </div>
          <SingleCaseTypeFilters
            onUpdateData={onUpdateData}
            queryPreparations={queryPreparations}
            dateFilterDefaultValue={dateFilterDefaultValue}
            setDateFilterDefaultValue={setDateFilterDefaultValue}
            caseTypeFacilityDetails={caseTypeFacilityDetails}
            totalSumValue={monthWiseTotalSum}
            selectedCaseType={selectedCaseType}
            setSelectedCaseType={setSelectedCaseType}
            searchParams={searchParams}
            caseTypeOptions={caseTypeOptions}
            headerMonths={headerMonths}
          />
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
                onUpdateData={onUpdateData}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default SingleCaseTypeDetails;
