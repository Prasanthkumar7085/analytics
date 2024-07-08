import formatMoney from "@/lib/Pipes/moneyFormat";
import { Button } from "@mui/material";

export const BillingFacilitiesColumns = [
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
    cell: (info: any) => {
      return (
        <span
          style={{ cursor: "pointer" }}
          //   onClick={() => gotoSingleFacilityPage(info.row.original.facility_id)}
        >
          {info.row.original.facility_name}
        </span>
      );
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
    cell: (info: any) => {
      return (
        <span
          style={{ cursor: "pointer" }}
          //   onClick={() => gotoSingleSalesRepPage(info.row.original.sales_rep_id)}
        >
          {info.row.original.sales_rep_name}
        </span>
      );
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
    accessorFn: (row: any) => row.billed_cases,
    id: "billed_cases",
    header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED CASES</span>,
    width: "200px",
    maxWidth: "200px",
    minWidth: "200px",
    cell: ({ getValue }: any) => {
      return <span>{getValue() || "--"}</span>;
    },
  },
  {
    accessorFn: (row: any) => row.billed_amount,
    header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED AMOUNT</span>,
    id: "billed_amount",
    width: "200px",
    maxWidth: "200px",
    minWidth: "200px",
    cell: ({ getValue }: any) => {
      return <span>{formatMoney(getValue())}</span>;
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
          <Button className="actionButton">View</Button>
        </span>
      );
    },
  },
];
