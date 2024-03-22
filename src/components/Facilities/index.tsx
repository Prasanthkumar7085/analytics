import { useEffect, useMemo, useState } from "react";
import TanStackTableComponent from "../core/Table/SingleColumn/SingleColumnTable";
import { useSelector } from "react-redux";
import { facilitiesAPI } from "@/services/facilitiesAPIs";
import {
  mapFacilityNameWithId,
  mapSalesRepNameWithId,
} from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { Button } from "@mui/material";
import MultipleColumnsTable from "../core/Table/MultitpleColumn/MultipleColumnsTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FacilitiesFilters from "./FacilitiesFilters";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";

const FacilitiesList = () => {
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

  //get the list of Facilities
  const getFacilitiesList = async ({
    fromDate,
    toDate,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
  }: any) => {
    setLoading(true);
    try {
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

      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await facilitiesAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setCompleteData(response?.data);

        let data = response?.data;
        if (searchValue) {
          data = data.filter((item: any) =>
            item.sales_rep_name
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase()?.trim())
          );
        }
        data = sortAndGetData(data, orderBy, orderType);
        const modifieData = addSerial(data, 1, data?.length);
        setFacilitiesData(modifieData);
        const totalCases = data.reduce(
          (sum: any, item: any) => sum + +item.total_cases,
          0
        );
        const billedAmoumnt = data.reduce(
          (sum: any, item: any) => sum + +item.generated_amount,
          0
        );
        const paidRevenueSum = data.reduce(
          (sum: any, item: any) => sum + +item.paid_amount,
          0
        );
        const pendingAmoumnt = data.reduce(
          (sum: any, item: any) => sum + +item.pending_amount,
          0
        );

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: billedAmoumnt, dolorSymbol: true },
          { value: paidRevenueSum, dolorSymbol: true },
          { value: pendingAmoumnt, dolorSymbol: true },
        ];
        setTotalSumValues(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToSingleRepPage = (Id: string) => {
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

    router.push(`/facilities/${Id}${queryString}`);
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
      accessorFn: (row: any) => row.facility_name,
      id: "facility_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITY NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
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
      accessorFn: (row: any) => row._id,
      header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
      id: "revenue",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.generated_amount,
          id: "generated_amount",
          header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span>{formatMoney(getValue())}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.paid_amount,
          header: () => <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>,
          id: "paid_amount",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span>{formatMoney(getValue())}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.pending_amount,
          header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
          id: "pending_amount",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span>{formatMoney(getValue())}</span>;
          },
        },
      ],
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
              onClick={() => goToSingleRepPage(info.row.original.facility_id)}
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
            item.sales_rep_name
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
            item.sales_rep_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim()) ||
            item.facility_name
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()?.trim())
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setFacilitiesData(modifieData);

    const totalCases = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );

    const billedAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.generated_amount,
      0
    );
    const paidRevenueSum = data.reduce(
      (sum: any, item: any) => sum + +item.paid_amount,
      0
    );
    const pendingAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.pending_amount,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalCases, dolorSymbol: false },
      { value: billedAmoumnt, dolorSymbol: true },
      { value: paidRevenueSum, dolorSymbol: true },
      { value: pendingAmoumnt, dolorSymbol: true },
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    getFacilitiesList({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
      searchValue: searchParams?.search,
    });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue([
        new Date(searchParams?.from_date),
        new Date(searchParams?.to_date),
      ]);
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div id="salesRepresentativesPage" className="facilitiesPage">
      <FacilitiesFilters
        onUpdateData={onUpdateData}
        getFacilitiesList={getFacilitiesList}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
      />
      <MultipleColumnsTableForSalesRep
        data={facilitiesData}
        columns={columnDef}
        loading={loading}
        totalSumValues={totalSumValues}
        searchParams={searchParams}
        getData={onUpdateData}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FacilitiesList;
