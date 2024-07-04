import ExportButton from "@/components/core/ExportButton/ExportButton";
import GraphDialogForFacilities from "@/components/core/GraphDilogForFacilities";
import { useState } from "react";
import CaseTypesColumnTable from "../caseTypesColumnTable";
import { singleCasetypeColumns } from "./SingleCaseTypeDetailsColumns";
import { Backdrop } from "@mui/material";
import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import { graphColors } from "@/lib/constants";
import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import SingleCaseTypeTable from "@/components/core/Table/SingleCaseTypeTable";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import { usePathname, useRouter } from "next/navigation";

const SingleCaseTypeFacilitiesTable = ({
  searchParams,
  caseTypeFacilityDetails,
  monthWiseTotalSum,
  loading,
  headerMonths,
  completeData,
  groupDatasumValue,
  setCaseTypeFacilityDetails,
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
  const onUpdateData = ({
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
  }: Partial<{
    orderBy: string;
    orderType: "asc" | "desc";
  }>) => {
    let queryParams: any = {};
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    if (status) {
      queryParams["status"] = status;
    }
    if (searchParams?.["from_date"]) {
      queryParams["from_date"] = searchParams?.["from_date"];
    }
    if (searchParams?.["to_date"]) {
      queryParams["to_date"] = searchParams?.["to_date"];
    }
    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data = [...completeData];

    if (orderBy && orderType) {
      data = sortAndGetData(data, orderBy, orderType);
    }
    const modifieData = addSerial(data, 1, data?.length);
    setCaseTypeFacilityDetails(modifieData);
    groupDatasumValue(completeData);
  };

  let tableColoumns = [
    ...singleCasetypeColumns,
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
