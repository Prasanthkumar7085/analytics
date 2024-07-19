import * as XLSX from "xlsx-color";
import { formatMonthYear } from "./apiHelpers";
import datePipe from "../Pipes/datePipe";
import formatMoney from "../Pipes/moneyFormat";

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
        formatMoney(obj.billed_amount),
      ];
    }
  );
  let headers = ["Sl.No", "Case Type", "Billed Cases", "Billed Amount"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    formatMoney(totalVolumeSum[2]?.value),
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
        formatMoney(obj.targeted_amount),
        formatMoney(obj.received_amount),
      ];
    }
  );
  let headers = ["Sl.No", "Case Type", "Target", "Received Amount"];

  let totalSumSortedValues = [
    "Total",
    "",
    formatMoney(totalVolumeSum[1]?.value),
    formatMoney(totalVolumeSum[2]?.value),
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
      ...sortedValues.flatMap((item: any) => [
        item[0] || 0,
        formatMoney(item[1]) || 0,
      ]),
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
    ...total.flatMap((item: any) => [item[0] || 0, formatMoney(item[1]) || 0]),
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
      ...sortedValues.flatMap((item: any) => [
        formatMoney(item[0]) || 0,
        formatMoney(item[1]) || 0,
      ]),
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
    ...total.flatMap((item: any) => [
      formatMoney(item[0]) || 0,
      formatMoney(item[1]) || 0,
    ]),
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
      formatMoney(obj.billed_amount),
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
    formatMoney(totalSumValue[5]?.value),
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
      formatMoney(obj.targeted_amount),
      formatMoney(obj.received_amount),
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
    formatMoney(totalSumValue[3]?.value),
    formatMoney(totalSumValue[4]?.value),
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
      formatMoney(obj.billed_amount),
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
    formatMoney(totalSumValue[5]?.value),
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
      formatMoney(obj.targeted_amount),
      formatMoney(obj.received_amount),
    ];
  });
  let headers = ["Sl.No", "Insurance Name", "Target", "Received"];

  let totalSumSortedValues = [
    "Total",
    "",
    formatMoney(totalSumValue[2]?.value),
    formatMoney(totalSumValue[3]?.value),
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
      ...sortedValues.flatMap((item: any) => [
        item[0] || 0,
        formatMoney(item[1]) || 0,
      ]),
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
    ...total.flatMap((item: any) => [item[0] || 0, formatMoney(item[1]) || 0]),
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
      ...sortedValues.flatMap((item: any) => [
        formatMoney(item[0]) || 0,
        formatMoney(item[1]) || 0,
      ]),
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
    ...total.flatMap((item: any) => [
      formatMoney(item[0]) || 0,
      formatMoney(item[1]) || 0,
    ]),
  ];

  let totalData = [headers, Subheaders, ...formattedData, totalSumSortedValues];
  coreExportFunction(
    totalData,
    headers,
    "monthWise-Revenue-Insurance-stats.xlsx"
  );
};

