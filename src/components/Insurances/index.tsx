"use client";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { getInsurancesAPI } from "@/services/insurancesAPI";
import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import InsurancesFilters from "./InsurancesFilters";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";

const InsurancesComponent = () => {
  const router = useRouter();
  const [insurancesData, setinsurancesData] = useState([]);
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
    try {
      await getInsurancesList(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the list of Facilities
  const getInsurancesList = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getInsurancesAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setCompleteData(response?.data);

        let data = response?.data;
        if (queryParams.search) {
          data = data.filter(
            (item: any) =>
              item.insurance_payor_name
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
        setinsurancesData(modifieData);
        const totalCases = data.reduce(
          (sum: any, item: any) => sum + +item.total_cases,
          0
        );
        const totalNoOfFacilities = data.reduce(
          (sum: any, item: any) => sum + +item.no_of_facilities,
          0
        );

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalNoOfFacilities, dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: null, dolorSymbol: false },
        ];
        setTotalSumValues(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const gotoSingleInsurancePage = (Id: string) => {
    let queryString = "";
    const queryParams: any = {};
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }

    router.push(`/insurances/${Id}${queryString}`);
  };

  const columnDef = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.insurance_payor_name,
      id: "insurance_payor_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>INSURANCE</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              gotoSingleInsurancePage(info.row.original.insurance_payor_id)
            }
          >
            {info.row.original.insurance_payor_name}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.no_of_facilities,
      id: "no_of_facilities",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>NO. OF FACILITIES</span>
      ),
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL CASES</span>,
      footer: (props: any) => props.column.id,
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      cell: ({ getValue }: any) => {
        return <span>{getValue().toLocaleString()}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      cell: (info: any) => {
        return (
          <span>
            <Button
              className="actionButton"
              onClick={() =>
                gotoSingleInsurancePage(info.row.original.insurance_payor_id)
              }
            >
              View
            </Button>
          </span>
        );
      },
    },
  ];

  const onUpdateData = ({
    search = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
  }>) => {
    let queryParams: any = {};
    if (search) {
      queryParams["search"] = search;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }

    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data = [...completeData];

    if (orderBy && orderType) {
      data = sortAndGetData(data, orderBy, orderType);
      if (search) {
        data = data.filter(
          (item: any) =>
            item.insurance_payor_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim()) ||
            item.facility_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim())
        );
      }
    } else {
      data = [...completeData];
      if (search) {
        data = data.filter(
          (item: any) =>
            item.insurance_payor_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim()) ||
            item.facility_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim())
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setinsurancesData(modifieData);

    const totalCases = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );
    const totalNoOfFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.no_of_facilities,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalNoOfFacilities, dolorSymbol: false },
      { value: totalCases, dolorSymbol: false },
      { value: null, dolorSymbol: false },
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    queryPreparations({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
      searchValue: searchParams?.search,
    });
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
    <section id="InsuranceTablePage" className="insurancesPage s-no-column">
      <InsurancesFilters
        totalSumValues={totalSumValues}
        completeData={insurancesData}
        onUpdateData={onUpdateData}
        queryPreparations={queryPreparations}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
      />
      <MultipleColumnsTableForSalesRep
        data={insurancesData}
        columns={columnDef}
        loading={loading}
        totalSumValues={totalSumValues}
        searchParams={searchParams}
        getData={onUpdateData}
      />
      <LoadingComponent loading={loading} />
    </section>
  );
};
export default InsurancesComponent;
