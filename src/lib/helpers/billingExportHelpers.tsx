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

export const exportToExcelBillingMonthWiseCaseTypeData = (
  monthwiseData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = monthwiseData.map((obj: any, index: number) => {
    const sortedValues = headerMonths.map((month: string) => {
      const value = obj[month] || [0, 0];
      return value;
    });
    return [
      index + 1,
      obj.case_type_name,
      ...sortedValues.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
    ];
  });

  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );
  let headers = [
    "",
    "",
    ...formatHeaderMonth.flatMap((item: any) => [item, ""]),
  ];

  let Subheaders = [
    "Sl.No",
    "Case Type Name",
    ...headerMonths.flatMap(() => ["Cases", "Billed"]),
  ];

  const total = headerMonths.map((month: any) => {
    const values = totalSumValues[month] || [0, 0];
    return values;
  });
  let totalSumSortedValues = [
    "Total",
    "",
    ...total.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
  ];

  let totalData = [headers, Subheaders, ...formattedData, totalSumSortedValues];
  coreExportFunction(
    totalData,
    headers,
    "monthWise-billed-case-type-stats.xlsx"
  );
};

export const exportToExcelRevenueMonthWiseCaseTypeData = (
  monthwiseData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = monthwiseData.map((obj: any, index: number) => {
    const sortedValues = headerMonths.map((month: string) => {
      const value = obj[month] || [0, 0];
      return value;
    });
    return [
      index + 1,
      obj.case_type_name,
      ...sortedValues.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
    ];
  });

  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );
  let headers = [
    "",
    "",
    ...formatHeaderMonth.flatMap((item: any) => [item, ""]),
  ];

  let Subheaders = [
    "Sl.No",
    "Case Type Name",
    ...headerMonths.flatMap(() => ["Target", "Received"]),
  ];

  const total = headerMonths.map((month: any) => {
    const values = totalSumValues[month] || [0, 0];
    return values;
  });

  let totalSumSortedValues = [
    "Total",
    "",
    ...total.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
  ];

  let totalData = [headers, Subheaders, ...formattedData, totalSumSortedValues];
  coreExportFunction(
    totalData,
    headers,
    "monthWise-Revenue-case-type-stats.xlsx"
  );
};

export const exportToExcelBilledFacilitiesData = (
  facilitiesData: any,
  totalSumValue: any
) => {
  const formattedData = facilitiesData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.facility_name,
      obj.sales_rep_name,
      obj.total_cases,
      obj.billed_cases,
      obj.billed_amount,
    ];
  });
  let headers = [
    "Sl.No",
    "Facility Name",
    "Marketer Name",
    "Total Cases",
    "Billed Cases",
    "Billed Amount",
  ];

  let totalSumSortedValues = [
    "Total",
    "",
    "",
    totalSumValue[3]?.value,
    totalSumValue[4]?.value,
    totalSumValue[5]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "billed-facilities-data.xlsx");
};

export const exportToExcelRevenueFacilitiesData = (
  facilitiesData: any,
  totalSumValue: any
) => {
  const formattedData = facilitiesData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.facility_name,
      obj.sales_rep_name,
      obj.targeted_amount,
      obj.received_amount,
    ];
  });
  let headers = [
    "Sl.No",
    "Facility Name",
    "Marketer Name",
    "Target",
    "Received",
  ];

  let totalSumSortedValues = [
    "Total",
    "",
    "",
    totalSumValue[3]?.value,
    totalSumValue[4]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "revenue-facilities-data.xlsx");
};

export const exportToExcelBilledInsurancesData = (
  insuranceData: any,
  totalSumValue: any
) => {
  const formattedData = insuranceData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.insurance_payer_name,
      obj.total_cases,
      obj.billed_cases,
      obj.unbilled_cases,
      obj.billed_amount,
    ];
  });
  let headers = [
    "Sl.No",
    "Insurance Name",
    "Total Cases",
    "Billed Cases",
    "UnBilled Amount",
    "Billed Amount",
  ];

  let totalSumSortedValues = [
    "Total",
    "",
    totalSumValue[2]?.value,
    totalSumValue[3]?.value,
    totalSumValue[4]?.value,
    totalSumValue[5]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "billed-insurances-data.xlsx");
};

export const exportToExcelRevenueInsurancesData = (
  insuranceData: any,
  totalSumValue: any
) => {
  const formattedData = insuranceData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.insurance_payer_name,
      obj.targeted_amount,
      obj.received_amount,
    ];
  });
  let headers = ["Sl.No", "Insurance Name", "Target", "Received"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalSumValue[2]?.value,
    totalSumValue[3]?.value,
    totalSumValue[4]?.value,
    totalSumValue[5]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  coreExportFunction(totalData, headers, "revenue-insurances-data.xlsx");
};

export const exportToExcelBillingMonthWiseInsurancesData = (
  monthwiseData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = monthwiseData.map((obj: any, index: number) => {
    const sortedValues = headerMonths.map((month: string) => {
      const value = obj[month] || [0, 0];
      return value;
    });
    return [
      index + 1,
      obj.insurance_name,
      ...sortedValues.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
    ];
  });

  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );
  let headers = [
    "",
    "",
    ...formatHeaderMonth.flatMap((item: any) => [item, ""]),
  ];

  let Subheaders = [
    "Sl.No",
    "Insurances Name",
    ...headerMonths.flatMap(() => ["Cases", "Billed"]),
  ];

  const total = headerMonths.map((month: any) => {
    const values = totalSumValues[month] || [0, 0];
    return values;
  });
  let totalSumSortedValues = [
    "Total",
    "",
    ...total.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
  ];

  let totalData = [headers, Subheaders, ...formattedData, totalSumSortedValues];
  coreExportFunction(
    totalData,
    headers,
    "monthWise-billed-Insurances-stats.xlsx"
  );
};

export const exportToExcelRevenueMonthWiseInsurancesData = (
  monthwiseData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = monthwiseData.map((obj: any, index: number) => {
    const sortedValues = headerMonths.map((month: string) => {
      const value = obj[month] || [0, 0];
      return value;
    });
    return [
      index + 1,
      obj.insurance_name,
      ...sortedValues.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
    ];
  });

  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );
  let headers = [
    "",
    "",
    ...formatHeaderMonth.flatMap((item: any) => [item, ""]),
  ];

  let Subheaders = [
    "Sl.No",
    "Insurances Name",
    ...headerMonths.flatMap(() => ["Target", "Received"]),
  ];

  const total = headerMonths.map((month: any) => {
    const values = totalSumValues[month] || [0, 0];
    return values;
  });

  let totalSumSortedValues = [
    "Total",
    "",
    ...total.flatMap((item: any) => [item[0] || 0, item[1] || 0]),
  ];

  let totalData = [headers, Subheaders, ...formattedData, totalSumSortedValues];
  coreExportFunction(
    totalData,
    headers,
    "monthWise-Revenue-Insurance-stats.xlsx"
  );
};
