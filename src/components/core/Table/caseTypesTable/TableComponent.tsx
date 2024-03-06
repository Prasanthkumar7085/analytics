
import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
const TanStackTableComponent = ({
    data,
    columns,
    paginationDetails,
    getData,
}: any) => {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getSubRows: (row: any) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    const getWidth = (id: string) => {
        const widthObj = columns.find((item: any) => item.id == id);
        const width = widthObj?.width;
        return width;
    };
    const sortAndGetData = (header: any) => {
        if (
            header.id == "actions" ||
            header.id == "farm_id.title" ||
            header.id == "assigned_to" ||
            header.id == "status" ||
            header.id == "priority" ||
            header.id == "id" ||
            header.id == "requested_by.name"
        ) {
            return;
        }
        let orderBy = header.id;
        let orderType = "asc";

        getData();
    };


    return (
        <div
            className="dataTable-container scrollbar"
        >
            <table
                className="table"
                border={0}
                style={{ borderSpacing: "0 !important" }}
            >
                <thead
                    className="thead"
                    style={{
                        height: "32px",
                        position: "sticky",
                        top: "0px",
                        zIndex: "2"
                    }}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr className="table-row" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                        className="cell"
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            minWidth: getWidth(header.id),
                                            width: getWidth(header.id),
                                            background: "#686D75",

                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                onClick={() => sortAndGetData(header)}
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
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
                    {table.getFilteredRowModel().rows.map((row) => {

                        return (
                            <tr className="table-row" key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td className="cell" key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

    );
};
export default TanStackTableComponent;
