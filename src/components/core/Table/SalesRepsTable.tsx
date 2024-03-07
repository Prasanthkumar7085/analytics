"use client";

import { salesRepsAPI } from "@/services/salesRepsAPIs";
import TanStackTableComponent from "./Table";
import { useEffect, useMemo, useState } from "react";

const SalesRepsTable = () => {
  const [salesReps, setSalesReps] = useState([]);
  const getAllSalesReps = async ({}) => {
    try {
      const response = await salesRepsAPI();
      console.log(response);

      if (response.status == 200 || response.status == 201) {
        setSalesReps(response?.data);
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
        accessorFn: (row: any) => row.marketer_id,
        id: "marketer_id",
        header: () => (
          <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>
        ),
        footer: (props: any) => props.column.id,
        width: "120px",
        maxWidth: "120px",
        minWidth: "120px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.total_cases,
        id: "total_cases",
        header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL CASES</span>,
        footer: (props: any) => props.column.id,
        width: "120px",
        maxWidth: "120px",
        minWidth: "120px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row._id,
        header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
        id: "revenue",
        columns: [
          {
            accessorFn: (row: any) => row.targeted_amount,
            id: "targeted_amount",
            header: () => (
              <span style={{ whiteSpace: "nowrap" }}>TARGETED</span>
            ),
            width: "120px",
            maxWidth: "120px",
            minWidth: "120px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.total_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
            id: "total_amount",
            width: "120px",
            maxWidth: "120px",
            minWidth: "120px",
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
            width: "120px",
            maxWidth: "120px",
            minWidth: "120px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.pending_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
            id: "pending_amount",
            width: "120px",
            maxWidth: "120px",
            minWidth: "120px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
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
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
    ],
    []
  );

  useEffect(() => {
    console.log("testin");
    getAllSalesReps({});
  }, []);
  return (
    <div>
      <TanStackTableComponent
        data={salesReps}
        columns={columnDef}
        loading={false}
        getData={getAllSalesReps}
      />
    </div>
  );
};

export default SalesRepsTable;
