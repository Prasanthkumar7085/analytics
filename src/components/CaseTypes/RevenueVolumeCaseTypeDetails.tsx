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

const RevenuVolumeCaseTypesDetails = ({ tabValue, apiUrl, searchParams, selectedDate }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseData, setCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>();
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({})
  const [headerMonths, setHeaderMonths] = useState<any>([])
  const [graphValuesData, setGraphValuesData] = useState<any>({})
  const [graphColor, setGraphColor] = useState("")
  let colors = [
    "#ea1d22",
    "#00a752",
    "#fcf00b",
    "#f19213",
    "#00b0ea",
    "#f51059",
    "#dc79c8",
    "#92298f",
    "#2e3094",
    "#0071b9",
    "#82eedd",
    "	#eea782",
    "#000000",
    "#82a8cd",
    "#e1dbe4",
    "#f6dad3",
    "#87b5af",
    "	#185a59",
  ];


  const tableRef: any = useRef();
  //get details Volume of caseTypes
  const getDetailsOfCaseTypesOfVolume = async (fromDate: any, toDate: any) => {
    setLoading(true);
    let url = `/${apiUrl}/${id}/case-types/volume`;

    try {

      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getRevenueOrVolumeCaseDetailsAPI(url, queryParams);
      if (response.status == 200 || response.status == 201) {
        let monthArray = response?.data?.map((item: any) => item.month.replace(/\s/g, ''))
        let uniqueMonths = Array.from(new Set(monthArray));
        setHeaderMonths(uniqueMonths)

        const groupedData: any = {};
        // Grouping the data by case_type_id and then by month
        response?.data?.forEach((item: any) => {
          const { case_type_id, case_type_name, month, total_cases } = item;
          if (!groupedData[case_type_id]) {
            groupedData[case_type_id] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, '');

          groupedData[case_type_id][formattedMonth] = total_cases;
        });
        // Converting object to array
        const result = Object.values(groupedData);
        setCaseData(result);


        const groupedDataSum: any = {};
        // Grouping the data by month sum
        response?.data?.forEach((item: any) => {
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
  const getDetailsOfCaseTypesOfRevenue = async (fromDate: any, toDate: any) => {
    setLoading(true);
    let url = `/${apiUrl}/${id}/case-types/revenue`;

    try {

      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getRevenueOrVolumeCaseDetailsAPI(url, queryParams);
      if (response.status == 200 || response.status == 201) {
        const monthSums: number[] = [];
        let monthArray = response?.data?.map((item: any) => item.month.replace(/\s/g, ''))
        let uniqueMonths = Array.from(new Set(monthArray));
        setHeaderMonths(uniqueMonths)

        const groupedData: any = {};
        // Grouping the data by case_type_id and then by month
        response?.data?.forEach((item: any) => {
          const { case_type_id, case_type_name, month, revenue } = item;
          if (!groupedData[case_type_id]) {
            groupedData[case_type_id] = { case_type_id, case_type_name };
          }

          const formattedMonth = month.replace(/\s/g, '');

          groupedData[case_type_id][formattedMonth] = revenue;
        });
        // Converting object to array
        const result = Object.values(groupedData);
        setCaseData(result);



        const groupedDataSum: any = {};
        // Grouping the data by month sum
        response?.data?.forEach((item: any) => {
          const { month, revenue } = item;
          const formattedMonth = month.replace(/\s/g, '');
          const amount = parseFloat(revenue);
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
    let year = monthYear.substring(monthYear.length - 4); // Extract the last 4 characters (year)
    return month + year; // Concatenate month abbreviation and year
  }

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
    cell: (info: any) => (
      <span>
        {tabValue == "Revenue" ? formatMoney(info.getValue()) : info.getValue()}
      </span>
    ),
  }));

  const graphColoumn = [{
    accessorFn: (row: any) => row.actions,
    id: "Actions",
    header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
    footer: (props: any) => props.column.id,
    width: "100px",

    cell: (info: any) => {
      console.log(info, "p000")
      let data = { ...info.row.original }
      delete data?.case_type_id;
      delete data?.case_type_name;
      return (
        <div
          onClick={() => {
            setGraphDialogOpen(true);
            setSelectedGraphData(info.row.original);
            setGraphValuesData(data)
            setGraphColor(colors[info.row.index])
          }}
        >
          <AreaGraph data={data} graphColor={colors[info.row.index]} />
        </div>
      );
    },
  },]

  const columnDef = useMemo(
    () => [
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

    ],
    []
  );



  const addAddtionalColoumns = [...columnDef, ...addtionalcolumns, ...graphColoumn]
  //api call to get details of case types
  useEffect(() => {
    if (selectedDate?.length == 0) {
      if (tabValue == "Revenue") {
        getDetailsOfCaseTypesOfRevenue(searchParams?.from_date, searchParams?.to_date)
      }
      else {
        getDetailsOfCaseTypesOfVolume(searchParams?.from_date, searchParams?.to_date)
      }
    }
  }, [tabValue, searchParams, selectedDate]);


  useEffect(() => {
    if (selectedDate?.length) {
      if (tabValue == "Revenue") {
        getDetailsOfCaseTypesOfRevenue(selectedDate[0], selectedDate[1])
      }
      else {
        getDetailsOfCaseTypesOfVolume(selectedDate[0], selectedDate[1])
      }
    }
  }, [tabValue, selectedDate])



  return (
    <div style={{ position: "relative" }}>
      <CaseTypesColumnTable
        data={caseData}
        columns={addAddtionalColoumns}
        totalSumValues={totalSumValues}
        loading={false}
        headerMonths={headerMonths}
        tabValue={tabValue}
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
      <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={graphValuesData}
        graphColor={graphColor}

      />
    </div>
  );
};
export default RevenuVolumeCaseTypesDetails; 