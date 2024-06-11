import { addSerial } from "@/lib/Pipes/addSerial";
import { colorCodes, graphColors } from "@/lib/constants";
import {
  changeDateToUTC,
  formatMonthYear,
  getUniqueMonths,
} from "@/lib/helpers/apiHelpers";
import { getDetailsOfTargetsForEverySalesRep } from "@/services/salesRepsAPIs";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import AreaGraph from "../core/AreaGraph";
import { Backdrop } from "@mui/material";
import TargetStatusTanStackTable from "../core/TargetsStatusTanStackTable";
import TargetStausFilters from "./TargetStatusfilters";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import GraphDialogForTargetStatus from "../core/GraphDilaogForTargetStatus";
import AreaGraphForTargetStatus from "../core/AreaGraph/AreaGraphForTargetstaus";
import { addMonths, endOfMonth, startOfMonth } from "rsuite/esm/internals/utils/date";
import dayjs from "dayjs";

const MonthWiseTargetStatus = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>({});
  const [targetData, setTargetData] = useState<any>([]);
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");
  const [completeData, setCompleteData] = useState([]);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  //query preparation method
  const queryPreparations = async (
    fromDate: any,
    toDate: any,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type
  ) => {
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
      await getTargetData(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupTargetsData = (data: any) => {
    const groupedData: any = {};
    data?.forEach((item: any) => {
      const {
        sales_rep_id,
        sales_rep_name,
        month,
        total_targets,
        total_achievements,
      } = item;
      if (!groupedData[sales_rep_id]) {
        groupedData[sales_rep_id] = { sales_rep_id, sales_rep_name };
      }

      const formattedMonth = month.replace(/\s/g, "");

      groupedData[sales_rep_id][formattedMonth] = [
        total_targets,
        total_achievements,
      ];
    });
    return groupedData;
  };

  //get the total sum of the casetypes targets and volume with respective months
  const getTotalSumOfCasetypesVolumeWithMonths = (data: any) => {
    const groupedDataSum: any = {};
    data?.forEach((item: any) => {
      const { sales_rep_name, sales_rep_id, serial, ...monthsData } = item;
      Object.entries(monthsData).forEach(([month, values]: any) => {
        const formattedMonth = month;
        const volume = parseFloat(values[1]);
        const targets = parseFloat(values[0]);

        if (!groupedDataSum[formattedMonth]) {
          groupedDataSum[formattedMonth] = [0, 0];
        }
        groupedDataSum[formattedMonth][0] += targets;
        groupedDataSum[formattedMonth][1] += volume;
      });
    });
    setTotalSumValues(groupedDataSum);
  };

  //get details of targets for every sales rep
  const getTargetData = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);
      const response = await getDetailsOfTargetsForEverySalesRep({
        queryParams,
      });
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);

        let data = response?.data;
        if (queryParams.search) {
          data = data.filter((item: any) =>
            item.sales_rep_name
              ?.toLowerCase()
              ?.includes(queryParams.search?.toLowerCase()?.trim())
          );
        }
        const groupedData: any = groupTargetsData(data);
        setCompleteData(groupedData);
        // Converting object to array
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.sales_rep_name.localeCompare(b.sales_rep_name);
        });

        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setTargetData(modifieData);
        setCompleteData(modifieData);
        getTotalSumOfCasetypesVolumeWithMonths(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    sortingFn: (rowA: any, rowB: any, columnId: any) => {
      const rowDataA = rowA.original[columnId];
      const rowDataB = rowB.original[columnId];

      // Extract the case values from the row data
      const valueA = rowDataA[1] || 0;
      const valueB = rowDataB[1] || 0;
      return valueA - valueB;
    },
    cell: (info: any) => (
      <span style={{ cursor: "pointer" }}>
        <div className="statusTags">
          {info.row.original?.[item]?.[0]?.toLocaleString() +
            "/" +
            info.row.original?.[item]?.[1]?.toLocaleString()}
        </div>
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
        delete data?.sales_rep_id;
        delete data?.sales_rep_name;
        delete data?.serial;

        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setGraphDialogOpen(true);
              setSelectedGraphData(info.row.original);
              setGraphValuesData(data);
              setGraphColor(colorCodes[info.row.original.serial]);
            }}
          >
            <AreaGraphForTargetStatus
              data={data}
              graphColor={colorCodes[info.row.original.serial]}
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
  ];

  const goToSingleRepPage = (repId: string) => {
    let queryString = "";
    let thisMonth = dayjs(startOfMonth(new Date())).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD') ?
      [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1)),]
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
    const queryParams: any = { "from_date": defaultfromDate, "to_date": defaulttoDate };
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date") || defaultfromDate;
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date") || defaulttoDate;
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
    status = searchParams?.status,
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
    status: string;
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
    if (status) {
      queryParams["status"] = status;
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
      if (search) {
        data = data.filter((item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
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
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setTargetData(modifieData);
    getTotalSumOfCasetypesVolumeWithMonths(modifieData);
  };

  const addAddtionalColoumns = [
    ...columnDef,
    ...addtionalcolumns,
    ...graphColoumn,
  ];

  useEffect(() => {
    queryPreparations(
      searchParams?.from_date,
      searchParams?.to_date,
      searchParams?.search
    );
    if (searchParams?.from_date) {
      setDateFilterDefaultValue(
        changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
      );
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div
      style={{ position: "relative" }}
      className="eachDataCard s-no-column"
      id="mothWiseTargetsSaleRep"
    >
      <div>
        <TargetStausFilters
          onUpdateData={onUpdateData}
          queryPreparations={queryPreparations}
          dateFilterDefaultValue={dateFilterDefaultValue}
          setDateFilterDefaultValue={setDateFilterDefaultValue}
          searchParams={searchParams}
          targetData={targetData}
          totalSumValues={totalSumValues}
          headerMonths={headerMonths}
        />
        <TargetStatusTanStackTable
          data={targetData}
          columns={addAddtionalColoumns}
          totalSumValues={totalSumValues}
          loading={loading}
          headerMonths={headerMonths}
        />
      </div>

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
      <GraphDialogForTargetStatus
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={graphValuesData}
        graphColor={graphColor}
      />
    </div>
  );
};
export default MonthWiseTargetStatus;
