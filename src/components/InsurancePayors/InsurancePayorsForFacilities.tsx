import { getAllInsurancePayorsByFacilitiesIdAPI, getAllInsurancePayorsBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop } from "@mui/material";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";

const InsurancePayors = ({ searchParams, pageName, tabValue }: any) => {
    const { id } = useParams();
    const [insuranceData, setInsuranceData] = useState([]);
    const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);
    const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
    const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const params = useSearchParams();
    const router = useRouter();

    const getAllInsrancePayors = async (fromDate: any, toDate: any) => {
        setLoading(true)
        try {

            let queryParams: any = {};

            if (fromDate) {
                queryParams["from_date"] = fromDate;
            }
            if (toDate) {
                queryParams["to_date"] = toDate;
            }
            let response = await getAllInsurancePayorsByFacilitiesIdAPI({
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

    const columns = [
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

    useEffect(() => {
        getAllInsrancePayors(searchParams?.from_date, searchParams?.to_date);
    }, [searchParams]);

    return (
        <div style={{ position: "relative" }}>
            <SingleColumnTable
                data={insuranceData}
                columns={columns}
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

export default InsurancePayors;
