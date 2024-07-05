import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import GraphDialogForFacilities from "@/components/core/GraphDilogForFacilities";
import SingleCaseTypeTable from "@/components/core/Table/SingleCaseTypeTable";
import { colorCodes } from "@/lib/constants";
import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import { Backdrop } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { singleCasetypeColumns } from "./SingleCaseTypeDetailsColumns";

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
    cell: (info: any) => <span>{info.getValue()?.toLocaleString()}</span>,
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
              data={data}
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
