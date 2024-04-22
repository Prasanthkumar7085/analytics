import CaseTypesColumnTable from "@/components/CaseTypes/caseTypesColumnTable";
import AreaGraph from "@/components/core/AreaGraph";
import AreaGraphForFacilities from "@/components/core/AreaGraph/AreaGraphForFacilities";
import GraphDialogForFacilities from "@/components/core/GraphDilogForFacilities";
import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import SingleSalesRepFacilitiesTable from "@/components/core/Table/TableForSingleSalesRepFacilities";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { colorCodes, graphColors } from "@/lib/constants";
import { formatMonthYear, getUniqueMonths } from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  getRevenueDetailsOfFacilitiesBySalesRepIdAPI,
  getVolumeDetailsOfFacilitiesBySalesRepIdAPI,
} from "@/services/salesRepsAPIs";
import { Backdrop } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Facilities = ({ searchParams, tabValue, selectedCaseValue }: any) => {
  const params = useSearchParams();
  const router = useRouter();
  const { id } = useParams();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [totalSumFacilityValues, setTotalSumFacilityValues] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  //query preparation method
  const queryPreparations = async (
    fromDate: any,
    toDate: any,
    selectedCaseValue: any
  ) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (selectedCaseValue) {
      queryParams["case_type"] = selectedCaseValue?.id;
    }

    try {
      if (tabValue == "Revenue") {
        await getRevenueDetailsSalesRepFacilities(queryParams);
      } else {
        await getVolumeDetailsSalesRepFacilities(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the volume stats for facilities
  const getVolumeDetailsSalesRepFacilities = async (queryParams: any) => {
    try {
      setLoading(true);
      const response = await getVolumeDetailsOfFacilitiesBySalesRepIdAPI({
        id: id as string,
        queryParams,
      });
      if (response?.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);

        const groupedData: any = {};
        response?.data?.forEach((item: any) => {
          const { facility_id, facility_name, month, total_cases } = item;
          if (!groupedData[facility_id]) {
            groupedData[facility_id] = { facility_id, facility_name };
          }
          const formattedMonth = month.replace(/\s/g, "");
          groupedData[facility_id][formattedMonth] = total_cases;
        });

        // Sorting alphabetically based on case_type_name
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.facility_name.localeCompare(b.facility_name);
        });
        // Converting object to array
        const modifieData = addSerial(sortedData, 1, sortedData?.length);

        const groupedDataSum: any = {};
        // Grouping the data by month sum
        response?.data?.forEach((item: any) => {
          const { month, total_cases } = item;
          const formattedMonth = month.replace(/\s/g, "");
          const amount = parseFloat(total_cases);
          if (!groupedDataSum[formattedMonth]) {
            groupedDataSum[formattedMonth] = 0;
          }
          // Add amount to the total_sum for the respective month
          groupedDataSum[formattedMonth] += amount;
        });
        // Convert the object to an array
        setTotalSumFacilityValues(groupedDataSum);
        setFacilitiesData(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the revenue stats for facilities
  const getRevenueDetailsSalesRepFacilities = async (queryParams: any) => {
    try {
      setLoading(true);
      const response = await getRevenueDetailsOfFacilitiesBySalesRepIdAPI({
        id: id as string,
        queryParams,
      });
      if (response?.status == 200 || response.status == 201) {
        let totalCases = 0;
        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalAmount, dolorSymbol: true },
          { value: totalPaid, dolorSymbol: true },
          { value: totalPending, dolorSymbol: true },
        ];
        setTotalSumFacilityValues(result);
        const modifieData = addSerial(
          response?.data,
          1,
          response?.data?.length
        );
        setFacilitiesData(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //go to single facility page after clicking the name of the facility in table
  const goToSingleFacilityPage = (Id: string) => {
    let queryString = "";
    const queryParams: any = {};
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }

    router.push(`/facilities/${Id}${queryString}`);
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
    cell: (info: any) => (
      <span>
        {tabValue == "Revenue"
          ? formatMoney(info.getValue())
          : info.getValue()?.toLocaleString()}
      </span>
    ),
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
        delete data?.facility_id;
        delete data?.facility_name;
        delete data?.serial;

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
      accessorFn: (row: any) => row.facility_name,
      id: "facility_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITY NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            onClick={() => {
              goToSingleFacilityPage(info.row.original.facility_id);
            }}
          >
            {info.row.original.facility_name}
          </span>
        );
      },
    },
  ];

  const addAddtionalColoumns = [
    ...columnDef,
    ...addtionalcolumns,
    ...graphColoumn,
  ];

  useEffect(() => {
    queryPreparations(
      searchParams?.from_date,
      searchParams?.to_date,
      selectedCaseValue
    );
  }, [searchParams, tabValue, selectedCaseValue]);

  return (
    <div style={{ position: "relative" }} id="mothWiseCaseTypeData">
      <SingleSalesRepFacilitiesTable
        data={facilitiesData}
        columns={addAddtionalColoumns}
        totalSumValues={totalSumFacilityValues}
        loading={loading}
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
      <GraphDialogForFacilities
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

export default Facilities;
