import * as XLSX from "xlsx-color";
import { formatMonthYear } from "./apiHelpers";
function sortChronological(data: any) {
  const keys = Object.keys(data).filter(
    (key) => Array.isArray(data[key]) && key !== "rowTotal"
  );

  keys.sort((a, b) => {
    const dateA: any = new Date(a.substring(0, 3) + " 01," + a.substring(3));
    const dateB: any = new Date(b.substring(0, 3) + " 01," + b.substring(3));
    return dateA - dateB;
  });

  const sortedNumbers = keys.map((key) => data[key][0]);

  sortedNumbers.push(data.rowTotal[0]); // Adding 'rowTotal' at the end

  return sortedNumbers;
}
export const exportToExcelMonthWiseCaseTypes = (
  caseData: any,
  headerMonths: any,
  totalSumValues: any,
  rowTotalSum: any
) => {
  const formattedData = caseData.map((obj: any, index: number) => {
    const sortedValues = sortChronological(obj);
    //     Object.entries(obj)
    //   .filter(
    //     ([key, value]) =>
    //       key !== "case_type_name" && key !== "serial" && key !== "case_type_id"
    //   )
    //   .sort((a, b) => {
    //     const monthA = new Date(
    //       a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
    //     ).getTime();
    //     const monthB = new Date(
    //       b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1")
    //     ).getTime();
    //     return monthA - monthB;
    //   })
    //   .map(([_, value]: any) => value[0]);

    return [index + 1, obj.case_type_name, ...sortedValues];
  });
  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );

  let headers = ["Sl.No", "Case Type Name", ...formatHeaderMonth, "Total"];

  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
    })
    .map(([_, value]: any) => value[0]);

  let totalSumSortedValues = ["Total", "", ...total];

  let totalData = [
    ...[headers],
    ...formattedData,
    ...[[...totalSumSortedValues, rowTotalSum[0]]],
  ];

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
  totalSumValues: any,
  newFacilities: any
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
        return monthA - monthB;
      })
      .map(([_, value]: any) => value.toLocaleString());
    return [index + 1, obj.facility_name, ...sortedValues];
  });
  let formatHeaderMonth = headerMonths?.map((item: any) => formatMonthYear(item))
  let headers = ["Sl.No", "Facility Name", ...formatHeaderMonth];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
    })
    .map(([_, value]: any) => value.toLocaleString());


  const totalFacilites: any = Object.entries(newFacilities)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
    })
    .map(([_, value]: any) => value.toLocaleString());


  let totalSumSortedValues = ["Total", "", ...total];
  let totalFacilitesValues = ["Active Facilties", "", ...totalFacilites]

  let totalData = [...[headers], ...formattedData, ...[totalSumSortedValues], ...[totalFacilitesValues]];
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
    return [
      index + 1,
      obj.case_type_name,
      obj.total_targets,
      obj.dayTargets,
      obj.total_cases
    ];
  });
  let headers = ["Sl.No", "Case Type", "Month Targets", "Targets", "Total"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    totalVolumeSum[2]?.value,
    totalVolumeSum[3]?.value,

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
        if (columnIndex === 3 || (columnIndex === 4 && row[3] <= row[4])) {
          worksheet[cellAddress].s = {
            fill: {
              fgColor: { rgb: columnIndex === 3 ? "f0edff" : "f0edff" },
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
      const targets = row[3];
      const total = row[4];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 3 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
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

export const exportToExcelCaseTypesVolumesWithoutDayWiseTargets = (
  caseTypesStatsData: any,
  totalVolumeSum: any
) => {
  const formattedData = caseTypesStatsData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.case_type_name,
      obj.total_targets,
      obj.total_cases
    ];
  });
  let headers = ["Sl.No", "Case Type", "Total Target", "Total"];

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

export const exportToExcelCaseTypesVolumesForFacilites = (
  caseTypesStatsData: any,
  totalVolumeSum: any
) => {
  const formattedData = caseTypesStatsData
    .map((obj: any, index: number) => {
      const sortedValues = Object.entries(obj).map(([_, value]: any) => value);
      return [index + 1, ...sortedValues];
    })
    .map((array: any) => array.slice(1));
  let headers = ["Sl.No", "CASE TYPE", "TOTAL", "FINALIZED", "PENDING"];

  let totalSumSortedValues = [
    "Total",
    "",
    totalVolumeSum[1]?.value,
    totalVolumeSum[2]?.value,
    totalVolumeSum[3]?.value,
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
      obj.role_id == 1 ? "Territory Manager" : obj.role_id == 2 ? "Regional Director" : "Sales Director",
      obj.total_facilities,
      obj.active_facilities,
      obj.total_targets,
      obj.total_cases,
      obj.target_reached ? "Yes" : "No",
    ];
  });
  let mainHeaders = ["", "", "", "FACILITIES", "", "VOLUME", "", ""];
  let headers = [
    "Sl.no",
    "MARKETER NAME",
    "USER TYPE",
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
      const targets = row[5];
      const total = row[6];
      const yesOrNo = row[7];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
      const cellAddressyesOrNo = XLSX.utils.encode_cell({ r: rowIndex, c: 7 });
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
      worksheet[cellAddressyesOrNo].s = {
        font: {
          color: {
            rgb: yesOrNo == "Yes" ?
              "4F7942"
              : "FF0000",
          },
        },

      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "sales-rep-table.xlsx");
};

export const exportToExcelTeamSalesRepTable = (
  salesRepData: any,
  totalSumValues: any
) => {
  const formattedData = salesRepData.flatMap((obj: any, index: any) => {
    let data: any = [
      [
        index + 1,
        obj.sales_rep_name,
        obj.role_id == 1 ? "Territory Manager" : obj.role_id == 2 ? "Regional Director" : "Sales Director",
        obj.total_facilities,
        obj.active_facilities,
        obj.total_targets,
        obj.total_cases,
        obj.target_reached ? "Yes" : "No",
      ],
    ];

    if (obj.team && obj.team.length > 0) {
      // Map through the team members and add them to the data array
      obj.team.forEach((teamMember: any) => {
        data.push([
          "", // Index placeholder for team members
          teamMember.sales_rep_name,
          teamMember.role_id == 1 ? "Territory Manager" : teamMember.role_id == 2 ? "Regional Director" : "Sales Director",
          teamMember.total_facilities,
          teamMember.active_facilities,
          teamMember.total_targets,
          teamMember.total_cases,
          teamMember.target_reached ? "Yes" : "No",
        ]);
      });
    }
    return data;
  });

  let mainHeaders = ["", "", "", "FACILITIES", "", "VOLUME", "", ""];
  let headers = [
    "Sl.no",
    "MARKETER NAME",
    "USER TYPE",
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

  // Styling header row
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }

  // Styling footer row
  const footerRowIndex = totalData.length - 1;
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: footerRowIndex, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }


  // Applying style to team member rows
  formattedData.forEach((rowData: any, rowIndex: any) => {
    if (rowData.length > 0 && rowData[0] === "") {
      for (let colIndex = 1; colIndex < rowData.length; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 2, c: colIndex });
        worksheet[cellAddress].s = {
          fill: {
            fgColor: { rgb: "fef8f7" },
          },
        };
      }
    }
    else {
      for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 2, c: colIndex });
        worksheet[cellAddress].s = {
          fill: {
            fgColor: { rgb: "F0F6F6" },
          },
        };
      }
    }
  });


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
      const targets = row[5];
      const total = row[6];
      const yesOrNo = row[7];
      const cellAddressTarget = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
      const cellAddressyesOrNo = XLSX.utils.encode_cell({ r: rowIndex, c: 7 });
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
      worksheet[cellAddressyesOrNo].s = {
        font: {
          color: {
            rgb: yesOrNo == "Yes" ?
              "4F7942"
              : "FF0000",
          },
        },

      };
    }
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "sales-rep-table.xlsx");
};


