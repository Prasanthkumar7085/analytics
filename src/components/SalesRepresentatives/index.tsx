"use client";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { salesRepsAPI } from "@/services/salesRepsAPIs";
import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTable from "../core/Table/MultitpleColumn/MultipleColumnsTable";
import SalesRepsFilters from "./SalesRepsFilters";
import styles from "./salesreps.module.css";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";

const SalesRepresentatives = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const marketers = useSelector((state: any) => state?.users.marketers);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [loading, setLoading] = useState(false);
  const [totalSumValues, setTotalSumValues] = useState<any>([]);

  const [salesReps, setSalesReps] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();

  const getAllSalesReps = async ({
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

      const response = await salesRepsAPI(queryParams);

      if (response.status == 200 || response.status == 201) {
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
        setSalesReps(modifieData);

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
        const totalNoOfFacilities = data.reduce(
          (sum: any, item: any) => sum + +item.no_of_facilities,
          0
        );

        const result: any = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalNoOfFacilities, dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: billedAmoumnt, dolorSymbol: true },
          { value: paidRevenueSum, dolorSymbol: true },
          { value: pendingAmoumnt, dolorSymbol: true },
        ];
        setTotalSumValues(result);
      } else {
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToSingleRepPage = (repId: string) => {
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

    router.push(`/sales-representatives/${repId}${queryString}`);
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
      accessorFn: (row: any) => row.no_of_facilities,
      id: "no_of_facilities",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>NO OF FACILITIES</span>
      ),
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue()?.toLocaleString()}</span>;
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
        return <span>{getValue()?.toLocaleString()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.revenue,
      header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
      id: "revenue",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.generated_amount,
          header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
          id: "generated_amount",
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
          cell: (info: any) => {
            return <span>{formatMoney(info.getValue())}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.pending_amount,
          header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
          id: "pending_amount",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: (info: any) => {
            return <span>{formatMoney(info.getValue())}</span>;
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row?._id,
      id: "actions",
      header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        return (
          <Button
            className="actionButton"
            onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
          >
            view
          </Button>
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
        data = data.filter((item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    } else {
      data = [...completeData];
      if (search) {
        data = data.filter((item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setSalesReps(modifieData);

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
    const totalNoOfFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.no_of_facilities,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalNoOfFacilities, dolorSymbol: false },
      { value: totalCases, dolorSymbol: false },
      { value: billedAmoumnt, dolorSymbol: true },
      { value: paidRevenueSum, dolorSymbol: true },
      { value: pendingAmoumnt, dolorSymbol: true },
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    getAllSalesReps({
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
    <div className={styles.salesRepsContainer} id="salesRepsPage">
      <SalesRepsFilters
        onUpdateData={onUpdateData}
        getAllSalesReps={getAllSalesReps}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
        searchParams={searchParams}
      />
      <MultipleColumnsTableForSalesRep
        data={salesReps}
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

export default SalesRepresentatives;
