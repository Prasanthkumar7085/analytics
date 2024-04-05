import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { getRevenueOfInsurancePayorsByFacilitiesIdAPI, getVolumeOfInsurancePayorsByFacilitiesIdAPI } from "@/services/facilitiesAPIs";
import { Backdrop } from "@mui/material";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";

const InsurancePayorsForFacilities = ({ searchParams, pageName, tabValue, selectedCaseValue }: any) => {
    const { id } = useParams();
    const [insuranceData, setInsuranceData] = useState([]);
    const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);
    const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
    const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const params = useSearchParams();
    const router = useRouter();


    //query preparation method
    const queryPreparations = async (fromDate: any, toDate: any, selectedCaseValue: any) => {
        let queryParams: any = {};
        if (fromDate) {
            queryParams["from_date"] = fromDate;
        }
        if (toDate) {
            queryParams["to_date"] = toDate;
        }
        if (selectedCaseValue) {
            queryParams["case_type"] = selectedCaseValue?.id
        }
        try {
            if (tabValue == "Revenue") {
                await getRevenueDetailsOfInsrancePayors(queryParams)
            }
            else {
                await getVolumeDetailsOfInsrancePayors(queryParams);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    //get volume details for the insurance payors
    const getVolumeDetailsOfInsrancePayors = async (queryParams: any) => {
        setLoading(true)
        try {

            let response = await getVolumeOfInsurancePayorsByFacilitiesIdAPI({
                pageName,
                id: id as string, queryParams
            });

            if (response?.status == 200 || response?.status == 201) {
                const modifieData = addSerial(response?.data, 1, response?.data?.length);
                setInsuranceData(modifieData);

                let totalCases = 0;
                let completeCases = 0;
                let totalPending = 0;

                response?.data?.forEach((entry: any) => {
                    totalCases += entry.total_cases ? +entry.total_cases : 0;
                    completeCases += entry.completed_cases ? +entry.completed_cases : 0;
                    totalPending += entry.pending_cases ? +entry.pending_cases : 0;
                });

                const result = [{ value: "Total", dolorSymbol: false }, { value: null, dolorSymbol: false }, { value: totalCases, dolorSymbol: false }, { value: completeCases, dolorSymbol: false }, { value: totalPending, dolorSymbol: false }];

                setTortalInsurancePayors(result);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    };

    //get revenue details for the insurance payors
    const getRevenueDetailsOfInsrancePayors = async (queryParams: any) => {
        setLoading(true)
        try {

            let response = await getRevenueOfInsurancePayorsByFacilitiesIdAPI({
                pageName,
                id: id as string, queryParams
            });

            if (response?.status == 200 || response?.status == 201) {
                const modifieData = addSerial(response?.data, 1, response?.data?.length);
                setInsuranceData(modifieData);

                let totalAmount = 0;
                let totalPaid = 0;
                let totalPending = 0;

                response?.data?.forEach((entry: any) => {
                    totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
                    totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
                    totalPending += entry.pending_amount ? +entry.pending_amount : 0;
                });

                const result = [{ value: "Total", dolorSymbol: false }, { value: null, dolorSymbol: false }, { value: totalAmount, dolorSymbol: true }, { value: totalPaid, dolorSymbol: true }, { value: totalPending, dolorSymbol: true }];

                setTortalInsurancePayors(result);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    };

    //coloumns for the revenue table 
    const Revenuecolumns = [
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
                (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1,
        },
        {
            accessorFn: (row: any) => row.insurance_name,
            id: "insurance_name",
            header: () => (
                <span style={{ whiteSpace: "nowrap" }}>INSURANCE NAME</span>
            ),
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: (info: any) => {
                return <span style={{ cursor: "pointer" }} onClick={() => {
                    goToSingleInsurancePage(info.row.original.insurance_id)
                }}>{info.getValue()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.generated_amount,
            id: "generated_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.paid_amount,
            id: "paid_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.pending_amount,
            id: "pending_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },

    ]

    //cloumns for the volume table
    const Volumecolumns = [
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
                (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1,
        },
        {
            accessorFn: (row: any) => row.insurance_name,
            id: "insurance_name",
            header: () => (
                <span style={{ whiteSpace: "nowrap" }}>INSURANCE NAME</span>
            ),
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: (info: any) => {
                return <span style={{ cursor: "pointer" }} onClick={() => {
                    goToSingleInsurancePage(info.row.original.insurance_id)
                }}>{info.getValue()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.total_cases,
            id: "total_cases",
            header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{getValue()?.toLocaleString()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.completed_cases,
            id: "completed_cases",
            header: () => <span style={{ whiteSpace: "nowrap" }}>FINALISED</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{getValue()?.toLocaleString()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.pending_cases,
            id: "pending_cases",
            header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            sortDescFirst: false,
            cell: ({ getValue }: any) => {
                return <span>{getValue()?.toLocaleString()}</span>;
            },
        },

    ]

    useEffect(() => {
        queryPreparations(searchParams?.from_date, searchParams?.to_date, selectedCaseValue);
    }, [searchParams, tabValue, selectedCaseValue]);

    //when click on the insurance payor name it goes to single insurance payor details page
    const goToSingleInsurancePage = (Id: string) => {
        let queryString = "";
        const queryParams: any = {};
        if (params.get("from_date")) {
            queryParams["from_date"] = params.get("from_date");
        }
        if (params.get("to_date")) {
            queryParams["to_date"] = params.get("to_date");
        }
        if (Object.keys(queryParams)?.length) {
            queryString = prepareURLEncodedParams("", queryParams);
        }

        router.push(`/insurances/${Id}${queryString}`);
    };


    return (
        <div style={{ position: "relative" }}>
            <SingleColumnTable
                data={insuranceData}
                columns={tabValue == "Revenue" ? Revenuecolumns : Volumecolumns}
                totalSumValues={totalInsurancePayors}
                loading={loading}
            />
            {loading ? (
                <Backdrop
                    open={true}
                    style={{
                        zIndex: 999,
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

export default InsurancePayorsForFacilities;
