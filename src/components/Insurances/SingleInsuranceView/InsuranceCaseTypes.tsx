import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
const InsuranceCaseTypes = ({
  searchParams,
  insuranceData,
  totalInsurancePayors,
  loading,
}: any) => {

  const columns = [
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
        (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1,
    },
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
      sortDescFirst: false,
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
      sortDescFirst: false,
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
      sortDescFirst: false,
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
      sortDescFirst: false,
      header: () => <span style={{ whiteSpace: "nowrap" }}>EXPECTED</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return (
          <span style={{ color: "green" }}>{formatMoney(getValue())}</span>
        );
      },
    },

    {
      accessorFn: (row: any) => row.paid_amount,
      id: "paid_amount",
      sortDescFirst: false,
      header: () => <span style={{ whiteSpace: "nowrap" }}>CLEARED BILL</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: (info: any) => {
        return (
          <span
            style={{
              color:
                info.row.original.paid_amount ==
                  info.row.original.expected_amount
                  ? "green"
                  : "red",
            }}
          >
            {formatMoney(info.row.original.paid_amount)}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.pending_cases,
      id: "pending_cases",
      sortDescFirst: false,
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
      sortDescFirst: false,
      header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING REV</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return (
          <span style={{ color: getValue() == 0 ? "" : "red" }}>
            {formatMoney(getValue())}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.pending_amount,
      id: "actions",
      enableSorting: false,
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>PAID PRICE/TARGET PRICE</span>
      ),
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: (info: any) => {
        return (
          <span>
            {formatMoney(info.row.original.paid_amount) +
              " / " +
              formatMoney(info.row.original.expected_amount)}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div className="eachDataCard s-no-column" id="insuranceCaseTypesData">
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
            loading={loading}
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
