import { storeQueryString } from "@/Redux/Modules/marketers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { Button } from "@mui/material";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addMonths,
  endOfMonth,
  startOfMonth,
} from "rsuite/esm/internals/utils/date";

interface pageProps {
  data: any[];
  loading: boolean;
  params: any;
}
const SalesRepsAccrodianTable: FC<pageProps> = ({ data, loading, params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      cell: (info: any) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <p>{info.row.original.serial}</p>
          </span>
        );
      },
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
          >
            {info.row.original.sales_rep_name}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.role_id,
      id: "role_id",
      header: () => <span style={{ whiteSpace: "nowrap" }}>USER TYPE</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span style={{ cursor: "pointer" }}>
            {info.row.original.role_id == 1
              ? "Territory Manager"
              : info.row.original.role_id == 2
              ? "Regional Director"
              : "Sales Director"}
          </span>
        );
      },
    },

    {
      accessorFn: (row: any) => row.revenue,
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITIES</span>,
      id: "facilities",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: ({ getValue }: any) => {
            return <span>{getValue()?.toLocaleString() || 0}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.active_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIVE</span>,
          id: "active_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: (info: any) => {
            return <span>{info.getValue()?.toLocaleString() || 0}</span>;
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.volume,
      header: () => <span style={{ whiteSpace: "nowrap" }}>VOLUME</span>,
      id: "volume",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_targets,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TARGET</span>,
          id: "total_targets",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: (info: any) => {
            return <span>{info.getValue()?.toLocaleString() || 0}</span>;
          },
        },
        {
          accessorFn: (row: any) => row.total_cases,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_cases",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: ({ getValue }: any) => {
            return <span>{getValue()?.toLocaleString() || 0}</span>;
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.target_reached,
      id: "target_reached",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>TARGET REACHED</span>
      ),
      footer: (props: any) => props.column.id,
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      cell: (info: any) => {
        return (
          <span
            style={{ color: `${info.getValue()}` == "true" ? "green" : "red" }}
          >{`${info.getValue() ? "Yes" : "No"}`}</span>
        );
      },
    },
    {
      accessorFn: (row: any) => row?._id,
      id: "actions",
      header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        return (
          <Button
            className="actionButton"
            onClick={() => {
              goToSingleRepPage(info.row.original.sales_rep_id);
            }}
          >
            view
          </Button>
        );
      },
    },
  ];

  const goToSingleRepPage = (repId: string) => {
    let queryString = "";
    let thisMonth =
      dayjs(startOfMonth(new Date())).format("YYYY-MM-DD") ==
      dayjs().format("YYYY-MM-DD")
        ? [
            startOfMonth(addMonths(new Date(), -1)),
            endOfMonth(addMonths(new Date(), -1)),
          ]
        : [startOfMonth(new Date()), new Date()];

    let defaultfromDate = new Date(
      Date.UTC(
        thisMonth[0].getFullYear(),
        thisMonth[0].getMonth(),
        thisMonth[0].getDate()
      )
    )
      .toISOString()
      .substring(0, 10);
    let defaulttoDate = new Date(
      Date.UTC(
        thisMonth[1].getFullYear(),
        thisMonth[1].getMonth(),
        thisMonth[1].getDate()
      )
    )
      .toISOString()
      .substring(0, 10);

    const queryParams: any = {
      from_date: defaultfromDate,
      to_date: defaulttoDate,
    };
    if (params["from_date"]) {
      queryParams["from_date"] = params["from_date"] || defaultfromDate;
    }
    if (params["to_date"]) {
      queryParams["to_date"] = params["to_date"] || defaulttoDate;
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }
    dispatch(storeQueryString(queryString));
    router.push(`/sales-representatives/${repId}${queryString}`);
  };

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
        <tbody>
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
