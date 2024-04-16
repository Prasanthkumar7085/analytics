import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import { getSalesRepTargetsAPI } from "@/services/salesTargetsAPIs";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { addSerial } from "@/lib/Pipes/addSerial";
import SalesRepsTargetsFilters from "./SalesRepsTargetsFilters";
import MultipleColumnsTableForSalesRep from "../core/Table/MultitpleColumn/MultipleColumnsTableForSalesRep";
import LoadingComponent from "../core/LoadingComponent";
import { getUniqueMonths } from "@/lib/helpers/apiHelpers";
import timePipe from "@/lib/Pipes/timePipe";

const SalesTargets = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [allTargetsData, setAllTargetsData] = useState<any>([]);
    const [completeData, setCompleteData] = useState([]);
    const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
    const [headerMonths, setHeaderMonths] = useState<any>([]);
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );

    //query preparation method
    const queryPreparations = async ({
        fromDate,
        toDate,
        searchValue = searchParams?.search,
        orderBy = searchParams?.order_by,
        orderType = searchParams?.order_type,
    }: any) => {
        let queryParams: any = {};

        if (fromDate) {
            queryParams["from_date"] = fromDate;
        }
        if (toDate) {
            queryParams["to_date"] = toDate;
        }
        if (searchValue) {
            queryParams["search"] = searchValue;
        }
        if (orderBy) {
            queryParams["order_by"] = orderBy;
        }
        if (orderType) {
            queryParams["order_type"] = orderType;
        }
        try {
            await getAllSalesRepTargets(queryParams)
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    //get all sales reps data event
    const getAllSalesRepTargets = async (queryParams: any) => {
        setLoading(true);
        try {
            let queryString = prepareURLEncodedParams("", queryParams);

            router.push(`${pathname}${queryString}`);

            const response = await getSalesRepTargetsAPI(queryParams);
            if (response.status == 200 || response.status == 201) {

                // let uniqueMonths = getUniqueMonths(response?.data);
                // setHeaderMonths(uniqueMonths)

                setCompleteData(response?.data);
                let data = response?.data;
                if (queryParams.search) {
                    data = data.filter((item: any) =>
                        item.sales_rep
                            ?.toLowerCase()
                            ?.includes(queryParams.search?.toLowerCase()?.trim())
                    );
                }
                data = sortAndGetData(data, queryParams.order_by, queryParams.order_type);
                const modifieData = addSerial(data, 1, data?.length);
                setAllTargetsData(modifieData);
            } else {
                throw response;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //coloumns for the sales rep targets table
    const columnDef = [
        {
            accessorFn: (row: any) => row.serial,
            id: "id",
            header: () => <span>S.No</span>,
            footer: (props: any) => props.column.id,
            width: "60px",
            minWidth: "60px",
            maxWidth: "60px",
        },
        {
            accessorFn: (row: any) => row.sales_rep,
            id: "sales_rep",
            header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: (info: any) => {
                return <span style={{ cursor: "pointer" }}
                    onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
                >{info.row.original.sales_rep}</span>;
            },
        },
    ]

    //prepare additional coloumns
    let addtionalcolumns = completeData?.map((item: any) => ({

        accessorFn: (row: any) => row[item.target_end_date],
        header: () => <div style={{ textAlign: "center", margin: "auto" }}>
            <span style={{ whiteSpace: "nowrap" }}>{timePipe(item.target_end_date, "DD-MM-YY")}</span>
        </div>,
        id: item.target_end_date,
        width: "800px",
        columns: [
            {
                accessorFn: (row: any) => row.item.volume,
                id: "volume",
                header: () => (
                    <span style={{ whiteSpace: "nowrap" }}>Volume</span>
                ),
                footer: (props: any) => props.column.id,
                width: "80px",
                maxWidth: "220px",
                minWidth: "220px",
                sortDescFirst: false,
                cell: (info: any) => (
                    <span>
                        {info.row.original?.volume.toLocaleString()}
                    </span>
                ),
            },
            {
                accessorFn: (row: any) => row.item.facilities,
                id: "facilities",
                header: () => (
                    <span style={{ whiteSpace: "nowrap" }}>Facilities</span>
                ),
                footer: (props: any) => props.column.id,
                width: "80px",
                maxWidth: "220px",
                minWidth: "220px",
                sortDescFirst: false,
                cell: (info: any) => (
                    <span>
                        {info.row.original?.facilities.toLocaleString()}
                    </span>
                ),
            }
        ]
    }

    ));

    const addAddtionalColoumns = [...columnDef, ...addtionalcolumns]

    const goToSingleRepPage = (repId: string) => {
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

        router.push(`/sales-representatives/${repId}${queryString}`);
    };

    const onUpdateData = ({
        search = searchParams?.search,
        orderBy = searchParams?.order_by,
        orderType = searchParams?.order_type as "asc" | "desc",
    }: Partial<{
        search: string;
        orderBy: string;
        orderType: "asc" | "desc";
    }>) => {
        let queryParams: any = {};
        if (search) {
            queryParams["search"] = search;
        }
        if (orderBy) {
            queryParams["order_by"] = orderBy;
        }
        if (orderType) {
            queryParams["order_type"] = orderType;
        }
        if (params.get("from_date")) {
            queryParams["from_date"] = params.get("from_date");
        }
        if (params.get("to_date")) {
            queryParams["to_date"] = params.get("to_date");
        }

        router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
        let data = [...completeData];

        if (orderBy && orderType) {
            data = sortAndGetData(data, orderBy, orderType);
            if (search) {
                data = data.filter((item: any) =>
                    item.sales_rep
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()?.trim())
                );
            }
        } else {
            data = [...completeData];
            if (search) {
                data = data.filter((item: any) =>
                    item.sales_rep
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()?.trim())
                );
            }
        }
        const modifieData = addSerial(data, 1, data?.length);
        setAllTargetsData(modifieData);
    };

    useEffect(() => {
        queryPreparations({
            fromDate: searchParams?.from_date,
            toDate: searchParams?.to_date,
            searchValue: searchParams?.search,
        });
        if (searchParams?.from_date) {
            setDateFilterDefaultValue([
                new Date(searchParams?.from_date),
                new Date(searchParams?.to_date),
            ]);
        }
    }, []);

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
        );
    }, [params]);

    return (

        <div className="s-no-column" id="salesRepsPage">
            <div >
                <SalesRepsTargetsFilters
                    onUpdateData={onUpdateData}
                    queryPreparations={queryPreparations}
                    dateFilterDefaultValue={dateFilterDefaultValue}
                    setDateFilterDefaultValue={setDateFilterDefaultValue}
                    searchParams={searchParams}
                />
                <MultipleColumnsTableForSalesRep
                    data={allTargetsData}
                    columns={addAddtionalColoumns}
                    loading={loading}
                    searchParams={searchParams}
                    getData={onUpdateData}
                />
                <LoadingComponent loading={loading} />
            </div>
        </div>

    )
}
export default SalesTargets;