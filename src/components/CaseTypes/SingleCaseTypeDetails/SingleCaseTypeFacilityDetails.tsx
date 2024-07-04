import ExportButton from "@/components/core/ExportButton/ExportButton";
import GraphDialogForFacilities from "@/components/core/GraphDilogForFacilities";
import { useState } from "react";
import CaseTypesColumnTable from "../caseTypesColumnTable";
import { singleCasetypeColumns } from "./SingleCaseTypeDetailsColumns";
import { Backdrop } from "@mui/material";
import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import { graphColors } from "@/lib/constants";

const SingleCaseTypeFacilitiesTable = ({
  searchParams,
  caseTypeFacilityDetails,
  monthWiseTotalSum,
  loading,
  headerMonths,
}: any) => {
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");

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
            <AreaGraphForFacilities
              data={data}
              graphColor={graphColors[info.row.original.case_type_name]}
            />
          </div>
        );
      },
    },
  ];

  let tableColoumns = [...singleCasetypeColumns, ...graphColoumn];
  return (
    <div style={{ position: "relative" }}>
      <ExportButton
        // onClick={() => {
        //   exportToExcelCaseTypeTable(caseData, headerMonths, totalSumValues);
        // }}
        disabled={caseTypeFacilityDetails?.length === 0 ? true : false}
      ></ExportButton>
      <CaseTypesColumnTable
        data={caseTypeFacilityDetails}
        columns={tableColoumns}
        totalSumValues={monthWiseTotalSum}
        loading={loading}
        headerMonths={headerMonths}
        tabValue={"volume"}
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
      <GraphDialogForFacilities
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}
        graphValuesData={graphValuesData}
        graphColor={graphColor}
        tabValue={"volume"}
      />
    </div>
  );
};
export default SingleCaseTypeFacilitiesTable;
