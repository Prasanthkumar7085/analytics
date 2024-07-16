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
  getMonthWiseVolumeCaseTypesForSinglePageAPI,
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
  const [selectedSalesRepValue, setSelectedSalesRepValue] = useState<any>(null);
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [monthWiseTotalSum, setMonthWiseTotalSum] = useState<any>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<any>(null);
  const [completeData, setCompleteData] = useState([]);
  const [caseTypeOptions, setCaseTypeOptions] = useState<any>([]);
  const [targetsRowData, setTargetRowData] = useState<any>({});
  const [targetHeaders, setTargetHeaders] = useState<any>([]);

  const queryPreparations = async ({
    fromDate,
    toDate,
    case_id = searchParams?.case_type_id,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
    sales_rep = searchParams?.sales_rep,
  }: any) => {
    let queryParams: any = {};
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
    if (sales_rep) {
      queryParams["sales_rep"] = sales_rep;
    }
    try {
      await getSingleCaseTypeDetails(queryParams);
      setTargetRowData({});
      if (queryParams?.sales_rep) {
        await getDetailsOfSingleSalesRepTargets(queryParams);
      }
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
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);
        let data = response?.data;
        data = dataFilters(
          data,
          queryParams?.order_by,
          queryParams?.order_type,
          queryParams?.search
        );

        let groupedData = groupDataForVolume(data);
        let sortedData: any = Object.values(groupedData).sort(
          (a: any, b: any) => {
            return a.facility_name.localeCompare(b.facility_name);
          }
        );
        if (queryParams?.order_by && queryParams?.order_type) {
          sortedData = sortAndGetData(
            sortedData,
            queryParams?.order_by,
            queryParams?.order_type
          );
        }
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let groupedDataSum = groupDatasumValue(data, queryParams);
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
        total_targets,
      } = item;
      if (!groupedData[facility_id]) {
        groupedData[facility_id] = {
          facility_id,
          facility_name,
          sales_rep_name,
          sales_rep_id,
          total_targets,
        };
      }
      const formattedMonth = month.replace(/\s/g, "");
      groupedData[facility_id][formattedMonth] = total_cases;
    });
    return groupedData;
  };

  const groupDataForTargets = (data: any) => {
    const groupedData: any = {};
    data?.forEach((item: any) => {
      const {
        case_type_name,
        case_type_id,
        month,
        total_cases,
        total_targets,
      } = item;
      if (!groupedData[case_type_id]) {
        groupedData[case_type_id] = {
          case_type_id,
          case_type_name,
          total_targets,
        };
      }
      const formattedMonth = month.replace(/\s/g, "");
      groupedData[case_type_id][formattedMonth] = [total_targets];
    });
    return groupedData;
  };

  // Grouping the data by month sum
  const groupDatasumValue = (data: any, queryParams: any) => {
    const groupedDataSum: any = {};
    data?.forEach((item: any) => {
      const { month, total_cases, total_targets } = item;
      const formattedMonth = month.replace(/\s/g, "");
      const amount = parseFloat(total_cases);
      const totalTargets = parseFloat(total_targets);

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
      data = data.filter((item: any) =>
        item.facility_name?.toLowerCase().includes(searchTerm)
      );
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
    setLoading(true);
    const queryParams: any = {
      ...(search && { search }),
      ...(orderBy && { order_by: orderBy }),
      ...(orderType && { order_type: orderType }),
      ...(searchParams?.from_date && { from_date: searchParams?.from_date }),
      ...(searchParams?.to_date && { to_date: searchParams?.to_date }),
      ...(searchParams?.case_type_id && {
        case_type_id: searchParams?.case_type_id,
      }),
      ...(searchParams?.sales_rep && {
        sales_rep: searchParams?.sales_rep,
      }),
    };

    router.replace(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let filteredData: any = [...completeData];
    filteredData = dataFilters(filteredData, orderBy, orderType, search);

    let groupedData = groupDataForVolume(filteredData);
    let sortedData: any = Object.values(groupedData).sort((a: any, b: any) => {
      return a.facility_name.localeCompare(b.facility_name);
    });
    if (orderBy && orderType) {
      sortedData = sortAndGetData(sortedData, orderBy, orderType);
    }
    const modifiedData = addSerial(sortedData, 1, sortedData?.length);
    let groupedDataSum = groupDatasumValue(filteredData, queryParams);
    setCaseTypeFacilityDetails(modifiedData);
    setMonthWiseTotalSum(groupedDataSum);
    setLoading(false);
  };

  const getDetailsOfSingleSalesRepTargets = async (queryParamsObj: any) => {
    setLoading(true);
    let pageName: any = "sales-reps";
    let queryParams: any = {
      from_date: queryParamsObj?.from_date,
      to_date: queryParamsObj?.to_date,
    };
    try {
      const response = await getMonthWiseVolumeCaseTypesForSinglePageAPI({
        pageName,
        id: queryParamsObj?.sales_rep,
        queryParams,
      });
      if (
        response.status == 200 ||
        (response.status == 201 && response?.data?.length > 0)
      ) {
        const groupedData: any = groupDataForTargets(response?.data);
        let data: any = Object.values(groupedData);
        data = data.find(
          (item: any) => item.case_type_id == queryParamsObj?.case_type_id
        );
        delete data?.case_type_id;
        delete data?.case_type_name;
        delete data?.total_targets;
        delete data?.total_cases;
        setTargetRowData(data);
        let uniqueMonths = getUniqueMonths(response?.data);
        setTargetHeaders(uniqueMonths);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams?.case_type_id) {
      queryPreparations({
        fromDate: searchParams?.from_date,
        toDate: searchParams?.to_date,
        case_id: searchParams?.case_type_id,
        sales_rep: searchParams?.sales_rep,
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
            headerMonths={
              params?.get("sales_rep") && !params.get("search")
                ? targetHeaders
                : headerMonths
            }
            selectedSalesRepValue={selectedSalesRepValue}
            setSelectedSalesRepValue={setSelectedSalesRepValue}
            targetsRowData={targetsRowData}
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
                caseTypeFacilityDetails={
                  Object.keys(targetsRowData)?.length > 0
                    ? caseTypeFacilityDetails
                    : filterDataByZeroValues(caseTypeFacilityDetails)
                }
                monthWiseTotalSum={monthWiseTotalSum}
                loading={loading}
                headerMonths={
                  params?.get("sales_rep") && !params.get("search")
                    ? targetHeaders
                    : headerMonths
                }
                completeData={completeData}
                groupDatasumValue={groupDatasumValue}
                setCaseTypeFacilityDetails={setCaseTypeFacilityDetails}
                onUpdateData={onUpdateData}
                targetsRowData={targetsRowData}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default SingleCaseTypeDetails;
