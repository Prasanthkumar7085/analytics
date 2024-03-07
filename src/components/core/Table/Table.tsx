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
import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
  getData: ({}) => void;
}
const TanStackTableComponent: FunctionComponent<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
  getData,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

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
    getData({
      page: 1,
      orderBy: orderBy,
      orderType: orderType,
    });
  };

  return (
    <div
      style={{
        overflow: "auto",
        width: "94%",
        margin: "0 auto",
      }}
      className="orders-tableContainer scrollbar"
    >
      <table
        className="table"
        border={0}
        style={{
          borderSpacing: " 0 2px !important",
          borderCollapse: "separate",
        }}
      >
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
              <tr
                className="table-row"
                key={headerGroup.id}
                style={{ border: "1px solid red" }}
              >
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
                        background: "#dfe1e8",
                        border: "1px solid #a5a5a5",
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
                                height={15}
                                width={15}
                                alt="image"
                              />
                            ),
                            desc: (
                              <Image
                                src="/core/sort/sort-desc.svg"
                                height={15}
                                width={15}
                                alt="image"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                          {/* <SortItems
                              searchParams={searchParams}
                              header={header}
                            /> */}
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
                          backgroundColor: !row?.original?.target_reached
                            ? "#ffebe9"
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
                  {/* <Image src="/" alt="" height={150} width={800} /> */}
                  No Data
                </div>
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
        <tfoot
        >
          <tr style={{
            background: "#dfe1e8",
            border: "1px solid #a5a5a5",
          }}>
            {totalSumValues?.map((item: any, index: number) => {
              return (
                <td key={index}>{item}</td>

              )
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default TanStackTableComponent;

const SortItems = ({
  searchParams,
  header,
}: {
  searchParams: any;
  header: any;
}) => {
  return (
    <div>
      {searchParams.order_by == header.id ? (
        searchParams.order_type == "asc" ? (
          <Image src="/sort-asc.svg" height={15} width={15} alt="image" />
        ) : (
          <Image src="/sort-desc.svg" height={15} width={15} alt="image" />
        )
      ) : header.id == "serial" || header.id == "actions" ? (
        ""
      ) : (
        <Image src="/un-sorted.svg" height={15} width={15} alt="image" />
      )}
    </div>
  );
};
