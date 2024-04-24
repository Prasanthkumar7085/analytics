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
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import AreaGraph from "../core/AreaGraph";
import GraphDialog from "../core/GraphDialog";
import { Tooltip } from "@mui/material";
import * as XLSX from "xlsx-color";

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  headerMonths: any;
  tabValue: string;
}
const CaseTypesColumnTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  headerMonths,
  tabValue,
}) => {
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);

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

  const exportToExcel = () => {
    const headers = table
      .getHeaderGroups()
      .map((x: any) => x.headers)
      .flat()
      .map((column: any) => column.id);
    console.log(headers, "po9324");
    const rows = table.getCoreRowModel().rows.map((row: any) => row);
    console.log(rows, "po9324");
    // Combine headers and rows into a single array
    const data = [
      headers,
      ...rows.map((row: any) => Object.values(row.original)),
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the workbook as a file
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  return (
    <div
      className="tableContainer"
      style={{ width: "100%", overflowX: "auto" }}
    >
      <button onClick={exportToExcel}>Export to Excel</button>

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
                          // onClick={() => sortAndGetData(header)}
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
                              />
                            ),
                            desc: (
                              <Image
                                src="/core/sort/sort-desc.svg"
                                height={8}
                                width={8}
                                alt="image"
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
                                  header.id === "actions" ||
                                  removeSortingForColumnIds.includes(header.id)
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
                          backgroundColor: row?.original.hasOwnProperty(
                            "target_reached"
                          )
                            ? !row?.original?.target_reached
                              ? "#ffebe9"
                              : ""
                            : "",
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
                <td key={index} className="cell" style={{ cursor: "pointer" }}>
                  {tabValue == "Revenue" ? (
                    formatMoney(totalSumValues[item])
                  ) : !totalSumValues[item]?.[1] ? (
                    totalSumValues[item]?.[0]
                  ) : (
                    <Tooltip
                      arrow
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -5],
                              },
                            },
                          ],
                        },
                      }}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            width: "100px",
                            bgcolor:
                              totalSumValues[item]?.[1] <=
                              totalSumValues[item]?.[0]
                                ? "green"
                                : "red",
                            color: "white",
                            border: "1px solid rgba(0,0,0,0.1)",
                            padding: 0,
                            fontSize: "15px",
                            textAlign: "center",
                            "& .MuiTooltip-arrow": {
                              color: "black",
                              "&::before": {
                                border:
                                  " 1px solid rgba(0, 0, 0, 0.1)!important",
                              },
                            },
                          },
                        },
                      }}
                      title={
                        "Target total: " +
                        totalSumValues[item]?.[1]?.toLocaleString()
                      }
                    >
                      <div className="statusTags">
                        {totalSumValues[item]?.[0]?.toLocaleString()}
                      </div>
                    </Tooltip>
                  )}
                </td>
              );
            })}
            <td
              className="cell"
              onClick={() => setGraphDialogOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {headerMonths?.length ? (
                <AreaGraph data={totalSumValues} graphColor={"blue"} />
              ) : (
                ""
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      {headerMonths?.length ? (
        <GraphDialog
          graphDialogOpen={graphDialogOpen}
          setGraphDialogOpen={setGraphDialogOpen}
          graphData={totalSumValues}
          graphValuesData={totalSumValues}
          graphColor={"blue"}
          tabValue={tabValue}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default CaseTypesColumnTable;
