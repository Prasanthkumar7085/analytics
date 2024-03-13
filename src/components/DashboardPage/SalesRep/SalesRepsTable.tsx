"use client";

import { setAllMarketers } from "@/Redux/Modules/marketers";
import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import { mapSalesRepNameWithId } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { getAllUsersAPI } from "@/services/authAPIs";
import { salesRepsAPI } from "@/services/salesRepsAPIs";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sales-rep.module.css";
import { IconButton } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/navigation";
const SalesRepsTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const marketers = useSelector((state: any) => state?.users.marketers);
console.log(marketers, "asdf");

const [salesReps, setSalesReps] = useState([]);
const [totalRevenueSum, setTotalSumValues] = useState<any>([]);

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
  try {
    const response = await salesRepsAPI();

    if (response.status == 200 || response.status == 201) {
      let mappedData = response?.data?.map((item: { marketer_id: string }) => {
        return {
          ...item,
          marketer_name: mapSalesRepNameWithId(item?.marketer_id),
        };
      });

      let totalCases = 0;
      let paidRevenueSum = 0;
      let totalRevenueSum = 0;
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
      setSalesReps(mappedData);
    } else {
      throw response;
    }
  } catch (err) {
    console.error(err);
  }
};

const columnDef = useMemo(
  () => [
    {
      accessorFn: (row: any) => row.marketer_name,
      id: "marketer_name",
      header: () => (
        <span className={styles.salesTableHeading}>MARKETER NAME</span>
      ),
      footer: (props: any) => props.column.id,
      width: "170px",
      maxWidth: "170px",
      minWidth: "170px",
      cell: ({ getValue }: any) => {
        return <span>{getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      header: () => (
        <span className={styles.salesTableHeading}>TOTAL CASES</span>
      ),
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: ({ getValue }: any) => {
        return <span className={styles.totalCasesRow}>{getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row._id,
      header: () => <span className={styles.salesTableHeading}>REVENUE</span>,
      id: "revenue",
      width: "800",
      maxWidth: "800",
      minWidth: "800",
      columns: [
        {
          accessorFn: (row: any) => row.targeted_amount,
          id: "targeted_amount",
          header: () => (
            <span className={styles.salesTableHeading}>TARGETED</span>
          ),
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span className={styles.targetedRow}>{getValue()}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.total_amount,
          header: () => (
            <span className={styles.salesTableHeading}>BILLED</span>
          ),
          id: "total_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return <span className={styles.billedRow}>{getValue()}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.paid_amount,
          header: () => (
            <span className={styles.salesTableHeading}>RECEIVED</span>
          ),
          id: "paid_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return <span className={styles.receivedRow}>{getValue()}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.pending_amount,
          header: () => (
            <span className={styles.salesTableHeading}>ARREARS</span>
          ),
          id: "pending_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return <span className={styles.arrearsRow}>{getValue()}</span>;
          },
        },
      ],
    },

    {
      accessorFn: (row: any) => row?._id,
      id: "actions",
      header: () => <span className={styles.salesTableHeading}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: ({ getValue }: any) => {
        return <span>{getValue()}</span>;
      },
    },
  ],
  []
);
useEffect(() => {
  if (!marketers?.length) {
    getUsersFromLabsquire();
  }
  getAllSalesReps({});
}, []);
return (
  <div
    style={{ height: "386px", width: "100%", overflow: "auto" }}
    className="table"
  >
    <MultipleColumnsTable
      data={salesReps}
      totalSumValues={totalRevenueSum}
      columns={columnDef}
      loading={false}
    />
  </div>
);
};

export default SalesRepsTable;
