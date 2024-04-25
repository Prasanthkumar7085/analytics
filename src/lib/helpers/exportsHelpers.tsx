import * as XLSX from "xlsx-color";
export const exportToExcelMonthWiseCaseTypes = (
  caseData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = caseData.map((obj: any, index: number) => {
    const sortedValues = Object.entries(obj)
      .filter(
        ([key, value]) =>
          key !== "case_type_name" && key !== "serial" && key !== "case_type_id"
      )
      .sort((a, b) => {
        const monthA = new Date(
          a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
        ).getTime();
        const monthB = new Date(
          b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
        ).getTime();
        return monthB - monthA;
      })
      .map(([_, value]: any) => value[0]);
    return [index + 1, obj.case_type_name, ...sortedValues];
  });
  let headers = ["Sl.No", "Case Type Name", ...headerMonths];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateB - dateA;
    })
    .map(([_, value]: any) => value[0]);

  let totalSumSortedValues = ["Total", "", ...total];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];

  const worksheet = XLSX.utils.aoa_to_sheet(totalData);
  // Setting background color for header cells
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "case-types-month-volume.xlsx");
};

export const exportToExcelMonthWiseFacilitiesVolume = (
  facilitiesData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = facilitiesData.map((obj: any, index: number) => {
    const sortedValues = Object.entries(obj)
      .filter(
        ([key, value]) =>
          key !== "facility_id" && key !== "serial" && key !== "facility_name"
      )
      .sort((a, b) => {
        const monthA = new Date(
          a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
        ).getTime();
        const monthB = new Date(
          b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
        ).getTime();
        return monthB - monthA;
      })
      .map(([_, value]: any) => value);
    return [index + 1, obj.facility_name, ...sortedValues];
  });
  let headers = ["Sl.No", "Facility Name", ...headerMonths];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateB - dateA;
    })
    .map(([_, value]: any) => value);

  let totalSumSortedValues = ["Total", "", ...total];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];

  const worksheet = XLSX.utils.aoa_to_sheet(totalData);
  // Setting background color for header cells
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "facilities-month-wise-volume.xlsx");
};

export const exportToExcelCaseTypesVolumes = (
  caseTypesStatsData: any,
  totalVolumeSum: any
) => {
  const formattedData = caseTypesStatsData.map((obj: any, index: number) => {
    const sortedValues = Object.entries(obj).map(([_, value]: any) => value);
    return [index + 1, ...sortedValues];
  });
  let headers = ["Sl.No", "Case Type", "Targets", "Total"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    totalVolumeSum[2]?.value,
  ];
  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues]];
  const worksheet = XLSX.utils.aoa_to_sheet(totalData);
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  for (let rowIndex = 1; rowIndex < totalData.length; rowIndex++) {
    const row = totalData[rowIndex];
    if (rowIndex === totalData.length - 1) {
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: columnIndex,
        });
        if (columnIndex === 2 || (columnIndex === 3 && row[2] <= row[3])) {
          worksheet[cellAddress].s = {
            fill: {
              fgColor: { rgb: columnIndex === 2 ? "f0edff" : "f0edff" },
            },
          };
        } else {
          worksheet[cellAddress].s = {
            fill: {
              fgColor: { rgb: "f0edff" },
            },
          };
        }
      }
    } else {
      // Data rows
      const targets = row[2];
      const total = row[3];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 2 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 3 });
      worksheet[cellAddressTarget].s = {
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressTotal].s = {
        fill: {
          fgColor: { rgb: total >= targets ? "f5fff7" : "ffebe9" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "casetypes-volume.xlsx");
};
