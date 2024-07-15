import CaseTypesColumnTable from "@/components/CaseTypes/caseTypesColumnTable";
import GraphDialog from "@/components/core/GraphDialog";
import {
  getUniqueMonthsInBilling,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { groupDataWithMonthWise } from "@/lib/helpers/groupApiData";
import { getTotalSumOfColmnsWithMonths } from "@/lib/helpers/sumsForTableColumns";
import { addSerial } from "@/lib/Pipes/addSerial";
import {
  getMonthWiseFacilityBilledCaseTypesDataAPI,
  getMonthWiseFacilityRevenueCaseTypesDataAPI,
} from "@/services/BillingAnalytics/facilitiesAPIs";
import {
  getInsuranceBilledMonthWiseCaseTypeDataAPI,
  getInsuranceRevenueMonthWiseCaseTypeDataAPI,
} from "@/services/BillingAnalytics/insurancesAPIs";
import {
  getMonthWiseBilledCaseTypesDataAPI,
  getMonthWiseRevenueCaseTypesDataAPI,
} from "@/services/BillingAnalytics/overViewAPIs";
import { Backdrop } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { groupAllBilledColumns } from "./MonthWiseCaseTypesStatsColumns";

const MonthWiseCaseTypesStats = ({ searchParams, pathName }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [monthWiseCaseData, setMonthWiseCaseData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>({});
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");
  const [rowTotalSum, setRowTotalSum] = useState<any>([]);
  let tableType = "casetype";
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

  const pathNameBasedBilledApiCall = (queryParams: any) => {
    let responseData: any;
    if (pathName == "overview") {
      responseData = getMonthWiseBilledCaseTypesDataAPI(queryParams);
    }
    if (pathName == "facilities") {
      responseData = getMonthWiseFacilityBilledCaseTypesDataAPI(
        queryParams,
        id
      );
    }
    if (pathName == "insurance") {
      responseData = getInsuranceBilledMonthWiseCaseTypeDataAPI(
        queryParams,
        id
      );
    }
    return responseData;
  };
  const pathNameBasedRevenueApiCall = (queryParams: any) => {
    let responseData: any;
    if (pathName == "overview") {
      responseData = getMonthWiseRevenueCaseTypesDataAPI(queryParams);
    }
    if (pathName == "facilities") {
      responseData = getMonthWiseFacilityRevenueCaseTypesDataAPI(
        queryParams,
        id
      );
    }
    if (pathName == "insurance") {
      responseData = getInsuranceRevenueMonthWiseCaseTypeDataAPI(
        queryParams,
        id
      );
    }
    return responseData;
  };

  const getMonthWiseBilledCaseTypesData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response: any = await pathNameBasedBilledApiCall(queryParams);
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
        let totalSum = getTotalSumOfColmnsWithMonths(
          response?.data,
          "cases",
          "amount"
        );
        setTotalSumValues(totalSum);
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
      const response: any = await pathNameBasedRevenueApiCall(queryParams);
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInBilling(response?.data);
        setHeaderMonths(uniqueMonths);
        const groupedData: any = groupDataWithMonthWise(
          response?.data,
          "targeted_amount",
          "received_amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setMonthWiseCaseData(rearrangedData);
        let total = getTotalSumOfColmnsWithMonths(
          response?.data,
          "targeted_amount",
          "received_amount"
        );
        setTotalSumValues(total);
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
        <CaseTypesColumnTable
          data={monthWiseCaseData}
          columns={groupAllBilledColumns({
            headerMonths,
            setGraphDialogOpen,
            setSelectedGraphData,
            setGraphValuesData,
            setGraphColor,
            searchParams,
            tableType,
          })}
          totalSumValues={totalSumValues}
          loading={loading}
          headerMonths={headerMonths}
          tabValue={"revenue"}
          rowTotalSum={rowTotalSum}
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
        <GraphDialog
          graphDialogOpen={graphDialogOpen}
          setGraphDialogOpen={setGraphDialogOpen}
          graphData={selectedGrpahData}
          graphValuesData={graphValuesData}
          graphColor={graphColor}
          tabValue={searchParams?.tab}
        />
      </div>
    </div>
  );
};
export default MonthWiseCaseTypesStats;
