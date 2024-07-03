import { graphColors } from "@/lib/constants";
import styles from "/src/components/DashboardPage/CaseType/index.module.css";
import formatMoney from "@/lib/Pipes/moneyFormat";

export const VolumecolumnsWithDayWiseTargets = [
  {
    accessorFn: (row: any) => row.case_type_name,
    id: "case_type_name",
    header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
    cell: (info: any, index: number) => {
      return (
        <span className={styles.caseTypeRow}>
          <div
            className={styles.dot}
            style={{ backgroundColor: graphColors[info.getValue()] }}
          ></div>
          {info.getValue()}
        </span>
      );
    },
    footer: (props: any) => props.column.id,
    width: "200px",
    minWidth: "60px",
    maxWidth: "60px",
  },

  {
    accessorFn: (row: any) => row.total_targets,
    id: "total_targets",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>MONTH TARGET</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },

  {
    accessorFn: (row: any) => row.dayTargets,
    id: "dayTargets",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>TARGET</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.total_cases,
    id: "total_cases",
    cell: (info: any) => (
      <span className={styles.totalCasesRow} style={{ color: "#5b5b5b" }}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    sortDescFirst: false,
    header: () => <span className={styles.tableHeading}>TOTAL</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
];

export const VolumecolumnsTargets = [
  {
    accessorFn: (row: any) => row.case_type_name,
    id: "case_type_name",
    header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
    cell: (info: any, index: number) => {
      return (
        <span className={styles.caseTypeRow}>
          <div
            className={styles.dot}
            style={{ backgroundColor: graphColors[info.getValue()] }}
          ></div>
          {info.getValue()}
        </span>
      );
    },
    footer: (props: any) => props.column.id,
    width: "200px",
    minWidth: "60px",
    maxWidth: "60px",
  },

  {
    accessorFn: (row: any) => row.total_targets,
    id: "total_targets",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>TOTAL TARGET</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.total_cases,
    id: "total_cases",
    cell: (info: any) => (
      <span className={styles.totalCasesRow} style={{ color: "#5b5b5b" }}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    sortDescFirst: false,
    header: () => <span className={styles.tableHeading}>TOTAL</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
];

export const VolumecolumnsForFacilities = [
  {
    accessorFn: (row: any) => row.case_type_name,
    id: "case_type_name",
    header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
    cell: (info: any, index: number) => {
      return (
        <span className={styles.caseTypeRow}>
          <div
            className={styles.dot}
            style={{ backgroundColor: graphColors[info.getValue()] }}
          ></div>
          {info.getValue()}
        </span>
      );
    },
    footer: (props: any) => props.column.id,
    width: "200px",
    minWidth: "60px",
    maxWidth: "60px",
  },
  {
    accessorFn: (row: any) => row.total_cases,
    id: "total_cases",
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    sortDescFirst: false,
    header: () => <span className={styles.tableHeading}>TOTAL</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },

  {
    accessorFn: (row: any) => row.completed_cases,
    id: "completed_cases",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>FINALIZED</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.pending_cases,
    id: "pending_cases",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.revenueBlock}>
        {info.getValue()?.toLocaleString()}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>PENDING</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
];

export const RevenueOverViewcolumns = [
  {
    accessorFn: (row: any) => row.case_type_name,
    id: "case_type_name",
    header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
    cell: (info: any, index: number) => {
      return (
        <span className={styles.caseTypeRow}>
          <div
            className={styles.dot}
            style={{ backgroundColor: graphColors[info.getValue()] }}
          ></div>
          {info.getValue()}
        </span>
      );
    },
    footer: (props: any) => props.column.id,
    width: "200px",
    minWidth: "60px",
    maxWidth: "60px",
  },
  {
    accessorFn: (row: any) => row.generated_amount,
    id: "generated_amount",
    sortDescFirst: false,
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {formatMoney(info.getValue())}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>BILLED CASES</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.paid_amount,
    sortDescFirst: false,
    id: "paid_amount",
    cell: (info: any) => (
      <span className={styles.totalCasesRow}>
        {formatMoney(info.getValue())}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>BILLED AMOUNT</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.pending_amount,
    sortDescFirst: false,
    id: "pending_amount",
    cell: (info: any) => (
      <span className={styles.revenueBlock}>
        {formatMoney(info.getValue())}
      </span>
    ),
    header: () => <span className={styles.tableHeading}>ARREARS</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
];
