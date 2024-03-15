"use client";
import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import MultipleColumnsTable from "../core/Table/MultitpleColumn/MultipleColumnsTable";
import { getAllCaseTypesAPI } from "@/services/caseTypesAPIs";
import { useEffect } from "react";
import { mapCaseTypeTitleWithCaseType } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import AreaGraph from "../core/AreaGraph";

const CaseTypes = () => {
  const [allCaseTypes, setAllCaseTypes] = useState([]);
  const [totalCaseTypesSum, setTotalCaseTypeSum] = useState([]);

  const getAllCaseTypes = async () => {
    try {
      const response = await getAllCaseTypesAPI();
      if (response?.status == 201 || response?.status == 200) {
        let mappedData = response?.data?.map((item: any) => {
          return {
            ...item,
            case_name: mapCaseTypeTitleWithCaseType(item?.case_type),
          };
        });
        setAllCaseTypes(mappedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columnDef = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.case_name,
        id: "case_name",
        header: () => <span style={{ whiteSpace: "nowrap" }}>CASE TYPE</span>,
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
        accessorFn: (row: any) => row,
        id: "graph",
        header: () => <span style={{ whiteSpace: "nowrap" }}>GRAPH</span>,
        footer: (props: any) => props.column.id,
        width: "100px",
        maxWidth: "100px",
        minWidth: "100px",
        cell: ({ getValue }: any) => {
          return (
            <span style={{ cursor: "pointer" }}>
              <AreaGraph graphData={getValue} />
            </span>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    getAllCaseTypes();
  }, []);
  return (
    <MultipleColumnsTable
      data={allCaseTypes}
      columns={columnDef}
      loading={false}
      totalSumValues={totalCaseTypesSum}
    />
  );
};

export default CaseTypes;