export const exportToExcelInsurancesTable = (
  completeData: any,
  totalSumValues: any
) => {
  const formattedData = completeData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.insurance_payor_name,
      obj.no_of_facilities,
      obj.total_cases,
      obj.generated_amount,
      obj.paid_amount,
      obj.pending_amount,
    ];
  });
  let mainHeaders = ["", "", "", "", "REVENUE", "", ""];
  let headers = [
    "S.No",
    "INSURANCE",
    "NO.OF FACILITIES",
    "TOTAL CASES",
    "BILLED",
    "RECEIVED",
    "ARREARS",
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
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  for (let i = 0; i < mainHeaders.length; i++) {
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
      const billed = row[4];
      const received = row[5];
      const arrears = row[6];
      const cellAddressBilled = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const cellAddressReceived = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const cellAddressArrears = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
      const percentCompleted = received / billed / arrears;

      worksheet[cellAddressBilled].s = {
        font: {
          color: { rgb: "ff9932" },
        },
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressReceived].s = {
        font: {
          color: { rgb: "36c24d" },
        },
        fill: {
          fgColor: { rgb: "f5fff7" },
        },
      };
      worksheet[cellAddressArrears].s = {
        font: {
          color: { rgb: "fe5046" },
        },
        fill: {
          fgColor: { rgb: "fff9f9" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "insurances-table.xlsx");
};

export const exportToExcelCaseTypesTable = (
  completeData: any,
  totalSumValues: any
) => {
  const formattedData = completeData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.case_type_name,
      obj.no_of_facilities,
      obj.total_cases,
      obj.generated_amount,
      obj.paid_amount,
      obj.pending_amount,
    ];
  });
  let mainHeaders = ["", "", "", "", "REVENUE", "", ""];
  let headers = [
    "S.No",
    "CASE TYPES",
    "NO.OF FACILITIES",
    "TOTAL CASES",
    "BILLED",
    "RECEIVED",
    "ARREARS",
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
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  for (let i = 0; i < mainHeaders.length; i++) {
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
      const billed = row[4];
      const received = row[5];
      const arrears = row[6];
      const cellAddressBilled = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const cellAddressReceived = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const cellAddressArrears = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
      const percentCompleted = received / billed / arrears;

      worksheet[cellAddressBilled].s = {
        font: {
          color: { rgb: "ff9932" },
        },
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressReceived].s = {
        font: {
          color: { rgb: "36c24d" },
        },
        fill: {
          fgColor: { rgb: "f5fff7" },
        },
      };
      worksheet[cellAddressArrears].s = {
        font: {
          color: { rgb: "fe5046" },
        },
        fill: {
          fgColor: { rgb: "fff9f9" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "case-types-table.xlsx");
};

export const exportToExcelInsurancePayorsVolumeTable = (
  insuranceData: any,
  totalInsurancePayors: any
) => {
  const formattedData = insuranceData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.insurance_name,
      obj.total_cases,
      obj.completed_cases,
      obj.pending_cases,
    ];
  });
  let headers = ["S.No", "INSURANCE NAME", "TOTAL", "FINALIZED", "PENDING"];

  const toatalSumValuesRow = totalInsurancePayors.map((obj: any) =>
    obj.value === null ? "" : obj.value
  );
  let totalData = [...[headers], ...formattedData, ...[toatalSumValuesRow]];

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
  for (let rowIndex = 1; rowIndex < totalData.length; rowIndex++) {
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
      const total = row[2];
      const finalized = row[3];
      const pending = row[4];
      const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 2 });
      const cellAddressFinalized = XLSX.utils.encode_cell({
        r: rowIndex,
        c: 3,
      });
      const cellAddressPending = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const percentCompleted = finalized / total / pending;
      worksheet[cellAddressTotal].s = {
        font: {
          color: { rgb: "ff9932" },
        },
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressFinalized].s = {
        font: {
          color: { rgb: "36c24d" },
        },
        fill: {
          fgColor: { rgb: "f5fff7" },
        },
      };
      worksheet[cellAddressPending].s = {
        font: {
          color: { rgb: "fe5046" },
        },
        fill: {
          fgColor: { rgb: "fff9f9" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "insurance-payors-volume-table.xlsx");
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
        return monthA - monthB;
      })
      .map(([_, value]: any) => value[0] + "/" + value[1]);
    return [index + 1, obj.sales_rep_name, ...sortedValues];
  });
  let formatHeaderMonth = headerMonths?.map((item: any) => formatMonthYear(item))
  let headers = ["Sl.No", "Markerter Name", ...formatHeaderMonth];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
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

  for (let rowIndex = 1; rowIndex < totalData.length - 1; rowIndex++) {
    const row = totalData[rowIndex];
    const worksheetRowIndex = rowIndex;

    for (let colIndex = 2; colIndex < row?.length; colIndex++) {
      const cell = row[colIndex];

      if (typeof cell === "string" && cell.includes("/")) {
        const values = cell.split("/").map((value) => parseInt(value));
        const targets = +values[0];
        const total = +values[1];

        const percentCompleted = total / targets;

        let bgColor = "ffffff"; // Default background color
        // Apply color based on conditions
        if (total >= targets) {
          bgColor = "f5fff7";
        } else if (percentCompleted >= 0.5) {
          bgColor = "feecd1";
        } else {
          bgColor = "ffebe9";
        }

        const cellAddress = XLSX.utils.encode_cell({
          r: worksheetRowIndex,
          c: colIndex,
        });

        // Check if the cell exists in the worksheet before setting its style
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = {}; // Initialize the cell if it doesn't exist
        }

        // Set the style of the cell
        worksheet[cellAddress].s = {
          fill: {
            fgColor: { rgb: bgColor },
          },
        };
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "salesrep-month-wise-targets-status.xlsx");
};

