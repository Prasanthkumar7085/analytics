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

interface pageProps {
  columns: any[];
  data: any[];
  totalSumValues?: any;
  loading: boolean;
}
const SingleColumnTable: FC<pageProps> = ({
  columns,
  data,
  totalSumValues,
  loading,
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

  return (
    <div
      className="table customTableContainer"
      style={{
        overflow: "auto",
        width: "100%",
        borderRadius: "10px",
        padding: "1rem",
      }}
    >
      <table className="table" style={{ borderSpacing: "0" }}>
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
                  {/* <Image src="/" alt="" height={150} width={800} /> */}
                  No Data
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
            {totalSumValues?.map((item: any, index: number) => {
              return <td key={index}>{item}</td>;
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default SingleColumnTable;
