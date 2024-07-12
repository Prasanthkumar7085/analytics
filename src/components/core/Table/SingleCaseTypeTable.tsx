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
import GraphDialogForFacilities from "../GraphDilogForFacilities";
import AreaGraphForFacilities from "../AreaGraph/AreaGraphForFacilities";
import { getAcesdingOrderMonthsForGraphs } from "@/lib/helpers/apiHelpers";
import AreaGraph from "../AreaGraph";
import GraphDialog from "../GraphDialog";

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  headerMonths: any;
  getData: any;
}
const SingleCaseTypeTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  headerMonths,
  getData,
}) => {
  const pathName = usePathname();
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  let removeSortingForColumnIds = [
    "id",
    "actions",
    "1_revenue_generated_amount",
  ];

  const table = useReactTable({
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

  const useParams = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
  );
  const SortItems = ({
    searchParams,
    header,
  }: {
    searchParams: any;
    header: any;
  }) => {
    return (
      <div>
        {searchParams?.order_by == header?.id ? (
          searchParams?.order_type == "asc" ? (
            <Image
              src="/core/sort/sort-asc.svg"
              height={8}
              width={8}
              style={{
                display: removeSortingForColumnIds?.includes(header.id)
                  ? "none"
                  : "",
              }}
              alt="image"
            />
          ) : (
            <Image
              src="/core/sort/sort-desc.svg"
              height={8}
              width={8}
              style={{
                display: removeSortingForColumnIds?.includes(header.id)
                  ? "none"
                  : "",
              }}
              alt="image"
            />
          )
        ) : removeSortingForColumnIds?.includes(header.id) ? (
          ""
        ) : (
          <Image
            src="/core/sort/un-sort.svg"
            height={8}
            width={8}
            alt="image"
          />
        )}
      </div>
    );
  };
  const sortAndGetData = (header: any) => {
    if (removeSortingForColumnIds.includes(header.id)) {
      return;
    }
    if (header.id == "select_rows" || header.id == "actions") {
      return;
    }
    let orderBy = header.id;
    let orderType = "asc";
    if ((searchParams?.order_by as string) == header.id) {
      if (searchParams?.order_type == "asc") {
        orderType = "desc";
      } else {
        orderBy = "";
        orderType = "";
      }
    }

    getData({
      orderBy: orderBy,
      orderType: orderType,
    });
  };
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
  const getBackgroundColor = (totalCases: any, targetVolume: any) => {
    console.log(totalCases, "383223838");
    if (targetVolume === 0) {
      if (totalCases === 0) {
        return "#f5fff7";
      } else if (totalCases >= targetVolume) {
        return "#f5fff7";
      } else {
        return "#ffebe9";
      }
    }

    const percentage = totalCases / targetVolume;
    if (totalCases >= targetVolume) {
      return "#f5fff7";
    } else if (percentage >= 0.5) {
      return "#feecd1";
    } else {
      return "#ffebe9";
    }
  };
  console.log(totalSumValues, "poew09ew00");
  return (
    <div
      style={{ width: "100%", overflowX: "auto" }}
      className={
        pathName?.includes("patient-results")
          ? "patientDetailsTable"
          : "tableContainer"
      }
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
                          onClick={() => sortAndGetData(header)}
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

                          <SortItems
                            searchParams={searchParams}
                            header={header}
                          />
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
                    height={110}
                    width={210}
                  />
                </div>
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
        <tfoot>
          <tr
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
            <td className="cell"></td>
            {headerMonths?.map((item: any, index: number) => {
              return (
                <td
                  key={index}
                  style={{
                    cursor: "pointer",
                    background: useParams?.get("sales_rep")
                      ? getBackgroundColor(
                          +totalSumValues[item]?.[0],
                          +totalSumValues[item]?.[1]
                        )
                      : "#eff1fa",
                  }}
                >
                  {totalSumValues[item]?.[0]?.toLocaleString()}
                </td>
              );
            })}

            <td
              className="cell"
              onClick={() => setGraphDialogOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {headerMonths?.length ? (
                useParams?.get("sales_rep") && !useParams?.get("search") ? (
                  <AreaGraph
                    data={getAcesdingOrderMonthsForGraphs(totalSumValues)}
                    graphColor={"blue"}
                  />
                ) : (
                  <AreaGraphForFacilities
                    data={getAcesdingOrderMonthsForGraphs(totalSumValues)}
                    graphColor={"blue"}
                  />
                )
              ) : (
                ""
              )}
            </td>
          </tr>
          {useParams?.get("sales_rep") && !useParams?.get("search") ? (
            <tr
              className="table-row active-facilities-row"
              style={{
                fontSize: "clamp(12px, 0.62vw, 14px)",
                border: "1px solid #a5a5a5",
                fontWeight: "600",
                color: "#1B2459",
                background: "#90EE90",
              }}
            >
              <td className="cell">Total Targets</td>
              <td className="cell"></td>
              <td className="cell"></td>
              {headerMonths?.map((item: any, index: number) => {
                return (
                  <td
                    className="cell"
                    style={{ cursor: "pointer" }}
                    key={index}
                  >
                    {totalSumValues[item]?.[1]?.toLocaleString()}
                  </td>
                );
              })}
              <td
                className="cell"
                onClick={() => setGraphDialogOpen(true)}
                style={{ cursor: "pointer" }}
              ></td>
            </tr>
          ) : (
            ""
          )}
        </tfoot>
      </table>
      {useParams?.get("sales_rep") && !useParams?.get("search") ? (
        <GraphDialog
          graphDialogOpen={graphDialogOpen}
          setGraphDialogOpen={setGraphDialogOpen}
          graphData={getAcesdingOrderMonthsForGraphs(totalSumValues)}
          graphValuesData={getAcesdingOrderMonthsForGraphs(totalSumValues)}
          graphColor={"blue"}
          tabValue={"volume"}
        />
      ) : (
        <GraphDialogForFacilities
          graphDialogOpen={graphDialogOpen}
          setGraphDialogOpen={setGraphDialogOpen}
          graphData={getAcesdingOrderMonthsForGraphs(totalSumValues)}
          graphValuesData={getAcesdingOrderMonthsForGraphs(totalSumValues)}
          graphColor={"blue"}
          tabValue={"volume"}
        />
      )}
    </div>
  );
};
export default SingleCaseTypeTable;
