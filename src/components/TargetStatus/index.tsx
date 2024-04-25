import { addSerial } from "@/lib/Pipes/addSerial";
import { colorCodes, graphColors } from "@/lib/constants";
import { formatMonthYear, getUniqueMonths } from "@/lib/helpers/apiHelpers";
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
import AreaGraphForTargetStatus from "../core/AreaGraph/AreaGraphForFacilities";
import GraphDialogForTargetStatus from "../core/GraphDilaogForTargetStatus";

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
  const queryPreparations = async (fromDate: any, toDate: any) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
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
      const { month, total_targets, total_achievements } = item;
      const formattedMonth = month?.replace(/\s/g, "");
      const volume = parseFloat(total_achievements);
      const targets = parseFloat(total_targets);

      if (!groupedDataSum[formattedMonth]) {
        groupedDataSum[formattedMonth] = [0, 0];
      }
      groupedDataSum[formattedMonth][0] += targets;
      groupedDataSum[formattedMonth][1] += volume;
    });
    setTotalSumValues(groupedDataSum);
  };
  //get details of targets for every sales rep
  const getTargetData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getDetailsOfTargetsForEverySalesRep({
        queryParams,
      });
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);

        const groupedData: any = groupTargetsData(response?.data);
        setCompleteData(groupedData);

        // Converting object to array
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.sales_rep_name.localeCompare(b.sales_rep_name);
        });

        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setTargetData(modifieData);
        setCompleteData(modifieData);
        getTotalSumOfCasetypesVolumeWithMonths(response?.data);
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
      const valueA = rowDataA[0] || 0;
      const valueB = rowDataB[0] || 0;
      return valueA - valueB;
    },
    cell: (info: any) => (
      <span style={{ cursor: "pointer" }}>
        <div className="statusTags">
          {info.row.original?.[item]?.[1]?.toLocaleString() +
            "/" +
            info.row.original?.[item]?.[0]?.toLocaleString()}
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
      cell: ({ getValue }: any) => {
        return <span>{getValue()}</span>;
      },
    },
  ];

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
      data = sortAndGetData(data, orderBy, orderType);
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
  };

  const addAddtionalColoumns = [
    ...columnDef,
    ...addtionalcolumns,
    ...graphColoumn,
  ];

  useEffect(() => {
    queryPreparations(searchParams?.from_date, searchParams?.to_date);
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
          salesRepsData={targetData}
          totalSumValues={totalSumValues}
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
