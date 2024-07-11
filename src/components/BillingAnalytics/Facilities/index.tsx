import LoadingComponent from "@/components/core/LoadingComponent";
import MultipleColumnsTableForSalesRep from "@/components/core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getAllBilledFacilitiesListAPI,
  getAllRevenueFacilitiesListAPI,
} from "@/services/BillingAnalytics/facilitiesAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BillingFacilitiesFilters from "./BillingFacilitiesFilters";
import { tabBasedFacilityColumns } from "./BillingAndRevenueFacilitiesColumns";

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
  const [selectedTabValue, setSelectedTabValue] = useState<any>("billed");

  //query preparation method
  const queryPreparations = async ({
    fromDate,
    toDate,
    searchValue = params?.get("search"),
    orderBy = params?.get("order_by"),
    orderType = params?.get("order_type"),
    tabValue = params?.get("tab"),
  }: any) => {
    let queryParams: any = { tab: "billed" };

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
      if (queryParams?.tab == "billed") {
        await getBilledFacilitiesList(queryParams);
      } else {
        await getRevenueFacilitiesList(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the list of Facilities
  const getBilledFacilitiesList = async (queryParams: any) => {
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
  const getRevenueFacilitiesList = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getAllRevenueFacilitiesListAPI(updatedQueyParams);
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
    const keysForBilledTab = ["total_cases", "billed_cases", "billed_amount"];
    const keysForRevenueTab = ["targeted_amount", "received_amount"];
    const aggregateKeys = (keys: string[]) =>
      keys.reduce((aggregates: any, key: string) => {
        aggregates[key] = data.reduce(
          (sum: number, item: any) => sum + +item[key],
          0
        );
        return aggregates;
      }, {});

    let aggregates: any;
    if (selectedTabValue === "billed") {
      aggregates = aggregateKeys(keysForBilledTab);
    } else {
      aggregates = aggregateKeys(keysForRevenueTab);
    }
    let result: { value: any; dolorSymbol: boolean }[] = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
    ];

    if (selectedTabValue === "billed") {
      result.push(
        { value: aggregates["total_cases"], dolorSymbol: false },
        { value: aggregates["billed_cases"], dolorSymbol: false },
        { value: aggregates["billed_amount"], dolorSymbol: true },
        { value: null, dolorSymbol: false }
      );
    } else {
      result.push(
        { value: aggregates["targeted_amount"] ?? 0, dolorSymbol: true },
        { value: aggregates["received_amount"], dolorSymbol: true },
        { value: null, dolorSymbol: false }
      );
    }
    setTotalSumValues(result);
  };

  // Updated onUpdateData function
  const onUpdateData = ({
    search: search = searchParams?.search,
    orderBy: orderBy = searchParams?.order_by,
    orderType: orderType = searchParams?.order_type as "asc" | "desc",
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
  }>) => {
    let queryParams: any = {
      ...(search && { search }),
      ...(orderBy && { order_by: orderBy }),
      ...(orderType && { order_type: orderType }),
      ...(params.get("from_date") && { from_date: params.get("from_date") }),
      ...(params.get("to_date") && { to_date: params.get("to_date") }),
      ...(params.get("tab") && { tab: params.get("tab") }),
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
  }, [searchParams?.tab]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div id="FacilitiesTablePage" className="facilitiesPage s-no-column">
      <BillingFacilitiesFilters
        onUpdateData={onUpdateData}
        queryPreparations={queryPreparations}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
        facilitiesData={facilitiesData}
        totalSumValue={totalSumValues}
        selectedTabValue={selectedTabValue}
        setSelectedTabValue={setSelectedTabValue}
      />
      <MultipleColumnsTableForSalesRep
        data={facilitiesData}
        columns={tabBasedFacilityColumns({ searchParams, router })}
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
