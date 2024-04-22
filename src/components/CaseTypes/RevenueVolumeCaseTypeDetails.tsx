import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { graphColors } from "@/lib/constants";
import { Backdrop } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AreaGraph from "../core/AreaGraph";
import GraphDialog from "../core/GraphDialog";
import CaseTypesColumnTable from "./caseTypesColumnTable";
import { getMonthWiseRevenueCaseTypesForSinglePageAPI, getMonthWiseVolumeCaseTypesForSinglePageAPI } from "@/services/caseTypesAPIs";
import {
  formatDateToMonthName,
  formatMonthYear,
  getUniqueMonths,
  getUniqueMonthsInCaseTypeTragets,
} from "@/lib/helpers/apiHelpers";

const RevenuVolumeCaseTypesDetails = ({
  tabValue,
  pageName,
  searchParams,
  selectedDate,
}: any) => {
  const { id } = useParams();
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
    tabValue: string
  ) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (id) {
      queryParams["sales_rep"] = id;
    }
    try {
      if (tabValue == "Revenue") {
        await getDetailsOfCaseTypesOfRevenue(queryParams);
      } else {
        await getDetailsOfCaseTypesOfVolume(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the total sum of the casetypes targets and volume with respective months
  const getTotalSumOfCasetypesVolumeWithMonths = (data: any) => {
    const totals: any = {};
    data.forEach(({ case_type, month_wise }: any) => {
      month_wise.forEach(({ month, total_cases, target_cases }: any) => {
        if (!totals[month]) {
          totals[month] = { month, total_cases: 0, target_cases: 0 };
        }
        totals[month].total_cases += total_cases;
        totals[month].target_cases += target_cases;
      });
    });
    const result = Object.values(totals);
    setTotalSumValues(result);
  };

  //get details Volume of caseTypes
  const getDetailsOfCaseTypesOfVolume = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getMonthWiseVolumeCaseTypesForSinglePageAPI({
        queryParams,
      });
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInCaseTypeTragets(response?.data);
        setHeaderMonths(uniqueMonths);

        // Converting object to array
        const sortedData = Object.values(response?.data).sort(
          (a: any, b: any) => {
            return a.case_type.localeCompare(b.case_type);
          }
        );
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        getTotalSumOfCasetypesVolumeWithMonths(modifieData);
        setCaseData(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get details Revenue of caseTypes
  const getDetailsOfCaseTypesOfRevenue = async (queryParams: any) => {
    setLoading(true);

    try {
      const response = await getMonthWiseRevenueCaseTypesForSinglePageAPI({
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
          const { case_type_id, case_type_name, month, paid_amount } = item;
          if (!groupedData[case_type_id]) {
            groupedData[case_type_id] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, "");

          groupedData[case_type_id][formattedMonth] = paid_amount;
        });

        // Sorting alphabetically based on case_type_name
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        // Converting object to array
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setCaseData(modifieData);

        const groupedDataSum: any = {};
        // Grouping the data by month sum
        response?.data?.forEach((item: any) => {
          const { month, paid_amount } = item;
          const formattedMonth = month.replace(/\s/g, "");
          const amount = parseFloat(paid_amount);
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
      <span style={{ whiteSpace: "nowrap" }}>
        {formatDateToMonthName(item)}
      </span>
    ),
    footer: (props: any) => props.column.id,
    width: "80px",
    maxWidth: "220px",
    minWidth: "220px",
    sortDescFirst: false,
    cell: (info: any) => {
      let coloumnData = info.row.original["month_wise"]?.find(
        (itemMonth: any, monthIndex: number) => itemMonth.month == item
      );
      return (
        <div>
          <span>
            {tabValue == "Revenue"
              ? formatMoney(info.getValue())
              : coloumnData?.total_cases
              ? coloumnData?.total_cases?.toLocaleString()
              : 0}
          </span>
          /
          <span>
            {tabValue == "Revenue"
              ? formatMoney(info.getValue())
              : coloumnData?.target_cases
              ? coloumnData?.target_cases?.toLocaleString()
              : 0}
          </span>
        </div>
      );
    },
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
        delete data?.case_type;
        delete data?.serial;

        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setGraphDialogOpen(true);
              setSelectedGraphData(info.row.original);
              setGraphValuesData(data["month_wise"]);
              setGraphColor(
                graphColors[info.row.original.case_type.toUpperCase()]
              );
            }}
          >
            <AreaGraph
              data={data["month_wise"]}
              graphColor={
                graphColors[info.row.original.case_type.toUpperCase()]
              }
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
      accessorFn: (row: any) => row.case_type,
      id: "case_type",
      header: () => <span style={{ whiteSpace: "nowrap" }}>Case Types</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: ({ getValue }: any) => {
        return <span>{getValue().toUpperCase()}</span>;
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
    if (selectedDate?.length == 0) {
      queryPreparations(
        searchParams?.from_date,
        searchParams?.to_date,
        tabValue
      );
    }
  }, [tabValue, searchParams, selectedDate]);

  useEffect(() => {
    if (selectedDate?.length) {
      queryPreparations(selectedDate[0], selectedDate[1], tabValue);
    }
  }, [tabValue, selectedDate]);

  return (
    <div style={{ position: "relative" }}>
      <CaseTypesColumnTable
        data={caseData}
        columns={addAddtionalColoumns}
        totalSumValues={totalSumValues}
        loading={loading}
        headerMonths={headerMonths}
        tabValue={tabValue}
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
      <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={graphValuesData}
        graphColor={graphColor}
        tabValue={tabValue}
      />
    </div>
  );
};
export default RevenuVolumeCaseTypesDetails;