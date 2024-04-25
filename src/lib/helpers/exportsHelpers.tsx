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
      const targets = row[2];
      const total = row[3];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 2 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 3 });
      const percentCompleted = total / targets;

      worksheet[cellAddressTarget].s = {
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressTotal].s = {
        fill: {
          fgColor: {
            rgb:
              total >= targets
                ? "f5fff7"
                : percentCompleted >= 0.5
                  ? "feecd1"
                  : "ffebe9",
          },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "casetypes-volume.xlsx");
};
export const exportToExcelSalesRepTable = (
  salesRepData: any,
  totalSumValues: any
) => {
  const formattedData = salesRepData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.sales_rep_name,
      obj.total_facilities,
      obj.active_facilities,
      obj.total_targets,
      obj.total_cases,
      obj.target_reached,
    ];
  });
  let mainHeaders = ["", "", "FACILITIES", "", "VOLUME", "", ""];
  let headers = [
    "Sl.no",
    "MARKETER NAME",
    "TOTAL",
    "ACTIVE",
    "TARGET",
    "TOTAL",
    "TARGET REACHED",
  ];

  const toatalSumValuesRow = totalSumValues.map((obj: any) =>
    obj.value === null ? "" : obj.value
  );
  let totalData = [
    ...[mainHeaders],
    ...[headers],
    ...formattedData,
    ...[toatalSumValuesRow],
  ];

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
  for (let rowIndex = 2; rowIndex < totalData.length; rowIndex++) {
    const row = totalData[rowIndex];

    if (rowIndex === totalData.length - 1) {
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: columnIndex,
        });
        worksheet[cellAddress].s = {
          fill: {
            fgColor: { rgb: "f0edff" },
          },
        };
      }
    } else {
      const targets = row[4];
      const total = row[5];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const percentCompleted = total / targets;

      worksheet[cellAddressTarget].s = {
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressTotal].s = {
        fill: {
          fgColor: {
            rgb:
              total >= targets
                ? "f5fff7"
                : percentCompleted >= 0.5
                  ? "feecd1"
                  : "ffebe9",
          },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "sales-rep-table.xlsx");
};


export const exportToExcelMonthWiseTargetsVolume = (
  targetsData: any,
  headerMonths: any,
  totalSumValues: any
) => {
  const formattedData = targetsData.map((obj: any, index: number) => {
    const sortedValues = Object.entries(obj)
      .filter(
        ([key, value]) =>
          key !== "sales_rep_id" && key !== "serial" && key !== "sales_rep_name"
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
      .map(([_, value]: any) => value[0] + "/" + value[1]);
    return [index + 1, obj.sales_rep_name, ...sortedValues];
  });
  let headers = ["Sl.No", "Markerter Name", ...headerMonths];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateB - dateA;
    })
    .map(([_, value]: any) => value[0] + "/" + value[1]);

  let totalSumSortedValues = ["Total", "", ...total];
  const filteredArray = totalSumSortedValues.filter(
    (value) => value !== "NaN/NaN"
  );

  let totalData = [...[headers], ...formattedData, ...[filteredArray]];

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
  XLSX.writeFile(workbook, "salesrep-month-wise-targets-status.xlsx");
};
