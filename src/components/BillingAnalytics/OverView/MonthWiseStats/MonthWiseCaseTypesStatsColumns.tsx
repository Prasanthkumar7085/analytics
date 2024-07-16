import AreaGraph from "@/components/core/AreaGraph";
import AreaGraphForBillingAndRevenue from "@/components/core/AreaGraph/AreaGraphForBillingAndRevenue";
import { graphColors } from "@/lib/constants";
import {
  formatMonthYear,
  getAcesdingOrderMonthsForGraphs,
} from "@/lib/helpers/apiHelpers";
import formatMoney from "@/lib/Pipes/moneyFormat";

const MonthWiseCaseTypesBilledStatsColumns = () => {
  return [
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
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1,
    },

    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>Case Types</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }}>{info.getValue()}</span>;
      },
    },
  ];
};

const MonthWiseInsuranceBilledStatsColumns = () => {
  return [
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
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1,
    },

    {
      accessorFn: (row: any) => row.insurance_name,
      id: "insurance_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>Insurance</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }}>{info.getValue()}</span>;
      },
    },
  ];
};

const MonthWiseCaseTypesBilledStatsGraphColumn = ({
  setGraphDialogOpen,
  setSelectedGraphData,
  setGraphValuesData,
  setGraphColor,
  searchParams,
}: any) => {
  return [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      enableSorting: false,
      header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
      footer: (props: any) => props.column.id,
      width: "100px",

      cell: (info: any) => {
        let data = { ...info.row.original };
        delete data?.case_type_id;
        delete data?.case_type_name;
        delete data?.serial;
        delete data?.rowTotal;
        delete data?.insurance_name;
        delete data?.insurance_id;
        let rearrangeData = getAcesdingOrderMonthsForGraphs(data);

        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setGraphDialogOpen(true);
              setSelectedGraphData(info.row.original);
              setGraphValuesData(rearrangeData);
              setGraphColor(graphColors[info.row.original.case_type_name]);
            }}
          >
            <AreaGraphForBillingAndRevenue
              data={rearrangeData}
              graphColor={graphColors[info.row.original.case_type_name]}
              tabValue={searchParams?.tab}
            />
          </div>
        );
      },
    },
  ];
};

const MonthWiseCaseTypesBilledStatsAdditionalColumns = ({
  headerMonths,
}: any) => {
  let addtionalcolumns = headerMonths?.map((item: any) => ({
    accessorFn: (row: any) => row[item],
    id: item,
    header: () => (
      <span style={{ whiteSpace: "nowrap" }}>{formatMonthYear(item)}</span>
    ),
    footer: (props: any) => props.column.id,
    width: "80px",
    maxWidth: "220px",
    minWidth: "220px",
    sortDescFirst: false,
    sortingFn: (rowA: any, rowB: any, columnId: any) => {
      const rowDataA = rowA.original[columnId];
      const rowDataB = rowB.original[columnId];

      const valueA = rowDataA[0] || 0;
      const valueB = rowDataB[0] || 0;

      return valueA - valueB;
    },
    columns: [
      {
        accessorFn: (row: any) => row?.[item][0],
        header: () => <span style={{ whiteSpace: "nowrap" }}>Cases</span>,
        id: item[0],
        width: "300px",
        maxWidth: "300px",
        minWidth: "300px",
        cell: (info: any) => {
          return (
            <span>{info.row.original?.[item]?.[0]?.toLocaleString() || 0}</span>
          );
        },
      },
      {
        accessorFn: (row: any) => row?.[item][1],
        header: () => <span style={{ whiteSpace: "nowrap" }}>Billed</span>,
        id: item[1],
        width: "300px",
        maxWidth: "300px",
        minWidth: "300px",
        cell: (info: any) => {
          return <span>{formatMoney(info.row.original?.[item]?.[1])}</span>;
        },
      },
    ],
  }));
  return addtionalcolumns;
};

const MonthWiseCaseTypesRevenueStatsAdditionalColumns = ({
  headerMonths,
}: any) => {
  let addtionalcolumns = headerMonths?.map((item: any) => ({
    accessorFn: (row: any) => row[item],
    id: item,
    header: () => (
      <span style={{ whiteSpace: "nowrap" }}>{formatMonthYear(item)}</span>
    ),
    footer: (props: any) => props.column.id,
    width: "80px",
    maxWidth: "220px",
    minWidth: "220px",
    sortDescFirst: true,
    sortingFn: (rowA: any, rowB: any, columnId: any) => {
      const rowDataA = rowA.original[columnId];
      const rowDataB = rowB.original[columnId];

      const valueA = rowDataA[0] || 0;
      const valueB = rowDataB[0] || 0;

      return valueB - valueA;
    },
    columns: [
      {
        accessorFn: (row: any) => row?.[item],
        header: () => <span style={{ whiteSpace: "nowrap" }}>Target</span>,
        id: item[0],
        width: "300px",
        maxWidth: "300px",
        minWidth: "300px",
        cell: (info: any) => {
          return <span>{formatMoney(info.row.original?.[item]?.[0])}</span>;
        },
      },
      {
        accessorFn: (row: any) => row?.[item],
        header: () => <span style={{ whiteSpace: "nowrap" }}>Received</span>,
        id: item[1],
        width: "300px",
        maxWidth: "300px",
        minWidth: "300px",
        cell: (info: any) => {
          return <span>{formatMoney(info.row.original?.[item]?.[1])}</span>;
        },
      },
    ],
  }));
  return addtionalcolumns;
};

export const groupAllBilledAndRevenueColumns = ({
  headerMonths,
  setGraphDialogOpen,
  setSelectedGraphData,
  setGraphValuesData,
  setGraphColor,
  searchParams,
  tableType,
}: any) => {
  let GroupdBilledColmns = MonthWiseCaseTypesBilledStatsAdditionalColumns({
    headerMonths,
  });
  let GroupdRevenueColmns = MonthWiseCaseTypesRevenueStatsAdditionalColumns({
    headerMonths,
  });
  let GraphColumn = MonthWiseCaseTypesBilledStatsGraphColumn({
    setGraphDialogOpen,
    setSelectedGraphData,
    setGraphValuesData,
    setGraphColor,
    searchParams,
  });
  let GroupdColmns =
    searchParams?.tab == "billed" ? GroupdBilledColmns : GroupdRevenueColmns;
  let NormalColumns =
    tableType == "insurance"
      ? MonthWiseInsuranceBilledStatsColumns()
      : MonthWiseCaseTypesBilledStatsColumns();
  return [...NormalColumns, ...GroupdColmns, ...GraphColumn];
};
