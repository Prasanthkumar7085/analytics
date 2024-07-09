import {
  getUniqueMonthsInBilling,
  rearrangeDataWithCasetypes,
} from "@/lib/helpers/apiHelpers";
import { addSerial } from "@/lib/Pipes/addSerial";
import {
  getFacilityMonthWiseInsuranceWiseBilledCaseTypesDataAPI,
  getFacilityMonthWiseInsuranceWiseRevenueCaseTypesDataAPI,
} from "@/services/BillingAnalytics/facilitiesAPIs";
import { useParams } from "next/navigation";
import { useState } from "react";

const InsuranceWiseDetails = ({ searchParams }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [monthWiseInsuranceData, setMonthWiseInsuranceData] = useState<any>([]);
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
          "cases",
          "amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setMonthWiseInsuranceData(rearrangedData);
        // getTotalSumOfCasetypesColmnsWithMonths(
        //   response?.data,
        //   "cases",
        //   "amount"
        // );
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
          "received_amount",
          "targeted_amount"
        );
        const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
          return a.case_type_name.localeCompare(b.case_type_name);
        });
        const modifieData = addSerial(sortedData, 1, sortedData?.length);
        let rearrangedData = rearrangeDataWithCasetypes(modifieData);
        setMonthWiseInsuranceData(rearrangedData);
        // getTotalSumOfCasetypesColmnsWithMonths(
        //   response?.data,
        //   "received_amount",
        //   "targeted_amount"
        // );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return <></>;
};
export default InsuranceWiseDetails;
