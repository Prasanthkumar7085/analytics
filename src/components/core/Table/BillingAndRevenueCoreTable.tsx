import formatMoney from "@/lib/Pipes/moneyFormat";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { getAcesdingOrderMonthsForGraphs } from "@/lib/helpers/apiHelpers";
import AreaGraph from "../AreaGraph";
import AreaGraphForFacilities from "../AreaGraph/AreaGraphForFacilities";
import GraphDialog from "../GraphDialog";

interface pageProps {
  columns: any;
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  headerMonths: any;
  tabValue: string;
  rowTotalSum?: any;
}
const BillingAndRevenueCoreTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  headerMonths,
  tabValue,
  rowTotalSum,
}) => {
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const pathName = usePathname();
  const table: any = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  let removeSortingForColumnIds = [
    "id",
    "actions",
    "1_revenue_generated_amount",
    "1_",
    "1_Jul2024_Jul2024",
  ];

  const useParams = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
  );

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
    );
  }, [useParams]);

  const getWidth = (id: string) => {
    const widthObj = columns.find((item: any) => item.id == id);
    const width = widthObj?.width;
    return width;
  };

  return (
    <div
      className="tableContainer"
      style={{ width: "100%", overflowX: "auto" }}
    >
      <table style={{ width: "100%" }}>
        <thead
          className="thead"
          style={{
            height: "32px",
            position: "sticky",
            top: "0px",
            zIndex: "2",
            color: "white",
          }}
        >
          {table
            .getHeaderGroups()
            .map((headerGroup: any, mainIndex: number) => (
              <tr className="table-row" key={headerGroup.id}>
                {headerGroup.headers.map((header: any, index: number) => {
                  console.log(header, "Fdajdskkdi");
                  return (
                    <th
                      className="cell"
                      key={index}
                      colSpan={header.colSpan}
                      style={{
                        minWidth: getWidth(header.id),
                        width: getWidth(header.id),
                        color: "#000",
                        background: "#F0EDFF",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          style={{
                            display: "flex",
                            gap: "10px",
                            cursor: "pointer",
                            minWidth: getWidth(header.id),
                            width: getWidth(header.id),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <Image
                                src="/core/sort/sort-asc.svg"
                                height={8}
                                width={8}
                                alt="image"
                                style={{
                                  display:
                                    removeSortingForColumnIds?.includes(
                                      header.id
                                    ) || header.colSpan == 2
                                      ? "none"
                                      : "",
                                }}
                              />
                            ),
                            desc: (
                              <Image
                                src="/core/sort/sort-desc.svg"
                                height={8}
                                width={8}
                                alt="image"
                                style={{
                                  display:
                                    removeSortingForColumnIds?.includes(
                                      header.id
                                    ) || header.colSpan == 2
                                      ? "none"
                                      : "",
                                }}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <Image
                              src="/core/sort/un-sort.svg"
                              height={8}
                              width={8}
                              alt="Unsorted"
                              style={{
                                display:
                                  removeSortingForColumnIds?.includes(
                                    header.id
                                  ) || header.colSpan == 2
                                    ? "none"
                                    : "",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
        </thead>
        <tbody className="tbody">
          {data?.length ? (
            table.getRowModel().rows.map((row: any, mainIndex: number) => {
              return (
                <tr className="table-row" key={mainIndex}>
                  {row.getVisibleCells().map((cell: any, index: number) => {
                    return (
                      <td
                        className="cell"
                        key={index}
                        style={{
                          width: "100%",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : !loading ? (
            <tr>
              <td colSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40vh",
                  }}
                >
                  <Image
                    src="/NoDataImageAnalytics.svg"
                    alt=""
                    height={150}
                    width={250}
                  />
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40vh",
                  }}
                ></div>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="tfoot">
          <tr
            className="table-row"
            style={{
              fontSize: "clamp(12px, 0.62vw, 14px)",
              border: "1px solid #a5a5a5",
              textTransform: "uppercase",
              fontWeight: "600",
              color: "#1B2459",
              background: "#EFF1FA",
            }}
          >
            <td className="cell">Total</td>
            <td className="cell"></td>

            {headerMonths?.map((item: any, index: number) => {
              return (
                <>
                  <td
                    key={index}
                    className="cell"
                    style={{ cursor: "pointer" }}
                  >
                    {tabValue == "revenue"
                      ? formatMoney(totalSumValues?.[item]?.[0])
                      : totalSumValues[item]?.[0]?.toLocaleString()}
                  </td>
                  <td className="cell">
                    {formatMoney(totalSumValues?.[item]?.[1])}
                  </td>
                </>
              );
            })}

            <td
              className="cell"
              onClick={() => setGraphDialogOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {headerMonths?.length &&
              totalSumValues[headerMonths[0]]?.length == 2 ? (
                <AreaGraph
                  data={getAcesdingOrderMonthsForGraphs(totalSumValues)}
                  graphColor={"blue"}
                />
              ) : (
                <AreaGraphForFacilities
                  data={getAcesdingOrderMonthsForGraphs(totalSumValues)}
                  graphColor={"blue"}
                />
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={totalSumValues}
        graphValuesData={getAcesdingOrderMonthsForGraphs(totalSumValues)}
        graphColor={"blue"}
        tabValue={tabValue}
      />
    </div>
  );
};
export default BillingAndRevenueCoreTable;