export const exportToExcelFacilitiesTable = (
  facilitiesData: any,
  totalSumValue: any
) => {
  const formattedData = facilitiesData?.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.facility_name,
      obj.sales_rep_name,
      obj.total_cases,
      obj.generated_amount,
      obj.paid_amount,
      obj.pending_amount,
    ];
  });
  let mainHeaders = ["", "", "REVENUE", "", "", "", ""];
  let headers = [
    "Sl.no",
    "FACILITY NAME",
    "MARKETER NAME",
    "TOTAL CASES",
    "BILLED",
    "RECEIVED",
    "ARREARS",
  ];
  const totalSumValuesRow = totalSumValue?.map((obj: any) =>
    obj.value == null ? "" : obj.value
  );
  let totalData = [
    ...[mainHeaders],
    ...[headers],
    ...formattedData,
    ...[totalSumValuesRow],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(totalData);
  for (let i = 0; i < headers.length; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: i });
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "f0edff" },
      },
    };
  }
  for (let i = 0; i < mainHeaders.length; i++) {
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
      const billed = row[4];
      const received = row[5];
      const arrears = row[6];
      const cellAddressBilled = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const cellAddressReceived = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const cellAddressArrears = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
      const percentCompleted = received / billed / arrears;

      worksheet[cellAddressBilled].s = {
        font: {
          color: { rgb: "ff9932" },
        },
        fill: {
          fgColor: { rgb: "f9feff" },
        },
      };
      worksheet[cellAddressReceived].s = {
        font: {
          color: { rgb: "36c24d" },
        },
        fill: {
          fgColor: { rgb: "f5fff7" },
        },
      };
      worksheet[cellAddressArrears].s = {
        font: {
          color: { rgb: "fe5046" },
        },
        fill: {
          fgColor: { rgb: "fff9f9" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "facilities-table.xlsx");
};

export const exportToExcelCaseTypeTable = (
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
        return monthA - monthB;
      })
      .map(([_, value]: any) => value);
    return [index + 1, obj.case_type_name, ...sortedValues];
  });
  let formatHeaderMonth = headerMonths?.map((item: any) => formatMonthYear(item))
  let headers = ["Sl.No", "Case Type Name", ...formatHeaderMonth];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
    })
    .map(([_, value]: any) => value[0]);

  let totalSumSortedValues = ["Total", "", ...total];
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