export const exampleBillingCsvFile = () => {
  let headers = [
    "Encounter ID",
    "Service Date",
    "Claim Form Type",
    "Service To Date",
    "Batch Date",
    "Place Of Service",
    "Chart #",
    "Patient",
    "Patient Id",
    "DOB",
    "Total Charges",
    "Case Name",
    "Case Type",
    "Rendering Provider",
    "Rendering NPI",
    "Billing Provider",
    "Billing NPI",
    "Referring Provider",
    "Referring NPI",
    "Supervising Physician",
    "Supervising NPI",
    "Attending Provider",
    "Attending NPI",
    "Scheduling Provider",
    "Scheduling NPI",
    "Operating Physician",
    "Operating NPI",
    "Other Operating Physician",
    "Other Operating Physician NPI",
    "EPSDT",
    "EPSDT Condition Indicator",
    "Fee Schedule",
    "Encounter ICD Type",
    "Primary Insurance",
    "Payer ID",
    "Primary Policy Number",
    "Financial Class",
    "Payment Responsible Party",
    "Status",
    "Ready-To-Bill Date",
    "Initial Billed Date",
    "Last Claim Status",
    "Prior Authorization Number",
    "Created Date",
    "Created By",
    "Modified Date",
    "Modified By",
    "Inactivated Date",
    "Inactivated By",
    "Line Item Service Date",
    "Line Item Service To Date",
    "Revenue Code",
    "Procedure/CPT Code",
    "CPT Code Description",
    "Line Item Units",
    "Line Item Charge",
    "Line Item Non-Covered Charge",
    "Line Item Total",
    "M1",
    "M2",
    "M3",
    "M4",
    "DXA",
    "DXB",
    "DXC",
    "DXD",
    "Expected Rate",
    "Insurance Payment Amount",
    "Insurance Adjustment Amount",
    "Insurance Write-Off Amount",
    "Patient Payment Amount",
    "Patient Adjustment Amount",
    "Patient Write-Off Amount",
    "Line Item Balance",
    "Line Item EPSDT",
    "Line Item EMG",
    "Line Item Rendering Provider",
    "Line Item Referring Provider",
    "Line Item Purchase Service Provider",
    "Anesthesia Procedure",
    "Anesthesia Start Hour",
    "Anesthesia End Hour",
    "Line Item Status",
    "Line Item Payment Responsible Party",
    "Line Of Business",
    "UB04 Location Type",
    "Admission Type",
    "Admission Source",
    "Admission Date",
    "Admission Hour",
    "Discharge Hour",
    "Discharge Status",
  ];
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "example-billing-csv-file.csv");
};
export const exampleRevenueCsvFile = () => {
  let headers = [
    "Encounter ID",
    "Service Date",
    "Claim Form Type",
    "Service To Date",
    "Batch Date",
    "Place Of Service",
    "Chart #",
    "Patient",
    "Patient Id",
    "DOB",
    "Total Charges",
    "Case Name",
    "Case Type",
    "Rendering Provider",
    "Rendering NPI",
    "Billing Provider",
    "Billing NPI",
    "Referring Provider",
    "Referring NPI",
    "Supervising Physician",
    "Supervising NPI",
    "Attending Provider",
    "Attending NPI",
    "Scheduling Provider",
    "Scheduling NPI",
    "Operating Physician",
    "Operating NPI",
    "Other Operating Physician",
    "Other Operating Physician NPI",
    "EPSDT",
    "EPSDT Condition Indicator",
    "Fee Schedule",
    "Encounter ICD Type",
    "Primary Insurance",
    "Payer ID",
    "Primary Policy Number",
    "Financial Class",
    "Payment Responsible Party",
    "Status",
    "Ready-To-Bill Date",
    "Initial Billed Date",
    "Last Claim Status",
    "Prior Authorization Number",
    "Created Date",
    "Created By",
    "Modified Date",
    "Modified By",
    "Inactivated Date",
    "Inactivated By",
    "Line Item Service Date",
    "Line Item Service To Date",
    "Revenue Code",
    "Procedure/CPT Code",
    "CPT Code Description",
    "Line Item Units",
    "Line Item Charge",
    "Line Item Non-Covered Charge",
    "Line Item Total",
    "M1",
    "M2",
    "M3",
    "M4",
    "DXA",
    "DXB",
    "DXC",
    "DXD",
    "Expected Rate",
    "Insurance Payment Amount",
    "Insurance Adjustment Amount",
    "Insurance Write-Off Amount",
    "Patient Payment Amount",
    "Patient Adjustment Amount",
    "Patient Write-Off Amount",
    "Line Item Balance",
    "Line Item EPSDT",
    "Line Item EMG",
    "Line Item Rendering Provider",
    "Line Item Referring Provider",
    "Line Item Purchase Service Provider",
    "Anesthesia Procedure",
    "Anesthesia Start Hour",
    "Anesthesia End Hour",
    "Line Item Status",
    "Line Item Payment Responsible Party",
    "Line Of Business",
    "UB04 Location Type",
    "Admission Type",
    "Admission Source",
    "Admission Date",
    "Admission Hour",
    "Discharge Hour",
    "Discharge Status",
    "Payment Date",
  ];
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "example-revenue-csv-file.csv");
};
