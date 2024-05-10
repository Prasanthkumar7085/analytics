import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import LoadingComponent from "@/components/core/LoadingComponent";
import CaseTypesFacilitiesTable from "@/components/core/Table/TableForCaseTypesFacilities";
import { addSerial } from "@/lib/Pipes/addSerial";
import { graphColors } from "@/lib/constants";
import { formatMonthYear, getUniqueMonths } from "@/lib/helpers/apiHelpers";
import { getMonthWiseVolumeCaseTypesForSinglePageFacilitiesAPI } from "@/services/caseTypesAPIs";
import { Backdrop } from "@mui/material";
import { useEffect, useState } from "react";

const CaseTypesAccordianTable = ({ id, searchParams }: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [caseData, setCaseData] = useState<any>([]);
    const [totalSumValues, setTotalSumValues] = useState<any>({});
    const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
    const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
    const [headerMonths, setHeaderMonths] = useState<any>([]);
    const [graphValuesData, setGraphValuesData] = useState<any>({});
    const [graphColor, setGraphColor] = useState("");

    //query preparation method
    const queryPreparations = async (
        fromDate: any,
        toDate: any,
    ) => {
        let queryParams: any = {};
        if (fromDate) {
            queryParams["from_date"] = fromDate;
        }
        if (toDate) {
            queryParams["to_date"] = toDate;
        }
        try {

            await getDetailsOfCaseTypesOfVolume(queryParams);

        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //get details Volume of caseTypes
    const getDetailsOfCaseTypesOfVolume = async (queryParams: any) => {
        setLoading(true);
        let pageName = "facilities"
        try {
            const response =
                await getMonthWiseVolumeCaseTypesForSinglePageFacilitiesAPI({
                    pageName,
                    id,
                    queryParams,
                });
            if (response.status == 200 || response.status == 201) {
                let uniqueMonths = getUniqueMonths(response?.data);
                setHeaderMonths(uniqueMonths);

                const groupedData: any = {};
                // Grouping the data by case_type_id and then by month
                response?.data?.forEach((item: any) => {
                    const { case_type_id, case_type_name, month, total_cases } = item;
                    if (!groupedData[case_type_id]) {
                        groupedData[case_type_id] = { case_type_id, case_type_name };
                    }

                    const formattedMonth = month.replace(/\s/g, "");

                    groupedData[case_type_id][formattedMonth] = total_cases;
                });
                // Converting object to array
                const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
                    return a.case_type_name.localeCompare(b.case_type_name);
                });

                const modifieData = addSerial(sortedData, 1, sortedData?.length);
                setCaseData(modifieData);

                const groupedDataSum: any = {};
                // Grouping the data by month sum
                response?.data?.forEach((item: any) => {
                    const { month, total_cases } = item;
                    const formattedMonth = month.replace(/\s/g, "");
                    const amount = parseFloat(total_cases);
                    if (!groupedDataSum[formattedMonth]) {
                        groupedDataSum[formattedMonth] = 0;
                    }
                    // Add amount to the total_sum for the respective month
                    groupedDataSum[formattedMonth] += amount;
                });

                // Convert the object to an array
                setTotalSumValues(groupedDataSum);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    //prepare the table coloumns
    let addtionalcolumns = headerMonths?.map((item: any) => ({
        accessorFn: (row: any) => row[item],
        id: item,
        header: () => (
            <span style={{ whiteSpace: "nowrap" }}>{formatMonthYear(item)}</span>
        ),
        footer: (props: any) => props.column.id,
        width: "80px",
        maxWidth: "220px",
        minWidth: "220px",
        sortDescFirst: false,
        cell: (info: any) => (
            <span>
                {info.getValue()?.toLocaleString()}
            </span>
        ),
    }));

    const graphColoumn = [
        {
            accessorFn: (row: any) => row.actions,
            id: "actions",
            enableSorting: false,
            header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
            footer: (props: any) => props.column.id,
            width: "100px",

            cell: (info: any) => {
                let data = { ...info.row.original };
                delete data?.case_type_id;
                delete data?.case_type_name;
                delete data?.serial;

                return (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setGraphDialogOpen(true);
                            setSelectedGraphData(info.row.original);
                            setGraphValuesData(data);
                            setGraphColor(graphColors[info.row.original.case_type_name]);
                        }}
                    >
                        <AreaGraphForFacilities
                            data={data}
                            graphColor={graphColors[info.row.original.case_type_name]}
                        />
                    </div>
                );
            },
        },
    ];

    const columnDef = [
        {
            accessorFn: (row: any) => row.serial,
            id: "id",
            enableSorting: false,
            header: () => <span>S.No</span>,
            footer: (props: any) => props.column.id,
            width: "60px",
            minWidth: "60px",
            maxWidth: "60px",
            cell: ({ row, table }: any) =>
                (table
                    .getSortedRowModel()
                    ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
                1,
        },

        {
            accessorFn: (row: any) => row.case_type_name,
            id: "case_type_name",
            header: () => <span style={{ whiteSpace: "nowrap" }}>Case Types</span>,
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: ({ getValue }: any) => {
                return <span>{getValue()}</span>;
            },
        },
    ];

    const addAddtionalColoumns = [
        ...columnDef,
        ...addtionalcolumns,
        ...graphColoumn,
    ];

    //api call to get details of case types
    useEffect(() => {
        queryPreparations(
            searchParams?.from_date,
            searchParams?.to_date,
        );
    }, [searchParams]);

    return (
        <div style={{ position: "relative" }}>
            <CaseTypesFacilitiesTable
                data={caseData}
                columns={addAddtionalColoumns}
                totalSumValues={totalSumValues}
                loading={loading}
                headerMonths={headerMonths}
            />
            {loading ? (
                <Backdrop
                    open={true}
                    style={{
                        zIndex: 9999,
                        color: "red",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(256,256,256,0.8)",
                    }}
                >
                    <object
                        type="image/svg+xml"
                        data={"/core/loading.svg"}
                        width={150}
                        height={150}
                    />
                </Backdrop>
            ) : (
                ""
            )}
        </div>
    );
};
export default CaseTypesAccordianTable;