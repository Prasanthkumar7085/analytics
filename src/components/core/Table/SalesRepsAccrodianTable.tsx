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

interface pageProps {
  columns: any[];
  data: any[];
  loading: boolean;
}
const SalesRepsAccrodianTable: FC<pageProps> = ({
  columns,
  data,
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
  return (
    <td colSpan={9} className="salesRepAccrodianTable">
      <table style={{ width: "100%" }}>
        <tbody >
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

      </table>
    </td>
  );
};
export default SalesRepsAccrodianTable;
