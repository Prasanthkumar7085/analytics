import formatMoney from "@/lib/Pipes/moneyFormat";
import Image from "next/image";
import React, { FC, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SalesRepsAccrodianTable from "./SalesRepsAccrodianTable";

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  searchParams?: any;
  getData?: any;
}
const TeamWiseSalesRepsTanStackTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  searchParams,
  getData,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [sortingEnabled, setSortingEnabled] = useState(false);
  let removeSortingForColumnIds = [
    "id",
    "actions",
    "target_reached",
    "1_revenue_generated_amount",
    "1_facilities_total_facilities",
    "1_volume_total_cases",
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

  function findObjectById(array: any[], id: string) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (typeof element === "object" && element.id === id) {
        return element;
      }
      if (Array.isArray(element)) {
        const foundObject: any = findObjectById(element, id);
        if (foundObject) {
          return foundObject;
        }
      }
    }
    return null;
  }

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

  const getWidth = (id: string) => {
    const widthObj = findObjectById(columns, id);

    if (widthObj) {
      const width = widthObj?.width;
      return width;
    } else return "100px";
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

  const getBackgroundColor = (totalCases: any, targetVolume: any) => {
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

  const handleRowClick = (index: any) => {
    setExpandedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    setSortingEnabled(true);
  };

  const handleExpandClose = () => {
    setExpandedRowIndex(null)
    setSortingEnabled(false);
  }


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
              const isExpanded = mainIndex === expandedRowIndex;

              return (
                <React.Fragment key={mainIndex}>
                  <tr className="table-row"
                    onClick={() => {
                      if (isExpanded) {
                        handleExpandClose()
                      } else {
                        handleRowClick(mainIndex)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell: any, index: number) => {
                      return (
                        <td
                          className="cell"
                          key={index}
                          style={{
                            width: "100%",
                            backgroundColor:
                              row?.original.hasOwnProperty("target_reached") &&
                                cell?.id &&
                                cell?.id.includes("total_cases")
                                ? getBackgroundColor(
                                  row?.original?.total_cases,
                                  row?.original?.total_targets
                                )
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
                  {row?.original?.team?.length ? (
                    <tr>
                      <SalesRepsAccrodianTable
                        columns={columns}
                        data={row?.original?.team}
                        loading={false}
                      />

                    </tr>
                  ) : ""}
                </React.Fragment>
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
        <tfoot
          className="tfootRow"
          style={{
            fontSize: "clamp(12px, 0.62vw, 14px)",
            border: "1px solid #a5a5a5",
            textTransform: "uppercase",
            fontWeight: "600",
            color: "#1B2459",
          }}
        >
          <tr className="radiusLastChild">
            {totalSumValues?.map((item: any, index: number) => {
              return (
                <td key={index} className="cell">
                  {index == 0 || index == 1
                    ? item.value
                    : item.dolorSymbol
                      ? formatMoney(item.value)
                      : item?.value?.toLocaleString()}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
export default TeamWiseSalesRepsTanStackTable;