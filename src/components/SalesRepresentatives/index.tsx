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

const SalesRepresentatives = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const marketers = useSelector((state: any) => state?.users.marketers);

  const [loading, setLoading] = useState(false);
  const [totalSumValues, setTotalSumValues] = useState<(string | number)[]>([]);

  const [salesReps, setSalesReps] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const getUsersFromLabsquire = async () => {
    try {
      const userData = await getAllUsersAPI();
      if (userData?.status == 201 || userData?.status == 200) {
        dispatch(setAllMarketers(userData?.data));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getAllSalesReps = async ({}) => {
    setLoading(true);
    try {
      const response = await salesRepsAPI();

      if (response.status == 200 || response.status == 201) {
        let mappedData = response?.data?.map(
          (item: { marketer_id: string }) => {
            return {
              ...item,
              marketer_name: mapSalesRepNameWithId(item?.marketer_id),
            };
          }
        );
        setSalesReps(mappedData);
        setCompleteData(mappedData);
        onUpdateData({}, mappedData);
        let totalCases = 0;
        let paidRevenueSum = 0;
        let targeted_amount = 0;
        let billedAmoumnt = 0;
        let pendingAmoumnt = 0;

        response?.data?.forEach((entry: any) => {
          (totalCases += entry.total_cases),
            (targeted_amount += entry.targeted_amount),
            (paidRevenueSum += entry.paid_amount);
          billedAmoumnt += entry.total_amount;
          pendingAmoumnt += entry.pending_amount;
        });

        const result = [
          "Total",
          totalCases,
          targeted_amount,
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
        accessorFn: (row: any) => row.marketer_name,
        id: "marketer_name",
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
          {
            accessorFn: (row: any) => row.targeted_amount,
            id: "targeted_amount",
            header: () => (
              <span style={{ whiteSpace: "nowrap" }}>TARGETED</span>
            ),
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.total_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
            id: "total_amount",
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
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
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.pending_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
            id: "pending_amount",
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
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
        width: "220px",
        maxWidth: "220px",
        minWidth: "220px",
        cell: ({ getValue }: any) => {
          if (getValue()) return <span>Yes</span>;
          else return <span>No</span>;
        },
      },
      {
        accessorFn: (row: any) => row?._id,
        id: "actions",
        header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
        footer: (props: any) => props.column.id,
        width: "200px",
        maxWidth: "200px",
        minWidth: "200px",
        cell: (info: any) => {
          return (
            <Button
              className="actionButton"
              onClick={() => {
                router.push(
                  `/sales-representatives/${info.row.original.marketer_id}`
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

    if (status && status != "all") {
      queryParams["status"] = status;
    }
    if (search) {
      queryParams["search"] = search;
    }
    router.push(`${prepareURLEncodedParams(pathname, queryParams)}`);

    let data: any = [...completeData];
    if (!completeData?.length) {
      if (testData?.length) {
        data = [...testData];
      } else return;
    }
    if (status && status !== "all") {
      let statusValue = status == "yes" ? true : false;
      data = data.filter((item: any) => item.target_reached == statusValue);
      setSalesReps(data);
    }
    if (search) {
      data = data.filter((item: any) =>
        item.marketer_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase()?.trim())
      );
    }

    setSalesReps(data);

    let totalCases = 0;
    let paidRevenueSum = 0;
    let targeted_amount = 0;
    let billedAmoumnt = 0;
    let pendingAmoumnt = 0;

    data?.forEach((entry: any) => {
      (totalCases += entry.total_cases),
        (targeted_amount += entry.targeted_amount),
        (paidRevenueSum += entry.paid_amount);
      billedAmoumnt += entry.total_amount;
      pendingAmoumnt += entry.pending_amount;
    });

    const result = [
      "Total",
      totalCases,
      targeted_amount,
      billedAmoumnt,
      paidRevenueSum,
      pendingAmoumnt,
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    if (!marketers?.length) {
      getUsersFromLabsquire();
    }
    getAllSalesReps({});
  }, []);
  return (
    <div className={styles.salesRepsContainer}>
      <SalesRepsFilters onUpdateData={onUpdateData} />
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
