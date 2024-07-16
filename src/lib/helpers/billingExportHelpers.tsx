import * as XLSX from "xlsx-color";
import { formatMonthYear } from "./apiHelpers";
import datePipe from "../Pipes/datePipe";

const coreExportFunction = (
  totalData: any,
  headers: any,
  exportName: string
) => {
  const worksheet = XLSX.utils.aoa_to_sheet(totalData);
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }

  const footerRowIndex = totalData.length - 1;
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: footerRowIndex, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, exportName);
};

export const exportToExcelBilledCaseTypesStatsData = (
  caseTypesWiseStatsData: any,
  totalVolumeSum: any
) => {
  const formattedData = caseTypesWiseStatsData.map(
    (obj: any, index: number) => {
      return [
        index + 1,
        obj.case_type_name,
        obj.billed_cases,
        obj.billed_amount,
      ];
    }
  );
  let headers = ["Sl.No", "Case Type", "Billed Cases", "Billed Amount"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    totalVolumeSum[2]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "billing-case-type-stats.xlsx");
};

export const exportToExcelRevenueCaseTypesStatsData = (
  caseTypesWiseStatsData: any,
  totalVolumeSum: any
) => {
  const formattedData = caseTypesWiseStatsData.map(
    (obj: any, index: number) => {
      return [
        index + 1,
        obj.case_type_name,
        obj.targeted_amount,
        obj.received_amount,
      ];
    }
  );
  let headers = ["Sl.No", "Case Type", "Target", "Received Amount"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    totalVolumeSum[2]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "revenue-case-type-stats.xlsx");
};
