import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import GraphDialogForFacilities from "@/components/core/GraphDilogForFacilities";
import SingleCaseTypeTable from "@/components/core/Table/SingleCaseTypeTable";
import { colorCodes } from "@/lib/constants";
import {
  formatMonthYear,
  getAcesdingOrderMonthsForGraphs,
} from "@/lib/helpers/apiHelpers";
import { Backdrop } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { singleCasetypeColumns } from "./SingleCaseTypeDetailsColumns";
import LoadingComponent from "@/components/core/LoadingComponent";

const SingleCaseTypeFacilitiesTable = ({
  searchParams,
  caseTypeFacilityDetails,
  monthWiseTotalSum,
  loading,
  headerMonths,
  completeData,
  groupDatasumValue,
  setCaseTypeFacilityDetails,
  onUpdateData,
  targetsRowData,
}: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");

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
    cell: (info: any) => <span>{info.getValue()?.toLocaleString() || 0}</span>,
  }));

  const graphColoumn = [
    {
      accessorFn: (row: any) => row.actions,
      enableSorting: false,
      id: "actions",
      header: () => <span style={{ whiteSpace: "nowrap" }}>Graph</span>,
      footer: (props: any) => props.column.id,
      width: "100px",

      cell: (info: any) => {
        let data = { ...info.row.original };
        delete data?.facility_id;
        delete data?.facility_name;
        delete data?.serial;
        delete data?.sales_rep_name;
        delete data?.sales_rep_id;
        delete data?.total_targets;
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
            <AreaGraphForFacilities
              data={getAcesdingOrderMonthsForGraphs(data)}
              graphColor={colorCodes[info.row.original.serial]}
            />
          </div>
        );
      },
    },
  ];

  let tableColoumns = [
    ...singleCasetypeColumns(searchParams, router),
    ...addtionalcolumns,
    ...graphColoumn,
  ];
  return (
    <div style={{ position: "relative" }}>
      <SingleCaseTypeTable
        data={caseTypeFacilityDetails}
        columns={tableColoumns}
        totalSumValues={monthWiseTotalSum}
        loading={loading}
        headerMonths={headerMonths}
        getData={onUpdateData}
        targetsRowData={targetsRowData}
      />

      <LoadingComponent loading={loading} />
      <GraphDialogForFacilities
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={getAcesdingOrderMonthsForGraphs(graphValuesData)}
        graphColor={graphColor}
        tabValue={"volume"}
      />
    </div>
  );
};
export default SingleCaseTypeFacilitiesTable;
