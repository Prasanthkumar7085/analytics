import { getRevenueOrVolumeCaseDetailsAPI } from "@/services/caseTypesAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import TanStackTableComponent from "../core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop, CircularProgress } from "@mui/material";
import { SmallGraphInTable } from "../core/SmallGraphIntable";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";

const RevenuVolumeCaseTypesDetails = ({ tabValue }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseData, setCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>(["Total"]);

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
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
  ];

  const tableRef: any = useRef();
  //get details of Revenue or Volume of caseTypes
  const getDetailsOfCaseTypes = async () => {
    setLoading(true);
    let url;
    if (tabValue == "Revenue") {
      url = `/sales-reps/${id}/case-types/revenue`;
    } else {
      url = `/sales-reps/${id}/case-types/volume`;
    }
    try {
      const response = await getRevenueOrVolumeCaseDetailsAPI(url);
      if (response.status == 200 || response.status == 201) {
        const formattedData = [];
        const monthSums: number[] = [];

        // Loop through each month in the data
        for (const month in response?.data) {
          const monthData = response?.data[month].case_type_wise_counts;
          let monthSum = 0;

          // Loop through each case type in the month data
          for (const caseType in monthData) {
            let caseObj: any = formattedData.find(
              (obj) => obj.caseType === caseType
            );
            monthSum += monthData[caseType];
            if (!caseObj) {
              caseObj = { caseType: caseType };
              for (const monthName in response?.data) {
                caseObj[monthName.slice(0, 3).toLowerCase()] = 0;
              }
              // Add the case object to the formatted data array
              formattedData.push(caseObj);
            }

            // Set the count for the current month
            caseObj[month.slice(0, 3).toLowerCase()] = monthData[caseType];
          }
          monthSums.push(monthSum);
        }
        setTotalSumValues([...totalSumValues, ...monthSums.slice(0, 13)]);
        console.log(formattedData, "34o");
        setCaseData(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    ),
  }));

  const columnDef = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.caseType,
        id: "caseType",
        header: () => <span style={{ whiteSpace: "nowrap" }}>Case Types</span>,
        footer: (props: any) => props.column.id,
        width: "220px",
        maxWidth: "220px",
        minWidth: "220px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },

      ...Addtionalcolumns,
      {
        accessorFn: (row: any) => row.actions,
        id: "Actions",
        header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
        footer: (props: any) => props.column.id,
        width: "330px",

        cell: (info: any) => {
          return (
            <div style={{ width: "40%" }}>
              <SmallGraphInTable
                color={colors[info.row.index]}
                graphData={info.row.original}
              />
            </div>
          );
        },
      },
    ],
    []
  );
  //api call to get details of case types
  useEffect(() => {
    getDetailsOfCaseTypes();
  }, [tabValue]);

  return (
    <div style={{ position: "relative" }}>
      <SingleColumnTable
        data={caseData}
        columns={columnDef}
        totalSumValues={totalSumValues}
        loading={false}
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
  );
};
export default RevenuVolumeCaseTypesDetails; 