export const exportToExcelMonthWiseCaseTypeFacilities = (
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
        return monthA - monthB;
      })
      .map(([_, value]: any) => value);
    return [index + 1, obj.case_type_name, ...sortedValues];
  });
  let formatHeaderMonth = headerMonths?.map((item: any) =>
    formatMonthYear(item)
  );
  let headers = ["Sl.No", "Case Type Name", ...formatHeaderMonth];
  const total: any = Object.entries(totalSumValues)
    .sort((a, b) => {
      const dateA: any = new Date(a[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      const dateB: any = new Date(b[0].replace(/(^\w+)(\d{4}$)/i, "$2-$1"));
      return dateA - dateB;
    })
    .map(([_, value]: any) => value);
  let totalSumSortedValues = ["Total", "", ...total];
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
  XLSX.writeFile(workbook, "facilitiesmonth-wise-casetype.xlsx");
};

export const exportToExcelInsurancePayorsFacilities = (
  insuranceData: any,
  totalInsurancePayors: any
) => {
  const formattedData = insuranceData?.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.insurance_name,
      obj.total_cases,
      obj.completed_cases,
      obj.pending_cases,
    ];
  });
  let headers = ["Sl.no", "INSURANCE NAME", "TOTAL", "FINALIZED", "PENDING"];
  const totalSumValuesRow = totalInsurancePayors?.map((obj: any) =>
    obj.value == null ? "" : obj.value
  );
  let totalData = [...[headers], ...formattedData, ...[totalSumValuesRow]];
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
    for (let rowIndex = 1; rowIndex < totalData.length; rowIndex++) {
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
        const total = row[2];
        const finalized = row[3];
        const pending = row[4];
        const cellAddressTotal = XLSX.utils.encode_cell({ r: rowIndex, c: 2 });
        const cellAddressFinalized = XLSX.utils.encode_cell({
          r: rowIndex,
          c: 3,
        });
        const cellAddressPending = XLSX.utils.encode_cell({
          r: rowIndex,
          c: 4,
        });
        const percentCompleted = finalized / total / pending;

        worksheet[cellAddressTotal].s = {
          font: {
            color: { rgb: "ff9932" },
          },
        };
        worksheet[cellAddressFinalized].s = {
          font: {
            color: { rgb: "36c24d" },
          },
        };
        worksheet[cellAddressPending].s = {
          font: {
            color: { rgb: "fe5046" },
          },
        };
      }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "insurance-payors.xlsx");
  }
};


