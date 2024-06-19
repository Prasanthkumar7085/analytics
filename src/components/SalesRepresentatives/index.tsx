"use client";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getSalesRepsAPI } from "@/services/salesRepsAPIs";
import { Button, ButtonBase } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import SalesRepsFilters from "./SalesRepsFilters";
import styles from "./salesreps.module.css";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { addMonths, endOfMonth, startOfMonth } from "rsuite/esm/internals/utils/date";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { storeQueryString } from "@/Redux/Modules/marketers";

const SalesRepresentatives = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [loading, setLoading] = useState(true);
  const [totalSumValues, setTotalSumValues] = useState<any>([]);

  const [salesReps, setSalesReps] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();

  //query preparation method
  const queryPreparations = async ({
    fromDate,
    toDate,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
    status = searchParams?.status,
  }: any) => {
    let queryParams: any = {
      general_sales_reps_exclude_count: "true"
    };

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
    if (status) {
      queryParams["status"] = status;
    }
    try {
      await getAllSalesReps(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get all sales reps data event
  const getAllSalesReps = async (queryParams: any) => {
    setLoading(true);
    try {
      let { search, status, ...remaining } = queryParams
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const response = await getSalesRepsAPI(remaining);
      if (response.status == 200 || response.status == 201) {
        setCompleteData(response?.data);
        let data = response?.data;
        if (queryParams.search) {
          data = data.filter((item: any) =>
            item.sales_rep_name
              ?.toLowerCase()
              ?.includes(queryParams.search?.toLowerCase()?.trim())
          );
        }
        if (queryParams.status) {
          data = data.filter(
            (item: any) => `${item.target_reached}` == `${queryParams.status}`
          );
        }
        data = sortAndGetData(
          data,
          queryParams.order_by,
          queryParams.order_type
        );
        const modifieData = addSerial(data, 1, data?.length);
        setSalesReps(modifieData);

        setFooterValuData(data);
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
    let thisMonth = dayjs(startOfMonth(new Date())).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD') ?
      [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1)),]
      : [startOfMonth(new Date()), new Date()];

    let defaultfromDate = new Date(
      Date.UTC(
        thisMonth[0].getFullYear(),
        thisMonth[0].getMonth(),
        thisMonth[0].getDate()
      )
    )
      .toISOString()
      .substring(0, 10);
    let defaulttoDate = new Date(
      Date.UTC(
        thisMonth[1].getFullYear(),
        thisMonth[1].getMonth(),
        thisMonth[1].getDate()
      )
    )
      .toISOString()
      .substring(0, 10);

    const queryParams: any = { "from_date": defaultfromDate, "to_date": defaulttoDate };
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date") || defaultfromDate;
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date") || defaulttoDate;
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }
    dispatch(storeQueryString(queryString))
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
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
          >
            {info.row.original.sales_rep_name}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.role_id,
      id: "role_id",
      header: () => <span style={{ whiteSpace: "nowrap" }}>USER TYPE</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
          >
            {info.row.original.role_id == 1 ? "Territory Manager" : info.row.original.role_id == 2 ? "Regional Director" : "Sales Director"}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.revenue,
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITIES</span>,
      id: "facilities",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: ({ getValue }: any) => {
            return <span>{getValue()?.toLocaleString()}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.active_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIVE</span>,
          id: "active_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: (info: any) => {
            return <span>{info.getValue()?.toLocaleString()}</span>;
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.volume,
      header: () => <span style={{ whiteSpace: "nowrap" }}>VOLUME</span>,
      id: "volume",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_targets,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TARGET</span>,
          id: "total_targets",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: (info: any) => {
            return <span>{info.getValue()?.toLocaleString()}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.total_cases,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_cases",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span>{getValue()?.toLocaleString()}</span>;
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.target_reached,
      id: "target_reached",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>TARGET REACHED</span>
      ),
      footer: (props: any) => props.column.id,
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      cell: (info: any) => {
        return (
          <span
            style={{ color: `${info.getValue()}` == "true" ? "green" : "red" }}
          >{`${info.getValue() ? "Yes" : "No"}`}</span>
        );
      },
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
            onClick={() => {
              goToSingleRepPage(info.row.original.sales_rep_id)
            }}
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
    status = searchParams?.status,
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
    status: string;
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
    if (status) {
      queryParams["status"] = status;
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
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
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
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setSalesReps(modifieData);
    setFooterValuData(data);
  };

  const setFooterValuData = (data: any[]) => {
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
    const totalFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.total_facilities,
      0
    );
    const targetFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.target_facilities,
      0
    );
    const activeFacilities = data.reduce(
      (sum: any, item: any) => sum + +item.active_facilities,
      0
    );
    const targetVolume = data.reduce(
      (sum: any, item: any) => sum + +item.total_targets,
      0
    );
    const totalVolume = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalFacilities, dolorSymbol: false },
      // { value: targetFacilities, dolorSymbol: false },
      { value: activeFacilities, dolorSymbol: false },
      { value: targetVolume, dolorSymbol: false },
      { value: totalVolume, dolorSymbol: false },
      { value: null, dolorSymbol: false },
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
    <div className="s-no-column" id="salesRepsPage">
      <div className={styles.salesRepsContainer}>
        <SalesRepsFilters
          onUpdateData={onUpdateData}
          queryPreparations={queryPreparations}
          dateFilterDefaultValue={dateFilterDefaultValue}
          setDateFilterDefaultValue={setDateFilterDefaultValue}
          searchParams={searchParams}
          salesRepsData={salesReps}
          totalSumValues={totalSumValues}
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
    </div>
  );
};

export default SalesRepresentatives;
