import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { getInsurancesCaseTypesAPI } from "@/services/insurancesAPI";
import { Backdrop } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
const InsuranceCaseTypes = ({
  searchParams,
  insuranceData,
  totalInsurancePayors,
  loading,
}: any) => {
  const { id } = useParams();
  const router = useRouter();

  const columns = [
    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
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
      header: () => <span style={{ whiteSpace: "nowrap" }}>VOLUME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue().toLocaleString()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.completed_cases,
      id: "completed_cases",
      header: () => <span style={{ whiteSpace: "nowrap" }}>CLEARED VOL</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue().toLocaleString()}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.generated_amount,
      id: "generated_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span>{formatMoney(getValue())}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.expected_amount,
      id: "expected_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>EXPECTED</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span style={{ color: "green" }}>{formatMoney(getValue())}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.paid_amount,
      id: "paid_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>CLEARED BILL</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: (info: any) => {
        return <span style={{ color: info.row.original.paid_amount == info.row.original.expected_amount ? "green" : "red" }}>{formatMoney(info.row.original.paid_amount)}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.pending_cases,
      id: "pending_cases",
      header: () => <span style={{ whiteSpace: "nowrap" }}>PEN VOL</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span>{getValue().toLocaleString()}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.pending_amount,
      id: "pending_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING REV</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span style={{ color: getValue() == 0 ? "" : "red" }}>{formatMoney(getValue())}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.pending_amount,
      id: "clearence_rate",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>REV CLEARANCE RATE</span>
      ),
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: (info: any) => {
        return (
          <span>
            {(
              (info.row.original.paid_amount /
                info.row.original.expected_amount) *
              100
            ).toFixed(2)}
            %
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.pending_amount,
      id: "clearence_rate",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>PAID PRICE/TARGET PRICE</span>
      ),
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: (info: any) => {
        return <span>{formatMoney(info.row.original.paid_amount) + "/" + formatMoney(info.row.original.expected_amount)}</span>;
      },
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div className="eachDataCard" id="insuranceCaseTypesData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Case Types
          </h3>
        </div>
        <div className="cardBody">
          <SingleColumnTable
            data={insuranceData}
            columns={columns}
            totalSumValues={totalInsurancePayors}
            loading={false}
          />

          {loading ? (
            <Backdrop
              open={true}
              style={{
                zIndex: 999,
                color: "red",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(256,256,256,0.8)",
              }}
            >
              <object
                type="image/svg+xml"
                data={"/core/loading.svg"}
                width={150}
                height={150}
              />
            </Backdrop>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default InsuranceCaseTypes;
