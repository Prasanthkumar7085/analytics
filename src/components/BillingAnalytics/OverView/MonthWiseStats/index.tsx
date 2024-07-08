import CaseTypesColumnTable from "@/components/CaseTypes/caseTypesColumnTable";
import {
  getUniqueMonthsInBilling,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import {
  getMonthWiseBilledCaseTypesDataAPI,
  getMonthWiseRevenueCaseTypesDataAPI,
} from "@/services/BillingAnalytics/overViewAPIs";
import { useEffect, useState } from "react";
import { groupAllBilledColumns } from "./MonthWiseCaseTypesStatsColumns";
import GraphDialog from "@/components/core/GraphDialog";
import { Backdrop } from "@mui/material";

const MonthWiseCaseTypesStats = ({ searchParams }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [monthWiseCaseData, setMonthWiseCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>({});
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");
  const [rowTotalSum, setRowTotalSum] = useState<any>([]);

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
    if (tabValue) {
      queryParams["tab"] = tabValue;
    }
    try {
      if (tabValue == "revenue") {
        await getMonthWiseRevenueCaseTypesData(queryParams);
      } else {
        await getMonthWiseBilledCaseTypesData(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSumOfCasetypesColmnsWithMonths = (
    data: any,
    key1: string,
    key2: string
  ) => {
    const groupedDataSum: any = {};
    data?.forEach((item: any) => {
      const { case_type_id, case_type_name, month_wise } = item;
      month_wise.forEach((monthItem: any) => {
        const { month } = monthItem;
        const firstColumn = parseFloat(monthItem?.[key1]);
        const secondColumn = parseFloat(monthItem?.[key2]);

        const formattedMonth = month.replace(/\s/g, "");
        if (!groupedDataSum[formattedMonth]) {
          groupedDataSum[formattedMonth] = [0, 0];
        }

        groupedDataSum[formattedMonth][0] += firstColumn;
        groupedDataSum[formattedMonth][1] += secondColumn;
      });
    });
    setTotalSumValues(groupedDataSum);
  };

  //get the total sum of the each row
  const calculateRowTotal = (rowData: any, uniqueMonths: any) => {
    let totalVolume = 0;
    let totalTarget = 0;
    uniqueMonths.forEach((month: any) => {
      const formattedMonth = month.replace(/\s/g, "");
      if (rowData[formattedMonth]) {
        totalVolume += parseFloat(rowData[formattedMonth][0]);
        totalTarget += parseFloat(rowData[formattedMonth][1]);
      }
    });
    rowData["rowTotal"] = [totalVolume, totalTarget];
    return rowData;
  };

  const groupDataWithMonthWise = (data: any, key1: string, key2: string) => {
    const groupedData: any = {};

    data?.forEach((item: any) => {
      const { case_type_id, case_type_name, month_wise } = item;

      if (!groupedData[case_type_id]) {
        groupedData[case_type_id] = {
          case_type_id,
          case_type_name,
        };
      }
      month_wise.forEach((monthItem: any) => {
        const { month } = monthItem;
        const formattedMonth = month.replace(/\s/g, "");
        groupedData[case_type_id][formattedMonth] = [
          monthItem?.[key1],
          monthItem?.[key2],
        ];
      });
    });

    return groupedData;
  };

  const getMonthWiseBilledCaseTypesData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getMonthWiseBilledCaseTypesDataAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInBilling(response?.data);
        setHeaderMonths(uniqueMonths);
        const groupedData: any = groupDataWithMonthWise(
          response?.data,
          "cases",
          "amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setMonthWiseCaseData(rearrangedData);
        getTotalSumOfCasetypesColmnsWithMonths(
          response?.data,
          "cases",
          "amount"
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getMonthWiseRevenueCaseTypesData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getMonthWiseRevenueCaseTypesDataAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInBilling(response?.data);
        setHeaderMonths(uniqueMonths);
        const groupedData: any = groupDataWithMonthWise(
          response?.data,
          "received_amount",
          "targeted_amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setMonthWiseCaseData(rearrangedData);
        getTotalSumOfCasetypesColmnsWithMonths(
          response?.data,
          "received_amount",
          "targeted_amount"
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryPreparations(
      searchParams?.from_date,
      searchParams?.to_date,
      searchParams?.tab
    );
  }, [searchParams]);
  return (
    <div id="mothWiseCaseTypeData">
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        ></div>
        {headerMonths?.length ? (
          <CaseTypesColumnTable
            data={monthWiseCaseData}
            columns={groupAllBilledColumns({
              headerMonths,
              setGraphDialogOpen,
              setSelectedGraphData,
              setGraphValuesData,
              setGraphColor,
              searchParams,
            })}
            totalSumValues={totalSumValues}
            loading={loading}
            headerMonths={headerMonths}
            tabValue={"revenue"}
            rowTotalSum={rowTotalSum}
          />
        ) : (
          ""
        )}
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
          tabValue={"revenue"}
        />
      </div>
    </div>
  );
};
export default MonthWiseCaseTypesStats;
