import { getRevenueOrVolumeCaseDetailsAPI } from "@/services/caseTypesAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import TanStackTableComponent from "../core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Backdrop, CircularProgress } from "@mui/material";
import { SmallGraphInTable } from "../core/SmallGraphIntable";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import GraphDialog from "../core/GraphDialog";

const RevenuVolumeCaseTypesDetails = ({ tabValue, apiUrl }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseData, setCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>(["Total"]);
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({})
  const [headerMonths, setHeaderMonths] = useState<any>([])
  useEffect(() => {
    addtionalcolumns = [];
  }, [tabValue]);
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
      url = `/${apiUrl}/${id}/case-types/revenue`;
    } else {
      url = `/${apiUrl}/${id}/case-types/volume`;
    }
    try {
      const response = await getRevenueOrVolumeCaseDetailsAPI(url);
      if (response.status == 200 || response.status == 201) {
        const monthSums: number[] = [];
        let monthArray = response?.data?.map((item: any) => item.month)
        let uniqueMonths = Array.from(new Set(monthArray));
        setHeaderMonths(uniqueMonths)
        const groupedData = response?.data.reduce((acc: any, curr: any) => {
          const { case_type_name, month, total_cases } = curr;

          if (!acc[case_type_name]) {
            acc[case_type_name] = {};
          }

          acc[case_type_name][month] = total_cases;

          return acc;
        }, {});

        console.log(groupedData, "p0032")

        setTotalSumValues([...totalSumValues, ...monthSums.slice(0, 13)]);

        setCaseData(groupedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let addtionalcolumns = headerMonths?.map((item: any) => ({
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
      <span>
        {tabValue == "Revenue" ? formatMoney(info.getValue()) : info.getValue()}
      </span>
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

      ...addtionalcolumns,
      {
        accessorFn: (row: any) => row.actions,
        id: "Actions",
        header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
        footer: (props: any) => props.column.id,
        width: "330px",

        cell: (info: any) => {
          return (
            <div
              style={{ width: "40%" }}
              onClick={() => {
                setGraphDialogOpen(true);
                setSelectedGraphData(info.row.original);
              }}
            >
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
      {/* <SingleColumnTable
        data={caseData}
        columns={columnDef}
        totalSumValues={totalSumValues}
        loading={false}
      /> */}

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
      <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}

      />
    </div>
  );
};
export default RevenuVolumeCaseTypesDetails; 