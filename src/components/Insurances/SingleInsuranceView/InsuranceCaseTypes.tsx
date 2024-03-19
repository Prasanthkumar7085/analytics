import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { getInsurancesCaseTypesAPI } from "@/services/insurancesAPI";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InsuranceCaseTypes = ({ searchParams }: any) => {
    const { id } = useParams();
    const router = useRouter();
    const [insuranceData, setInsuranceData] = useState([]);
    const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getSingleInsuranceCaseTypesDetails = async (fromDate: any, toDate: any) => {
        setLoading(true)
        try {

            let queryParams: any = {};

            if (fromDate) {
                queryParams["from_date"] = fromDate;
            }
            if (toDate) {
                queryParams["to_date"] = toDate;
            }

            const response = await getInsurancesCaseTypesAPI(
                id as string, queryParams
            );
            if (response?.status == 200 || response?.status == 201) {
                setInsuranceData(response?.data);
                let totalVolume = 0;
                let completeVolume = 0;
                let expectedAmount = 0;
                let totalAmount = 0;
                let pendingVolume = 0;
                let totalPaid = 0;
                let totalPending = 0;


                response?.data?.forEach((entry: any) => {
                    totalVolume += entry.total_cases ? + entry.total_cases : 0;
                    completeVolume += entry.completed_cases ? +entry.completed_cases : 0;
                    totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
                    expectedAmount += entry.expected_amount ? +entry.expected_amount : 0;
                    totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
                    pendingVolume += entry.pending_cases ? +entry.pending_cases : 0;
                    totalPending += entry.pending_amount ? +entry.pending_amount : 0;
                });

                const result = [
                    { value: "Total", dolorSymbol: false },
                    { value: totalVolume, dolorSymbol: false },
                    { value: completeVolume, dolorSymbol: false },
                    { value: totalAmount, dolorSymbol: true },
                    { value: expectedAmount, dolorSymbol: true },
                    { value: totalPaid, dolorSymbol: true },
                    { value: pendingVolume, dolorSymbol: false },
                    { value: totalPending, dolorSymbol: true }];

                setTortalInsurancePayors(result);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    };


    const columns = [
        {
            accessorFn: (row: any) => row.case_type_name,
            id: "case_type_name",
            header: () => (
                <span style={{ whiteSpace: "nowrap" }}>CASE TYPE</span>
            ),
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: ({ getValue }: any) => {
                return <span>{getValue()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.total_cases,
            id: "total_cases",
            header: () => (
                <span style={{ whiteSpace: "nowrap" }}>VOLUME</span>
            ),
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: ({ getValue }: any) => {
                return <span>{getValue().toLocaleString()}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.completed_cases,
            id: "completed_cases",
            header: () => (
                <span style={{ whiteSpace: "nowrap" }}>CLEARED VOL</span>
            ),
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: ({ getValue }: any) => {
                return <span>{getValue().toLocaleString()}</span>;
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
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },

        {
            accessorFn: (row: any) => row.expected_amount,
            id: "expected_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>EXPECTED</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },

        {
            accessorFn: (row: any) => row.paid_amount,
            id: "paid_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>CLEARED BILL</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.pending_cases,
            id: "pending_cases",
            header: () => <span style={{ whiteSpace: "nowrap" }}>PEN VOL</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            cell: ({ getValue }: any) => {
                return <span>{getValue().toLocaleString()}</span>;
            },
        },

        {
            accessorFn: (row: any) => row.pending_amount,
            id: "pending_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING REV</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            cell: ({ getValue }: any) => {
                return <span>{formatMoney(getValue())}</span>;
            },
        },
        {
            accessorFn: (row: any) => row.pending_amount,
            id: "clearence_rate",
            header: () => <span style={{ whiteSpace: "nowrap" }}>REV CLEARANCE RATE</span>,
            footer: (props: any) => props.column.id,
            width: "70px",
            maxWidth: "100px",
            minWidth: "70px",
            cell: (info: any) => {
                return <span>{(((info.row.original.paid_amount) / (info.row.original.expected_amount)) * 100).toFixed(2)}%</span>;
            },
        },
    ]

    useEffect(() => {
        getSingleInsuranceCaseTypesDetails(searchParams?.from_date, searchParams?.to_date);
    }, [searchParams]);
    return (
        <div>
            <SingleColumnTable
                data={insuranceData}
                columns={columns}
                totalSumValues={totalInsurancePayors}
                loading={false}
            />
        </div>
    )
}
export default InsuranceCaseTypes;