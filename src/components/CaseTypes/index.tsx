"use client";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import {
  changeDateToUTC,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { getAllCaseTypesAPI } from "@/services/caseTypesAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import CaseTypeFilters from "./CaseTypeFilters";
import MonthWiseCaseTypeDetails from "./MonthWiseCaseTypeDetails";
import { useSelector } from "react-redux";

const CaseTypes = () => {
  const router = useRouter();
  const excludeSalesRepValueInStore = useSelector(
    (state: any) => state?.users?.excludeSalesRepValue
  );
  const [allCaseTypes, setAllCaseTypes] = useState([]);
  const [totalCaseTypesSum, setTotalCaseTypeSum] = useState<any>([]);
  const pathname = usePathname();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [totalSumValues, setTotalSumValues] = useState<any>([]);
  const [completeData, setCompleteData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  //query preparation method
  const queryPreparations = async ({
    fromDate,
    toDate,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
    general_sales_reps_exclude_count = excludeSalesRepValueInStore,
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
    if (general_sales_reps_exclude_count) {
      queryParams["general_sales_reps_exclude_count"] =
        general_sales_reps_exclude_count;
    }

    try {
      await getAllCaseTypes(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get all case types details
  const getAllCaseTypes = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await getAllCaseTypesAPI(updatedQueyParams);
      if (response?.status == 201 || response?.status == 200) {
        setCompleteData(response?.data);

        let data: any = response?.data;
        data = rearrangeDataWithCasetypes(data);

        if (queryParams.search) {
          data = data.filter((item: any) =>
            item.case_type_name
              ?.toLowerCase()
              ?.includes(queryParams.search?.toLowerCase()?.trim())
          );
        }
        data = sortAndGetData(
          data,
          queryParams.order_by,
          queryParams.order_type
        );
        const modifieData = addSerial(data, 1, data?.length);
        setAllCaseTypes(modifieData);
        calculateTableSum(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateData = ({
    search = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
    general_sales_reps_exclude_count = searchParams?.general_sales_reps_exclude_count,
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
    general_sales_reps_exclude_count: any;
  }>) => {
    setLoading(true);
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
    if (general_sales_reps_exclude_count) {
      queryParams["general_sales_reps_exclude_count"] =
        general_sales_reps_exclude_count;
    }
    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data: any = [...completeData];

    if (orderBy && orderType) {
      data = rearrangeDataWithCasetypes(data);
      data = sortAndGetData(data, orderBy, orderType);

      if (search) {
        data = data.filter((item: any) =>
          item.case_type_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    } else {
      data = [...completeData];
      data = rearrangeDataWithCasetypes(data);
      if (search) {
        data = data.filter((item: any) =>
          item.case_type_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    }

    const modifieData = addSerial(data, 1, data?.length);
    setAllCaseTypes(modifieData);
    calculateTableSum(data);
    setLoading(false);
  };

  const calculateTableSum = (data: any) => {
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
    const totalFacilitesSum = data.reduce(
      (sum: any, item: any) => sum + +item.no_of_facilities,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalFacilitesSum, dolorSymbol: false },
      { value: totalCases, dolorSymbol: false },
      { value: billedAmoumnt, dolorSymbol: true },
      { value: paidRevenueSum, dolorSymbol: true },
      { value: pendingAmoumnt, dolorSymbol: true },
    ];
    setTotalCaseTypeSum(result);
  };

  const columnDef = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      enableSorting: false,
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },

    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>CASE TYPES</span>,
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
        return <span>{getValue()?.toLocaleString()}</span>;
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
  ];

  useEffect(() => {
    queryPreparations({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
      searchValue: searchParams?.search,
      orderBy: searchParams?.order_by,
      orderType: searchParams?.order_type,
      general_sales_reps_exclude_count:
        searchParams?.general_sales_reps_exclude_count,
    });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue(
        changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
      );
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);
  return (
    <div className="caseTypesPage s-no-column">
      <div id="caseTypesTablePage">
        <CaseTypeFilters
          totalSumValues={totalCaseTypesSum}
          completeData={allCaseTypes}
          onUpdateData={onUpdateData}
          queryPreparations={queryPreparations}
          dateFilterDefaultValue={dateFilterDefaultValue}
          setDateFilterDefaultValue={setDateFilterDefaultValue}
        />
        <MultipleColumnsTableForSalesRep
          data={allCaseTypes}
          columns={columnDef}
          loading={loading}
          totalSumValues={totalCaseTypesSum}
          searchParams={searchParams}
          getData={onUpdateData}
        />

        <LoadingComponent loading={loading} />
      </div>
      <div style={{ marginTop: "30px" }}>
        <MonthWiseCaseTypeDetails
          pageName={"case-types"}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
};

export default CaseTypes;
