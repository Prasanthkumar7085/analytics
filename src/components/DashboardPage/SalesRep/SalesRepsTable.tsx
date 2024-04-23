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
       header: () => <span>S.No</span>,
       footer: (props: any) => props.column.id,
       width: "60px",
       minWidth: "60px",
       maxWidth: "60px",
     },
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
         //  {
         //    accessorFn: (row: any) => row.target_facilities,
         //    header: () => <span style={{ whiteSpace: "nowrap" }}>TARGET</span>,
         //    id: "target_facilities",
         //    width: "300px",
         //    maxWidth: "300px",
         //    minWidth: "300px",
         //    cell: (info: any) => {
         //      return <span>{info.getValue()?.toLocaleString()}</span>;
         //    },
         //  },
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

     //  {
     //    accessorFn: (row: any) => row.revenue,
     //    header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
     //    id: "revenue",
     //    width: "800px",
     //    columns: [
     //      {
     //        accessorFn: (row: any) => row.generated_amount,
     //        header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
     //        id: "generated_amount",
     //        width: "200px",
     //        maxWidth: "200px",
     //        minWidth: "200px",
     //        cell: ({ getValue }: any) => {
     //          return <span>{formatMoney(getValue())}</span>;
     //        },
     //      },
     //      {
     //        accessorFn: (row: any) => row.paid_amount,
     //        header: () => <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>,
     //        id: "paid_amount",
     //        width: "200px",
     //        maxWidth: "200px",
     //        minWidth: "200px",
     //        cell: (info: any) => {
     //          return <span>{formatMoney(info.getValue())}</span>;
     //        },
     //      },
     //      {
     //        accessorFn: (row: any) => row.pending_amount,
     //        header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
     //        id: "pending_amount",
     //        width: "200px",
     //        maxWidth: "200px",
     //        minWidth: "200px",
     //        cell: (info: any) => {
     //          return <span>{formatMoney(info.getValue())}</span>;
     //        },
     //      },
     //    ],
     //  },
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
             onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
           >
             view
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
