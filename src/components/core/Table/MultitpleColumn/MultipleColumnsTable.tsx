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
import { FC, useState } from "react";
import styles from "./multi-column.module.css";

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  searchParams?: any;
}
const MultipleColumnsTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  searchParams,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  let removeSortingForColumnIds = ["id", "actions", "1_revenue_generated_amount", "1_revenue_expected_amount"]

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
    console.log(header, "header")
    return (
      <div>
        {searchParams?.order_by == header?.id ? (
          searchParams?.order_type == "asc" ? (
            <Image
              src="/core/sort/sort-asc.svg"
              height={8}
              width={8}
              alt="image"
            />
          ) : (
            <Image
              src="/core/sort/sort-desc.svg"
              height={8}
              width={8}
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
                  console.log(header, "header")

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
                                style={{ display: header.id === "actions" || removeSortingForColumnIds.includes(header.id) ? "none" : "" }}
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
                        className={styles.tableCell}
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
            ""
          )}
        </tbody>
        <tfoot
          style={{
            fontSize: "clamp(12px, 0.62vw, 14px)",
            border: "1px solid #a5a5a5",
            textTransform: "uppercase",
            fontWeight: "600",
            color: "#1B2459",
            background: "#EFF1FA",
          }}
        >
          <tr>
            {totalSumValues?.map((item: any, index: number) => {
              return (
                <td key={index}>
                  {index == 0 || index == 1 ? item : formatMoney(item)}
                </td>
              );
            })}
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default MultipleColumnsTable;
