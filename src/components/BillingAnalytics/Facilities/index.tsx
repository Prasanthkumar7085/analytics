import MultipleColumnsTableForSalesRep from "@/components/core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getAllBilledFacilitiesListAPI } from "@/services/BillingAnalytics/facilitiesAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BillingFacilitiesFilters from "./BillingFacilitiesFilters";
import { BillingFacilitiesColumns } from "./BillingAndRevenueFacilitiesColumns";
import LoadingComponent from "@/components/core/LoadingComponent";

const BillingAndRevenueFacilities = () => {
  const router = useRouter();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const pathname = usePathname();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [totalSumValues, setTotalSumValues] = useState<any>([]);
  const [completeData, setCompleteData] = useState([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  //query preparation method
  const queryPreparations = async ({
    fromDate,
    toDate,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
    tabValue = "billing",
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
    if (tabValue) {
      queryParams["tab"] = tabValue;
    }
    try {
      await getFacilitiesList(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the list of Facilities
  const getFacilitiesList = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getAllBilledFacilitiesListAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setCompleteData(response?.data);

        let data = response?.data;
        if (queryParams.search) {
          data = data.filter(
            (item: any) =>
              item.sales_rep_name
                ?.toLowerCase()
                ?.includes(search?.toLowerCase()?.trim()) ||
              item.facility_name
                ?.toLowerCase()
                ?.includes(search?.toLowerCase()?.trim())
          );
        }
        data = sortAndGetData(
          data,
          queryParams.order_by,
          queryParams.order_type
        );
        const modifieData = addSerial(data, 1, data?.length);
        setFacilitiesData(modifieData);
        calculateTotalForEachColumn(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalForEachColumn = (data: any[]) => {
    const keysToAggregate = ["total_cases", "billed_cases", "billed_amount"];
    const aggregates = keysToAggregate.reduce(
      (aggregates: any, key: string) => {
        aggregates[key] = data.reduce(
          (sum: number, item: any) => sum + +item[key],
          0
        );
        return aggregates;
      },
      {}
    );
    const result = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: aggregates["total_cases"], dolorSymbol: false },
      { value: aggregates["billed_cases"], dolorSymbol: false },
      { value: aggregates["billed_amount"], dolorSymbol: true },
      { value: null, dolorSymbol: false },
    ];

    setTotalSumValues(result);
  };

  // Updated onUpdateData function
  const onUpdateData = ({
    search: search = searchParams?.search,
    orderBy: orderBy = searchParams?.order_by,
    orderType: orderType = searchParams?.order_type as "asc" | "desc",
    general_sales_reps_exclude_count:
      general_sales_reps_exclude_count = searchParams?.general_sales_reps_exclude_count,
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
    general_sales_reps_exclude_count: any;
  }>) => {
    let queryParams: any = {
      ...(search && { search }),
      ...(orderBy && { order_by: orderBy }),
      ...(orderType && { order_type: orderType }),
      ...(params.get("from_date") && { from_date: params.get("from_date") }),
      ...(params.get("to_date") && { to_date: params.get("to_date") }),
      ...(general_sales_reps_exclude_count && {
        general_sales_reps_exclude_count,
      }),
    };

    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);

    let filteredData = [...completeData];

    if (search) {
      filteredData = filteredData.filter(
        (item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search.toLowerCase().trim()) ||
          item.facility_name
            ?.toLowerCase()
            ?.includes(search.toLowerCase().trim())
      );
    }

    if (orderBy && orderType) {
      filteredData = sortAndGetData(filteredData, orderBy, orderType);
    }

    const modifiedData = addSerial(filteredData, 1, filteredData?.length);
    setFacilitiesData(modifiedData);
    calculateTotalForEachColumn(filteredData);
  };

  useEffect(() => {
    queryPreparations({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
      searchValue: searchParams?.search,
      tabValue: searchParams?.tab,
    });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue(
        changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
      );
    }
  }, [searchParams]);

  return (
    <div id="FacilitiesTablePage" className="facilitiesPage s-no-column">
      <BillingFacilitiesFilters
        onUpdateData={onUpdateData}
        queryPreparations={queryPreparations}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
        facilitiesData={facilitiesData}
        totalSumValue={totalSumValues}
      />
      <MultipleColumnsTableForSalesRep
        data={facilitiesData}
        columns={BillingFacilitiesColumns}
        loading={loading}
        totalSumValues={totalSumValues}
        searchParams={searchParams}
        getData={onUpdateData}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default BillingAndRevenueFacilities;
