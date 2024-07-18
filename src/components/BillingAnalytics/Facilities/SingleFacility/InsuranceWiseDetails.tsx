import CaseTypesColumnTable from "@/components/CaseTypes/caseTypesColumnTable";
import {
  getUniqueMonthsInBilling,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import {
  getFacilityMonthWiseInsuranceWiseBilledCaseTypesDataAPI,
  getFacilityMonthWiseInsuranceWiseRevenueCaseTypesDataAPI,
} from "@/services/BillingAnalytics/facilitiesAPIs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { groupAllBilledAndRevenueColumns } from "../../OverView/MonthWiseStats/MonthWiseCaseTypesStatsColumns";
import { Backdrop } from "@mui/material";
import GraphDialog from "@/components/core/GraphDialog";
import { getTotalSumOfColmnsWithMonths } from "@/lib/helpers/sumsForTableColumns";
import BillingAndRevenueCoreTable from "@/components/core/Table/BillingAndRevenueCoreTable";
import GraphDialogForBillingAndReveune from "@/components/core/GraphDialogForBillingAndRevenue";
import ExportButton from "@/components/core/ExportButton/ExportButton";
import Image from "next/image";
import {
  exportToExcelBillingMonthWiseInsurancesData,
  exportToExcelRevenueMonthWiseInsurancesData,
} from "@/lib/helpers/billingExportHelpers";

const InsuranceWiseDetails = ({ searchParams }: any) => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [monthWiseInsuranceData, setMonthWiseInsuranceData] = useState<any>([]);
  const [totalSumValues, setTotalSumValues] = useState<any>({});
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [graphValuesData, setGraphValuesData] = useState<any>({});
  const [graphColor, setGraphColor] = useState("");
  const [rowTotalSum, setRowTotalSum] = useState<any>([]);
  let tableType = "insurance";
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
        await getMonthWiseRevenueInsuranceData(queryParams);
      } else {
        await getMonthWiseBilledInsuranceData(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupDataWithMonthWise = (data: any, key1: string, key2: string) => {
    const groupedData: any = {};

    data?.forEach((item: any) => {
      const { insurance_id, insurance_name, month_wise } = item;

      if (!groupedData[insurance_id]) {
        groupedData[insurance_id] = {
          insurance_id,
          insurance_name,
        };
      }
      month_wise.forEach((monthItem: any) => {
        const { month } = monthItem;
        const formattedMonth = month.replace(/\s/g, "");
        groupedData[insurance_id][formattedMonth] = [
          monthItem?.[key1],
          monthItem?.[key2],
        ];
      });
    });

    return groupedData;
  };

  const getMonthWiseRevenueInsuranceData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response =
        await getFacilityMonthWiseInsuranceWiseRevenueCaseTypesDataAPI(
          queryParams,
          id
        );
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInBilling(response?.data);
        setHeaderMonths(uniqueMonths);
        const groupedData: any = groupDataWithMonthWise(
          response?.data,
          "targeted_amount",
          "received_amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.insurance_name.localeCompare(b.insurance_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setMonthWiseInsuranceData(modifieData);
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
  const getMonthWiseBilledInsuranceData = async (queryParams: any) => {
    setLoading(true);
    try {
      const response =
        await getFacilityMonthWiseInsuranceWiseBilledCaseTypesDataAPI(
          queryParams,
          id
        );
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsInBilling(response?.data);
        setHeaderMonths(uniqueMonths);
        const groupedData: any = groupDataWithMonthWise(
          response?.data,
          "cases",
          "amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.insurance_name.localeCompare(b.insurance_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        setMonthWiseInsuranceData(modifieData);
        let total = getTotalSumOfColmnsWithMonths(
          response?.data,
          "cases",
          "amount"
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
    <div id="BillingInsuranceCasesTypes">
      <div style={{ position: "relative" }}>
        <div className="eachDataCard">
          <div className="cardHeader">
            <h3>
              <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
              Insurances-wise
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <ExportButton
                onClick={() => {
                  if (searchParams?.tab == "billed") {
                    exportToExcelBillingMonthWiseInsurancesData(
                      monthWiseInsuranceData,
                      headerMonths,
                      totalSumValues
                    );
                  } else {
                    exportToExcelRevenueMonthWiseInsurancesData(
                      monthWiseInsuranceData,
                      headerMonths,
                      totalSumValues
                    );
                  }
                }}
                disabled={monthWiseInsuranceData?.length == 0 ? true : false}
              />
            </div>
          </div>
          <div className="cardBody">
            <BillingAndRevenueCoreTable
              data={monthWiseInsuranceData}
              columns={groupAllBilledAndRevenueColumns({
                headerMonths,
                setGraphDialogOpen,
                setSelectedGraphData,
                setGraphValuesData,
                setGraphColor,
                searchParams,
                tableType,
                router,
              })}
              totalSumValues={totalSumValues}
              loading={loading}
              headerMonths={headerMonths}
              tabValue={searchParams?.tab}
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
          </div>
          <div className="cardBody">
            <GraphDialogForBillingAndReveune
              graphDialogOpen={graphDialogOpen}
              setGraphDialogOpen={setGraphDialogOpen}
              graphData={selectedGrpahData}
              graphValuesData={graphValuesData}
              graphColor={graphColor}
              tabValue={searchParams?.tab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InsuranceWiseDetails;
