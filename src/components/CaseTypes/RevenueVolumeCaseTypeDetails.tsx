import { getRevenueOrVolumeCaseDetailsAPI } from "@/services/caseTypesAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import TanStackTableComponent from "../core/Table/Table";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop, CircularProgress } from "@mui/material";

const RevenuVolumeCaseTypesDetails = ({ tabValue }: any) => {

    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [caseData, setCaseData] = useState<any>([])
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    const tableRef: any = useRef()
    //get details of Revenue or Volume of caseTypes
    const getDetailsOfCaseTypes = async () => {
        setLoading(true)
        let url;
        if (tabValue == "Revenue") {
            url = `/sales-reps/${id}/case-types/revenue`
        }
        else {
            url = `/sales-reps/${id}/case-types/volume`

        }
        try {
            const response = await getRevenueOrVolumeCaseDetailsAPI(url)
            if (response.status == 200 || response.status == 201) {
                const formattedData = [];

                // Loop through each month in the data
                for (const month in response?.data) {
                    const monthData = response?.data[month].case_type_wise_counts;
                    // Loop through each case type in the month data
                    for (const caseType in monthData) {
                        // Find the corresponding object in formattedData or create a new one if not found
                        let caseObj: any = formattedData.find(obj => obj.caseType === caseType);
                        if (!caseObj) {
                            caseObj = { caseType: caseType };
                            // Initialize counts for each month
                            for (const monthName in response?.data) {
                                caseObj[monthName.slice(0, 3).toLowerCase()] = 0;
                            }
                            // Add the case object to the formatted data array
                            formattedData.push(caseObj);
                        }
                        // Set the count for the current month
                        caseObj[month.slice(0, 3).toLowerCase()] = monthData[caseType];
                    }
                }

                console.log(formattedData, "SDfsdfsdf")
                setCaseData(formattedData)
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    }

    const Addtionalcolumns = months?.map((item: any) => ({
        accessorFn: (row: any) => row[item.toLowerCase()],
        id: item.toLowerCase(),
        header: () => (
            <span style={{ whiteSpace: "nowrap" }}>{item.toUpperCase()}</span>
        ),
        footer: (props: any) => props.column.id,
        width: "80px",
        maxWidth: "220px",
        minWidth: "220px",
        cell: (info: any) => (
            <span>{tabValue == "Revenue" ? info.getValue() : info.getValue()}</span>
        )
    }));

    const columnDef = useMemo(
        () => [


            {
                accessorFn: (row: any) => row.caseType,
                id: "caseType",
                header: () => (
                    <span style={{ whiteSpace: "nowrap" }}>Case Types</span>
                ),
                footer: (props: any) => props.column.id,
                width: "220px",
                maxWidth: "220px",
                minWidth: "220px",
                cell: ({ getValue }: any) => {
                    return (
                        <span>{getValue()}</span>)
                },
            },

            ...Addtionalcolumns

        ],
        []
    );
    //api call to get details of case types
    useEffect(() => {
        getDetailsOfCaseTypes()
    }, [tabValue])

    return (


        <div style={{ position: "relative" }}>
            <TanStackTableComponent
                data={caseData}
                columns={columnDef}
                loading={false}
                getData={getDetailsOfCaseTypes}
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
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                ""
            )}
        </div>
    )
}
export default RevenuVolumeCaseTypesDetails; 