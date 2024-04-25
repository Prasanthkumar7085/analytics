import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { graphColors } from "@/lib/constants";
import { Backdrop, Button, Tooltip } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AreaGraph from "../core/AreaGraph";
import GraphDialog from "../core/GraphDialog";
import CaseTypesColumnTable from "./caseTypesColumnTable";
import {
  getMonthWiseRevenueCaseTypesForSinglePageAPI,
  getMonthWiseVolumeCaseTypesForSinglePageAPI,
} from "@/services/caseTypesAPIs";
import {
  formatDateToMonthName,
  formatMonthYear,
  getUniqueMonths,
  getUniqueMonthsInCaseTypeTragets,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { exportToExcelMonthWiseCaseTypes } from "@/lib/helpers/exportsHelpers";

const VolumeCaseTypesDetails = ({
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
    const groupedDataSum: any = {};
    data?.forEach((item: any) => {
      const { month, total_cases, total_targets } = item;
      const formattedMonth = month.replace(/\s/g, "");
      const amount = parseFloat(total_cases);
      const targetsAmount = parseFloat(total_targets);

      if (!groupedDataSum[formattedMonth]) {
        groupedDataSum[formattedMonth] = [0, 0];
      }

      // Add amount to the total_sum for the respective month
      groupedDataSum[formattedMonth][0] += amount; // Adding total cases
      groupedDataSum[formattedMonth][1] += targetsAmount; // Adding total targets
    });
    // Convert the object to an array
    setTotalSumValues(groupedDataSum);
  };

  //get details Volume of caseTypes
  const getDetailsOfCaseTypesOfVolume = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getMonthWiseVolumeCaseTypesForSinglePageAPI({
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
          const {
            case_type_id,
            case_type_name,
            month,
            total_cases,
            total_targets,
          } = item;
          if (!groupedData[case_type_name]) {
            groupedData[case_type_name] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, "");

          groupedData[case_type_name][formattedMonth] = [
            total_cases,
            total_targets,
          ];
        });
        // Converting object to array
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setCaseData(rearrangedData);
        console.log(rearrangedData, "ppwqpewq");
        getTotalSumOfCasetypesVolumeWithMonths(response?.data);
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

      // Compare the case values for sorting
      return valueA - valueB;
    },
    cell: (info: any) => (
      <span style={{ cursor: "pointer" }}>
        {tabValue == "Revenue" ? (
          formatMoney(info.getValue())
        ) : (
          <Tooltip
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -5],
                    },
                  },
                ],
              },
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  width: "100px",
                  bgcolor: getBackgroundColor(
                    info.row.original?.[item]?.[0],
                    info.row.original?.[item]?.[1]
                  ),
                  color: "black",
                  border: "1px solid rgba(0,0,0,0.1)",
                  padding: 0,
                  fontSize: "15px",
                  textAlign: "center",
                  "& .MuiTooltip-arrow": {
                    color: "black",
                    "&::before": {
                      border: " 1px solid rgba(0, 0, 0, 0.1)!important",
                    },
                  },
                },
              },
            }}
            title={
              "Target: " + info.row.original?.[item]?.[1]?.toLocaleString()
            }
          >
            <div className="statusTags">
              {info.row.original?.[item]?.[0]?.toLocaleString()}
            </div>
          </Tooltip>
        )}
      </span>
    ),
  }));

  const getBackgroundColor = (totalCases: any, targetVolume: any) => {
    if (targetVolume === 0) {
      if (totalCases === 0) {
        return "#f5fff7"; // Both total cases and target volume are zero
      } else if (totalCases >= targetVolume) {
        return "#f5fff7"; // Both total cases and target volume are zero
      } else {
        return "#ffebe9";
      }
    }

    const percentage = totalCases / targetVolume;
    if (totalCases >= targetVolume) {
      return "#f5fff7"; 
    } else if (percentage >= 0.5) {
      return "#feecd1"; 
    } else {
      return "#ffebe9"; 
    }
  };

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
            <AreaGraph
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            exportToExcelMonthWiseCaseTypes(
              caseData,
              headerMonths,
              totalSumValues
            );
          }}
        >
          Export
        </Button>
      </div>
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
export default VolumeCaseTypesDetails;