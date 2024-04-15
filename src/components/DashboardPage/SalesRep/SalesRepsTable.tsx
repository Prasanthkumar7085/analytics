"use client";

import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import styles from "./sales-rep.module.css";
const SalesRepsTable = ({ salesReps, totalRevenueSum, loading, fromDate, toDate }: any) => {
  const router = useRouter();

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
      cell: ({ row, table }: any) =>
        (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1
    },
    {
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => (
        <span className={styles.salesTableHeading}>MARKETER NAME</span>
      ),
      footer: (props: any) => props.column.id,
      width: "170px",
      maxWidth: "170px",
      minWidth: "170px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }}
          onClick={() => {
            goToSingleRepPage(info.row.original.sales_rep_id)
          }}>{info.row.original.sales_rep_name}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      header: () => (
        <span className={styles.salesTableHeading}>TOTAL CASES</span>
      ),
      sortDescFirst: false,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: ({ getValue }: any) => {
        return (
          <span className={styles.totalCasesRow}>
            {getValue()?.toLocaleString()}
          </span>
        );
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
          accessorFn: (row: any) => row.expected_amount,
          id: "expected_amount",
          sortDescFirst: false,
          header: () => (
            <span className={styles.salesTableHeading}>TARGETED</span>
          ),
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return (
              <span className={styles.targetedRow}>
                {formatMoney(getValue())}
              </span>
            );
          },
        },
        {
          accessorFn: (row: any) => row.generated_amount,
          sortDescFirst: false,
          header: () => (
            <span className={styles.salesTableHeading}>BILLED</span>
          ),
          id: "generated_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return (
              <span className={styles.billedRow}>
                {formatMoney(getValue())}
              </span>
            );
          },
        },
        {
          accessorFn: (row: any) => row.paid_amount,
          sortDescFirst: false,
          header: () => (
            <span className={styles.salesTableHeading}>RECEIVED</span>
          ),
          id: "paid_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return (
              <span className={styles.receivedRow}>
                {formatMoney(getValue())}
              </span>
            );
          },
        },
        {
          accessorFn: (row: any) => row.pending_amount,
          sortDescFirst: false,
          header: () => (
            <span className={styles.salesTableHeading}>ARREARS</span>
          ),
          id: "pending_amount",
          width: "200",
          maxWidth: "200",
          minWidth: "200",
          cell: ({ getValue }: any) => {
            return (
              <span className={styles.arrearsRow}>
                {formatMoney(getValue())}
              </span>
            );
          },
        },
      ],
    },

    {
      accessorFn: (row: any) => row?._id,
      id: "actions",
      header: () => <span className={styles.salesTableHeading}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "80px",
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
            View
          </Button>

        );
      },
    },
  ];

  const goToSingleRepPage = (repId: string) => {
    let queryString = "";
    const queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }

    router.push(`/sales-representatives/${repId}${queryString}`);
  };

  return (
    <div
      style={{ height: "386px", width: "100%", overflow: "auto" }}
      className="table"
    >
      <MultipleColumnsTable
        data={salesReps}
        totalSumValues={totalRevenueSum}
        columns={columnDef}
        loading={loading}
      />
    </div>
  );
};

export default SalesRepsTable;
