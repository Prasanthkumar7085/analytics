import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getAllBilledInsurancesListAPI,
  getAllRevenueInsurancesListAPI,
} from "@/services/BillingAnalytics/insurancesAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BillingInsurancesFilters from "./BillingInsurancesFilters";
import { tabBasedInsurancesColumns } from "./BillingAndRevenueInsuranceColumns";
import MultipleColumnsTableForSalesRep from "@/components/core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import LoadingComponent from "@/components/core/LoadingComponent";

const BillingAndRevenueInsurances = () => {
  const router = useRouter();
  const [insurancesData, setInsurancesData] = useState([]);
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
        await getBilledInsurancesList(queryParams);
      } else {
        await getRevenueInsurancesList(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the list of Facilities
  const getBilledInsurancesList = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getAllBilledInsurancesListAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setCompleteData(response?.data);

        let data = response?.data;
        if (queryParams.search) {
          data = data.filter((item: any) =>
            item.insurance_payer_name
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
        setInsurancesData(modifieData);
        calculateTotalForEachColumn(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getRevenueInsurancesList = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getAllRevenueInsurancesListAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setCompleteData(response?.data);

        let data = response?.data;
        if (queryParams.search) {
          data = data.filter((item: any) =>
            item.insurance_payor_name
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
        setInsurancesData(modifieData);
        calculateTotalForEachColumn(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalForEachColumn = (data: any[]) => {
    const keysForBilledTab = [
      "total_cases",
      "billed_cases",
      "unbilled_cases",
      "billed_amount",
    ];
    const keysForRevenueTab = [
      "no_of_facilities",
      "targeted_amount",
      "received_amount",
    ];
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
    ];

    if (selectedTabValue === "billed") {
      result.push(
        { value: aggregates["total_cases"], dolorSymbol: false },
        { value: aggregates["billed_cases"], dolorSymbol: false },
        { value: aggregates["unbilled_cases"], dolorSymbol: false },
        { value: aggregates["billed_amount"], dolorSymbol: true },
        { value: null, dolorSymbol: false }
      );
    } else {
      result.push(
        { value: aggregates["no_of_facilities"] ?? 0, dolorSymbol: false },
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
      filteredData = filteredData.filter((item: any) =>
        item.insurance_payer_name
          ?.toLowerCase()
          ?.includes(search.toLowerCase().trim())
      );
    }

    if (orderBy && orderType) {
      filteredData = sortAndGetData(filteredData, orderBy, orderType);
    }

    const modifiedData = addSerial(filteredData, 1, filteredData?.length);
    setInsurancesData(modifiedData);
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
      <BillingInsurancesFilters
        onUpdateData={onUpdateData}
        queryPreparations={queryPreparations}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
        insuranceData={insurancesData}
        totalSumValue={totalSumValues}
        selectedTabValue={selectedTabValue}
        setSelectedTabValue={setSelectedTabValue}
      />
      <MultipleColumnsTableForSalesRep
        data={insurancesData}
        columns={tabBasedInsurancesColumns({ searchParams, router })}
        loading={loading}
        totalSumValues={totalSumValues}
        searchParams={searchParams}
        getData={onUpdateData}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default BillingAndRevenueInsurances;
