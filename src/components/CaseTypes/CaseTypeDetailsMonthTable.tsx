import { getRevenueOrVolumeCaseDetailsAPI } from "@/services/caseTypesAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import TanStackTableComponent from "../core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop, CircularProgress } from "@mui/material";
import { SmallGraphInTable } from "../core/SmallGraphIntable";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import GraphDialog from "../core/GraphDialog";
import CaseTypesColumnTable from "./caseTypesColumnTable";
import AreaGraph from "../core/AreaGraph";
import { addSerial } from "@/lib/Pipes/addSerial";

const CaseTypesDetailsMonthTable = ({ tabValue, apiUrl, searchParams, selectedDate }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseData, setCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>({});
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({})
  const [headerMonths, setHeaderMonths] = useState<any>([])
  const [graphValuesData, setGraphValuesData] = useState<any>({})
  const [graphColor, setGraphColor] = useState("")
  let colors: any = {
    "CARDIAC": "#ea1d22",
    "CGX PANEL": "#00a752",
    "CLINICAL CHEMISTRY": "#fcf00b",
    "COVID": "#f19213",
    "COVID FLU": "#00b0ea",
    "DIABETES": "#f51059",
    "GASTRO": "#dc79c8",
    "GTI STI": "#92298f",
    "GTI WOMENS HEALTH": "#2e3094",
    "NAIL": "#0071b9",
    "PAD ALZHEIMERS": "#82eedd",
    "PGX TEST": "#eea782",
    "PULMONARY PANEL": "#000000",
    "RESPIRATORY PATHOGEN PANEL": "#82a8cd",
    "TOXICOLOGY": "#e1dbe4",
    "URINALYSIS": "#f6dad3",
    "UTI": "#87b5af",
    "WOUND": "#185a59",
  };


  const tableRef: any = useRef();
  //get details Volume of caseTypes
  const getDetailsOfCaseTypesOfVolume = async (fromDate: any, toDate: any, searchValue = searchParams?.search,
  ) => {
    setLoading(true);

    let url = `/${apiUrl}/months/volume`;

    try {

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
      const { search, ...updatedQueyParams } = queryParams;

      const response = await getRevenueOrVolumeCaseDetailsAPI(url, updatedQueyParams);
      if (response.status == 200 || response.status == 201) {
        let monthArray = response?.data?.map((item: any) => item.month.replace(/\s/g, ''))
        let uniqueMonths = Array.from(new Set(monthArray));
        setHeaderMonths(uniqueMonths)

        let data = response?.data;
        if (searchValue) {
          data = data.filter((item: any) =>
            item.case_type_name
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase()?.trim())
          );
        }

        const groupedData: any = {};
        // Grouping the data by case_type_id and then by month
        data?.forEach((item: any) => {
          const { case_type_id, case_type_name, month, total_cases } = item;
          if (!groupedData[case_type_id]) {
            groupedData[case_type_id] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, '');

          groupedData[case_type_id][formattedMonth] = total_cases;
        });
        // Converting object to array
        const result = Object.values(groupedData);
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setCaseData(modifieData);



        const groupedDataSum: any = {};
        // Grouping the data by month sum
        data?.forEach((item: any) => {
          const { month, total_cases } = item;
          const formattedMonth = month.replace(/\s/g, '');
          const amount = parseFloat(total_cases);
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

  //get details Revenue of caseTypes
  const getDetailsOfCaseTypesOfRevenue = async (fromDate: any, toDate: any, searchValue = searchParams?.search,) => {
    setLoading(true);
    let url = `/${apiUrl}/months/revenue`;

    try {

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
      const { search, ...updatedQueyParams } = queryParams;

      const response = await getRevenueOrVolumeCaseDetailsAPI(url, updatedQueyParams);
      if (response.status == 200 || response.status == 201) {
        const monthSums: number[] = [];
        let monthArray = response?.data?.map((item: any) => item.month.replace(/\s/g, ''))
        let uniqueMonths = Array.from(new Set(monthArray));
        setHeaderMonths(uniqueMonths)

        let data = response?.data;
        if (searchValue) {
          data = data.filter((item: any) =>
            item.case_type_name
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase()?.trim())
          );
        }

        const groupedData: any = {};
        // Grouping the data by case_type_id and then by month
        data?.forEach((item: any) => {
          const { case_type_id, case_type_name, month, paid_amount } = item;
          if (!groupedData[case_type_id]) {
            groupedData[case_type_id] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, '');

          groupedData[case_type_id][formattedMonth] = paid_amount;
        });
        // Sorting alphabetically based on case_type_name
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        // Converting object to array
        const result = Object.values(sortedData);
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setCaseData(modifieData);

        const groupedDataSum: any = {};
        // Grouping the data by month sum
        data?.forEach((item: any) => {
          const { month, paid_amount } = item;
          const formattedMonth = month.replace(/\s/g, '');
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


  function formatMonthYear(monthYear: string) {
    let month = monthYear.substring(0, 3); // Extract the first 3 characters (abbreviation of month)
    let year = monthYear.substring(monthYear.length - 2); // Extract the last 2 characters (year)
    return month + " '" + year; // Concatenate month abbreviation and year
  }

  let addtionalcolumns = headerMonths?.map((item: any) => ({
    accessorFn: (row: any) => row[item],
    id: item,
    sortDescFirst: false,
    header: () => (
      <span style={{ whiteSpace: "nowrap" }}>{formatMonthYear(item)}</span>
    ),
    footer: (props: any) => props.column.id,
    width: "80px",
    maxWidth: "220px",
    minWidth: "220px",
    cell: (info: any) => (
      <span>
        {tabValue == "Revenue" ? formatMoney(info.getValue()) : info.getValue()?.toLocaleString()}
      </span>
    ),
  }));

  const graphColoumn = [{
    accessorFn: (row: any) => row.actions,
    enableSorting: false,
    id: "actions",
    header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
    footer: (props: any) => props.column.id,
    width: "100px",

    cell: (info: any) => {
      let data = { ...info.row.original }
      delete data?.case_type_id;
      delete data?.case_type_name;
      delete data?.serial;
      return (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setGraphDialogOpen(true);
            setSelectedGraphData(info.row.original);
            setGraphValuesData(data)
            setGraphColor(colors[info.row.original.case_type_name])
          }}
        >
          <AreaGraph data={data} graphColor={colors[info.row.original.case_type_name]} />
        </div>
      );
    },
  },]

  const columnDef =
    [
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



  const addAddtionalColoumns = [...columnDef, ...addtionalcolumns, ...graphColoumn]
  //api call to get details of case types
  useEffect(() => {
    if (selectedDate?.length == 0 && !searchParams?.order_type) {
      if (tabValue == "Revenue") {
        getDetailsOfCaseTypesOfRevenue(
          searchParams?.from_date,
          searchParams?.to_date,
          searchParams?.search
        );
      } else {
        getDetailsOfCaseTypesOfVolume(
          searchParams?.from_date,
          searchParams?.to_date,
          searchParams?.search
        );
      }
    }
  }, [tabValue, searchParams, selectedDate]);


  useEffect(() => {
    if (selectedDate?.length) {
      if (tabValue == "Revenue") {
        getDetailsOfCaseTypesOfRevenue(selectedDate[0], selectedDate[1], searchParams?.search)
      }
      else {
        getDetailsOfCaseTypesOfVolume(selectedDate[0], selectedDate[1], searchParams?.search)
      }
    }
  }, [tabValue, selectedDate])



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
      {/* <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={graphValuesData}
        graphColor={graphColor}
        tabValue={tabValue}

      /> */}
    </div>
  );
};
export default CaseTypesDetailsMonthTable;