export const exportToExcelInsuranceCaseTypeTable = (
  insuranceData: any,
  totalInsurancePayors: any
) => {
  const formattedData = insuranceData.map((obj: any, index: number) => {
    return [
      index + 1,
      obj.case_type_name,
      obj.total_cases,
      obj.completed_cases,
      obj.generated_amount,
      obj.expected_amount,
      obj.paid_amount,
      obj.pending_cases,
      obj.pending_amount,
      obj.paid_amount + "/" + obj.expected_amount,
    ];
  });
  let headers = [
    "S.No",
    "CASE TYPE",
    "VOLUME",
    "CLEARED VOL",
    "BILLED",
    "EXPECTED",
    "CLEARED BILL",
    "PEN VOL",
    "PENDING REV",
    "PAID PRICE/TARGET PRICE",
  ];

  const toatalSumValuesRow = totalInsurancePayors.map((obj: any) =>
    obj.value === null ? "" : obj.value
  );
  let totalData = [...[headers], ...formattedData, ...[toatalSumValuesRow]];

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
  for (let rowIndex = 1; rowIndex < totalData.length; rowIndex++) {
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
      const expected = row[4];
      const cleared = row[5];
      const cellAddressExpected = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });
      const cellAddressCleared = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
      const percentCompleted = cleared / expected;

      worksheet[cellAddressExpected].s = {
        font: {
          color: { rgb: "36c24d" },
        },
      };
      worksheet[cellAddressCleared].s = {
        font: {
          color: { rgb: "36c24d" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "insurance-case-type-table.xlsx");
};