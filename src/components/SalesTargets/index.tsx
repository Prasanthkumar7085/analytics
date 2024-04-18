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
import { formatMothNameWithYear, getOnlyMonthNames, getUniqueMonths } from "@/lib/helpers/apiHelpers";
import timePipe from "@/lib/Pipes/timePipe";
import { IconButton, TextField } from "@mui/material";
import Image from "next/image";
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

const SalesTargets = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [allTargetsData, setAllTargetsData] = useState<any>([]);
    const [completeData, setCompleteData] = useState([]);
    const [defaultYearValue, setDefaultYearValue] = useState<any>();
    const [headerMonths, setHeaderMonths] = useState<any>([]);
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
    const [totalSumValues, setTotalSumValues] = useState<any>([]);
    const [selectedValues, setSelectedValues] = useState<any>({})
    //query preparation method
    const queryPreparations = async ({
        year,
        searchValue = searchParams?.search,
        orderBy = searchParams?.order_by,
        orderType = searchParams?.order_type,
    }: any) => {
        let queryParams: any = { year: 2024 };

        if (year) {
            queryParams["year"] = year;
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

    //get total sum of the every month
    const getTotalSumsOfMonths = (data: any) => {
        const result: any = [[{ value: "Total", dolorSymbol: false },
        { value: null, dolorSymbol: false }]];
        // Calculate totals
        const months = ["jan", "feb", "mar", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];
        months.forEach(month => {
            const volumeTotal = data.reduce((acc: any, item: any) => acc + item[month][0], 0);
            const facilitiesTotal = data.reduce((acc: any, item: any) => acc + item[month][1], 0);

            let makeVolumeObj = { value: volumeTotal, dolorSymbol: false }
            let makeFacilitiesObj = { value: facilitiesTotal, dolorSymbol: false }
            result.push([makeVolumeObj, makeFacilitiesObj]);
        });
        setTotalSumValues(result.flat())

    }

    //get all sales reps data event
    const getAllSalesRepTargets = async (queryParams: any) => {
        setLoading(true);
        try {
            let queryString = prepareURLEncodedParams("", queryParams);

            router.push(`${pathname}${queryString}`);

            const response = await getSalesRepTargetsAPI(queryParams);
            if (response.status == 200 || response.status == 201) {
                setCompleteData(response?.data);

                let data = response?.data;
                if (queryParams.search) {
                    data = data.filter((item: any) =>
                        item.sales_rep_name
                            ?.toLowerCase()
                            ?.includes(queryParams.search?.toLowerCase()?.trim())
                    );
                }
                data = sortAndGetData(data, queryParams.order_by, queryParams.order_type);
                const modifieData = addSerial(data, 1, data?.length);
                setAllTargetsData(modifieData);
                getTotalSumsOfMonths(modifieData)
                let uniqueMonths = getOnlyMonthNames(response?.data);
                setHeaderMonths(uniqueMonths)

            } else {
                throw response;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDoubleClick = (value: any, type: string, month: string, salesID: any) => {
        setSelectedValues({
            selectedColumnType: type,
            selectedTypeValue: value,
            selectedMonth: month,
            selectedSalesRepID: salesID
        })
    }

    const checkEditOrNot = (value: any, type: string, month: string, salesID: any) => {
        console.log(value, type, month, salesID)
        console.log(selectedValues)
        if (value == selectedValues.selectedTypeValue && type == selectedValues.selectedColumnType && month == selectedValues.selectedMonth && salesID == selectedValues.selectedSalesRepID) {
            return true;
        }
        else {
            return false;
        }
    }

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
            accessorFn: (row: any) => row.sales_rep_name,
            id: "sales_rep_name",
            header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
            footer: (props: any) => props.column.id,
            width: "220px",
            maxWidth: "220px",
            minWidth: "220px",
            cell: (info: any) => {
                return <span style={{ cursor: "pointer" }}
                    onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
                >{info.row.original.sales_rep_name}</span>;
            },
        },
    ]

    //prepare additional coloumns
    let addtionalcolumns = headerMonths?.map((item: any) => ({

        accessorFn: (row: any) => row[item],
        header: () => <div style={{ textAlign: "center", margin: "auto" }}>
            <span style={{ whiteSpace: "nowrap" }}>{formatMothNameWithYear(item, searchParams.year as string)}</span>
        </div>,
        id: item,
        width: "800px",
        columns: [
            {
                accessorFn: (row: any) => row.item,
                id: "volume",
                editable: true,
                header: () => (
                    <span style={{ whiteSpace: "nowrap" }}>Volume</span>
                ),
                footer: (props: any) => props.column.id,
                width: "80px",
                maxWidth: "220px",
                minWidth: "220px",
                sortDescFirst: false,
                cell: (info: any) => (
                    <span onDoubleClick={() => handleDoubleClick(info.row.original?.[item][0], "volume", item, info.row.original.sales_rep_id)}>
                        {checkEditOrNot(info.row.original?.[item][0], "volume", item, info.row.original.sales_rep_id) ?
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "centers" }}>
                                <TextField value={info.row.original?.[item][0]} />
                                <IconButton sx={{ padding: "0" }}>
                                    <SaveTwoToneIcon sx={{ fontSize: '15px' }} color='success' />
                                </IconButton>
                                <IconButton onClick={() => setSelectedValues({})} sx={{ padding: "0" }}>
                                    <CancelTwoToneIcon sx={{ fontSize: '15px' }} color='error' />
                                </IconButton>
                            </div>
                            : info.row.original?.[item][0]?.toLocaleString()}
                    </span>
                ),
            },
            {
                accessorFn: (row: any) => row.item,
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
                    <span onDoubleClick={() => handleDoubleClick(info.row.original?.[item][1], "facilities", item, info.row.original.sales_rep_id)}>
                        {checkEditOrNot(info.row.original?.[item][1], "facilities", item, info.row.original.sales_rep_id) ?
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "centers" }}>
                                <TextField value={info.row.original?.[item][1]} />
                                <IconButton>
                                    <SaveTwoToneIcon sx={{ fontSize: '15px' }} color='success' />
                                </IconButton>
                                <IconButton onClick={() => setSelectedValues({})} sx={{ padding: "0" }}>
                                    <CancelTwoToneIcon sx={{ fontSize: '15px' }} color='error' />
                                </IconButton>
                            </div>
                            : info.row.original?.[item][1]?.toLocaleString()}
                    </span>
                ),
            }
        ]
    }

    ));

    const addAddtionalColoumns = [...columnDef, ...addtionalcolumns]

    //go to single sales rep page
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
        if (params.get("year")) {
            queryParams["year"] = params.get("year");
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
                    item.sales_rep_name
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()?.trim())
                );
            }
        } else {
            data = [...completeData];
            if (search) {
                data = data.filter((item: any) =>
                    item.sales_rep_name
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()?.trim())
                );
            }
        }
        const modifieData = addSerial(data, 1, data?.length);
        setAllTargetsData(modifieData);
        getTotalSumsOfMonths(modifieData)
    };

    useEffect(() => {
        queryPreparations({
            year: searchParams?.year,
            searchValue: searchParams?.search,
        });
        if (searchParams?.year) {
            setDefaultYearValue({ year: searchParams.year });
        }
    }, []);

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
        );
    }, [params]);

    return (

        <div className="s-no-column" id="salesTarget">
            <div >
                <SalesRepsTargetsFilters
                    onUpdateData={onUpdateData}
                    queryPreparations={queryPreparations}
                    dateFilterDefaultValue={defaultYearValue}
                    setDateFilterDefaultValue={setDefaultYearValue}
                    searchParams={searchParams}
                />
                <MultipleColumnsTableForSalesRep
                    data={allTargetsData}
                    columns={addAddtionalColoumns}
                    loading={loading}
                    searchParams={searchParams}
                    getData={onUpdateData}
                    totalSumValues={totalSumValues}
                />
                <LoadingComponent loading={loading} />
            </div>
        </div>

    )
}
export default SalesTargets;