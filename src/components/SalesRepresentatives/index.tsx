"use client";
import { setAllMarketers } from "@/Redux/Modules/marketers";
import { mapSalesRepNameWithId } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { getAllUsersAPI } from "@/services/authAPIs";
import { salesRepsAPI } from "@/services/salesRepsAPIs";
import { Button } from "@mui/material";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTable from "../core/Table/MultitpleColumn/MultipleColumnsTable";
import SalesRepsFilters from "./SalesRepsFilters";
import styles from "./salesreps.module.css";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { stat } from "fs";
import formatMoney from "@/lib/Pipes/moneyFormat";

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
  const [totalSumValues, setTotalSumValues] = useState<(string | number)[]>([]);

  const [salesReps, setSalesReps] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>()

  const getAllSalesReps = async ({ fromDate, toDate }: any) => {
    setLoading(true);
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const response = await salesRepsAPI(queryParams);

      if (response.status == 200 || response.status == 201) {
        setSalesReps(response?.data);
        setCompleteData(response?.data);
        // onUpdateData({}, response?.data);

        const totalCases = response?.data.reduce(
          (sum: any, item: any) => sum + +item.total_cases,
          0
        );
        const targeted_amount = response?.data.reduce(
          (sum: any, item: any) => sum + +item.expected_amount,
          0
        );

        const billedAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.generated_amount,
          0
        );
        const paidRevenueSum = response?.data.reduce(
          (sum: any, item: any) => sum + +item.paid_amount,
          0
        );
        const pendingAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.pending_amount,
          0
        );

        const result = [
          "Total",
          totalCases,
          billedAmoumnt,
          paidRevenueSum,
          pendingAmoumnt,
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
  const columnDef = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.sales_rep_name,
        id: "sales_rep_name",
        header: () => (
          <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>
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
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row._id,
        header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
        id: "revenue",
        width: "800px",
        columns: [
          // {
          //   accessorFn: (row: any) => row.expected_amount,
          //   id: "expected_amount",
          //   header: () => (
          //     <span style={{ whiteSpace: "nowrap" }}>TARGETED</span>
          //   ),
          //   width: "200px",
          //   maxWidth: "200px",
          //   minWidth: "200px",
          //   Cell: ({ getValue }: any) => {
          //     return <span>{getValue()}</span>;
          //   },
          // },
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
            header: () => (
              <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>
            ),
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
      // {
      //   accessorFn: (row: any) => row.target_reached,
      //   id: "target_reached",
      //   header: () => (
      //     <span style={{ whiteSpace: "nowrap" }}>TARGET REACHED</span>
      //   ),
      //   footer: (props: any) => props.column.id,
      //   width: "120px",
      //   maxWidth: "120px",
      //   minWidth: "120px",
      //   cell: (info: any) => {
      //     if (info.row.original.paid_amount == info.row.original.expected_amount) {
      //       return <span>Yes</span>;
      //     }
      //     else return <span>No</span>;
      //   },
      // },
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
                let queryString = prepareURLEncodedParams("", Object.fromEntries(new URLSearchParams(Array.from(params.entries()))));
                router.push(
                  `/sales-representatives/${info.row.original.sales_rep_id}${queryString}`
                );
              }}
            >
              view
            </Button>
          );
        },
      },
    ],
    []
  );



  const onUpdateData = (
    {
      status = params.get("status") as string,
      search = params.get("search") as string,
    }: Partial<{
      status: string;
      search: string;
    }>,
    testData?: any[]
  ) => {
    let queryParams: any = {};

    if (search) {
      queryParams["search"] = search;
    }

    let data: any = [...completeData];
    if (!completeData?.length) {
      if (testData?.length) {
        data = [...testData];
      } else return;
    }

    if (search) {
      data = data.filter((item: any) =>
        item.sales_rep_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase()?.trim())
      );
    }

    setSalesReps(data);

    const totalCases = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );
    const targeted_amount = data.reduce(
      (sum: any, item: any) => sum + +item.expected_amount,
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
      "Total",
      totalCases,
      billedAmoumnt,
      paidRevenueSum,
      pendingAmoumnt,
    ];

    setTotalSumValues(result);
  };

  useEffect(() => {
    getAllSalesReps({ fromDate: searchParams?.from_date, toDate: searchParams?.to_date });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue([new Date(searchParams?.from_date), new Date(searchParams?.to_date)])
    }
  }, []);


  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div className={styles.salesRepsContainer}>
      <SalesRepsFilters
        onUpdateData={onUpdateData}
        getAllSalesReps={getAllSalesReps}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
      />
      <MultipleColumnsTable
        data={salesReps}
        columns={columnDef}
        loading={loading}
        totalSumValues={totalSumValues}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default SalesRepresentatives;
