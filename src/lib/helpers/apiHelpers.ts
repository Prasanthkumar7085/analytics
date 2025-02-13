import dayjs from "dayjs";

export const getUniqueMonths = (data: any) => {
  let monthArray = data?.map((item: any) => item.month.replace(/\s/g, ""));

  let descendingOrder: any = getAcendingOrder(monthArray);
  // Get unique sorted months
  let uniqueMonths = Array.from(new Set(descendingOrder));
  return uniqueMonths;
};

export const getUniqueMonthsInBilling = (data: any) => {
  let monthArray = data?.flatMap((item: any) =>
    item.month_wise.map((monthItem: any) => monthItem.month.replace(/\s/g, ""))
  );
  let descendingOrder: any = getAcendingOrder(monthArray);
  // Get unique sorted months
  let uniqueMonths = Array.from(new Set(descendingOrder));
  return uniqueMonths;
};
const getDescendingOrder = (monthArray: any) => {
  // Sort the month names in descending order
  monthArray.sort((a: string, b: string) => {
    // Convert the month names into sortable Date objects
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndexA = monthNames.indexOf(a.substr(0, 3));
    const yearA = parseInt(a.substr(3));
    const dateA = new Date(yearA, monthIndexA);

    const monthIndexB = monthNames.indexOf(b.substr(0, 3));
    const yearB = parseInt(b.substr(3));
    const dateB = new Date(yearB, monthIndexB);

    // Sort in descending order
    return dateB.getTime() - dateA.getTime();
  });
  return monthArray;
};
export const getAcendingOrder = (monthArray: any) => {
  // Sort the month names in descending order
  monthArray.sort((a: string, b: string) => {
    // Convert the month names into sortable Date objects
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndexA = monthNames.indexOf(a.substr(0, 3));
    const yearA = parseInt(a.substr(3));
    const dateA = new Date(yearA, monthIndexA);

    const monthIndexB = monthNames.indexOf(b.substr(0, 3));
    const yearB = parseInt(b.substr(3));
    const dateB = new Date(yearB, monthIndexB);

    // Sort in descending order
    return dateA.getTime() - dateB.getTime();
  });
  return monthArray;
};

export const getUniqueMonthsForAutoCompleted = (data: any) => {
  let monthArray = data?.map((item: any) => item.month.replace(/\s/g, ""));

  let descendingOrder: any = getDescendingOrder(monthArray);
  // Get unique sorted months
  let uniqueMonths = Array.from(new Set(descendingOrder));
  return uniqueMonths;
};
export const getAcesdingOrderMonthsForGraphs = (monthArray: any) => {
  const monthArrayKeys = Object?.keys(monthArray);
  monthArrayKeys.sort((a, b) => {
    const [monthA, yearA] = a.split(/(\d+)/).filter(Boolean);
    const [monthB, yearB] = b.split(/(\d+)/).filter(Boolean);

    const yearComparison = parseInt(yearA) - parseInt(yearB);
    if (yearComparison !== 0) {
      return yearComparison; // Sort by year
    }
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndexA = monthNames.indexOf(monthA);
    const monthIndexB = monthNames.indexOf(monthB);

    return monthIndexA - monthIndexB;
  });
  const sortedMonthArray: any = {};
  monthArrayKeys.forEach((key) => {
    sortedMonthArray[key] = monthArray[key];
  });

  return sortedMonthArray;
};

export const getUniqueMonthsInCaseTypeTragets = (data: any) => {
  let uniqueMonths: any = [];
  data.forEach((obj: any) => {
    obj.month_wise.forEach((item: any) => {
      if (!uniqueMonths.includes(item.month)) {
        uniqueMonths.push(item.month);
      }
    });
  });
  // Sort unique months in high to low order based on calendar order
  uniqueMonths.sort((a: any, b: any) => {
    // Extract month and year from the strings
    const [monthA, yearA] = a.split("-");
    const [monthB, yearB] = b.split("-");

    if (yearA !== yearB) {
      return parseInt(yearB) - parseInt(yearA); // Sort years in descending order
    }
    return parseInt(monthB) - parseInt(monthA); // Sort months in descending order
  });

  return uniqueMonths;
};

export const formatMonthYear = (monthYear: string) => {
  let month = monthYear?.substring(0, 3);
  let year = monthYear?.substring(monthYear.length - 2);
  return month + " '" + year;
};

//Function to get the abbreviation of the month
const getMonthAbbreviation = (month: string) => {
  const months: any = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  return months[month];
};
export const formatDateToMonthName = (date: any) => {
  const [month, year] = date.split("-");
  const monthAbbreviation = getMonthAbbreviation(month);
  const formattedYear = year.slice(2);
  return `${monthAbbreviation} '${formattedYear}`;
};

export const getOnlyMonthNames = (data: any) => {
  let responseData = [...data];
  const monthNames = Object.keys(responseData[0]).filter(
    (key) =>
      key !== "id" &&
      key !== "sales_rep_id" &&
      key !== "year" &&
      key !== "sales_rep_name"
  );
  return monthNames;
};

export const formatMothNameWithYear = (month: string, year: string) => {
  let monthValue = month.substring(0, 1).toUpperCase() + month.substring(1, 3);
  let yearValue = year?.substring(year.length - 2);
  return monthValue + " '" + yearValue;
};
export const checkNumbersOrnot = (event: any) => {
  const value = event.target.value.replace(/\D/g, "");
  event.target.value = value;
};

export const rearrangeDataWithCasetypes = (data: any) => {
  let casetypes = [
    "UTI PANEL",
    "WOUND",
    "TOXICOLOGY",
    "RESPIRATORY PANEL",
    "CLINICAL CHEMISTRY",
    "GASTRO",
    "NAIL",
    "COVID",
    "COVID FLU",
    "DIABETES",
    "URINALYSIS",
    "PGX TEST",
    "PULMONARY PANEL",
    "PAD ALZHEIMERS",
    "CARDIAC",
    "CGX PANEL",
    "GTI STI",
    "GTI WOMENS",
  ];
  const rearrangedData = casetypes
    .map((caseType: any) => {
      const item = data.find((d: any) => d.case_type_name === caseType);
      return item ? { ...item } : null;
    })
    .filter(Boolean);
  return rearrangedData;
};
export const rearrangeDataWithCasetypesInFilters = (data: any) => {
  let casetypes = [
    "UTI PANEL",
    "WOUND",
    "TOXICOLOGY",
    "RESPIRATORY PANEL",
    "CLINICAL CHEMISTRY",
    "GASTRO",
    "NAIL",
    "COVID",
    "COVID FLU",
    "DIABETES",
    "URINALYSIS",
    "PGX TEST",
    "PULMONARY PANEL",
    "PAD ALZHEIMERS",
    "CARDIAC",
    "CGX PANEL",
    "GTI STI",
    "GTI WOMENS",
  ];
  const rearrangedData = casetypes
    .map((caseType: any) => {
      const item = data.find((d: any) => d.displayName === caseType);
      return item ? { ...item } : null;
    })
    .filter(Boolean);
  return rearrangedData;
};

export const changeDateToUTC = (fromDate: any, toDate: any) => {
  const fromDateUTC = dayjs(fromDate).toDate();
  const toDateUTC = dayjs(toDate).toDate();
  return [fromDateUTC, toDateUTC];
};

export const getDatesForStatsCards = (thisMonth: any) => {
  let fromDate = new Date(
    Date.UTC(
      thisMonth[0].getFullYear(),
      thisMonth[0].getMonth(),
      thisMonth[0].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let toDate = new Date(
    Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
  )
    .toISOString()
    .substring(0, 10);

  if (dayjs(fromDate).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) {
    const currentDate = dayjs();
    const firstDayOfMonth = currentDate.startOf("month");
    const lastMonthEndDate = firstDayOfMonth.subtract(1, "day");
    const lastMonthStartDate = lastMonthEndDate.startOf("month");
    return [
      lastMonthStartDate.format("YYYY-MM-DD"),
      lastMonthEndDate.format("YYYY-MM-DD"),
    ];
  } else {
    return [fromDate, toDate];
  }
};

export const getThisMonthDates = (thisMonth: any) => {
  let fromDate = new Date(
    Date.UTC(
      thisMonth[0].getFullYear(),
      thisMonth[0].getMonth(),
      thisMonth[0].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);

  let thisday = new Date();
  let toDate = new Date(
    Date.UTC(thisday.getFullYear(), thisday.getMonth(), thisday.getDate())
  )
    .toISOString()
    .substring(0, 10);
  return [fromDate, toDate];
};

export const averageUptoPreviousDateTargets = (
  target_volume: any,
  toDate: any
) => {
  const totalDaysInMonth = dayjs().daysInMonth();
  const startOfMonth = dayjs().startOf("month");

  const currentDate = dayjs(toDate);
  const daysPassed = currentDate.diff(startOfMonth, "day") + 1;
  const targetVolume = target_volume;
  if (targetVolume) {
    const averagePerDay = targetVolume / totalDaysInMonth;
    return Math.ceil(averagePerDay * daysPassed);
  } else {
    return 0;
  }
};
export const averageUptoDateTargets = (target_volume: any, toDate: any) => {
  const totalDaysInMonth = dayjs().daysInMonth();
  const startOfMonth = dayjs().startOf("month");

  const currentDate = dayjs(toDate);
  let daysPassed = currentDate.diff(startOfMonth, "day") + 1;
  const targetVolume = target_volume;
  if (targetVolume) {
    const averagePerDay = targetVolume / totalDaysInMonth;
    return Math.ceil(averagePerDay * daysPassed);
  } else {
    return 0;
  }
};
export const averageUptoDateTargetsForSalesReps = (
  target_volume: any,
  toDate: any
) => {
  const totalDaysInMonth = dayjs().daysInMonth();
  const startOfMonth = dayjs().startOf("month");

  const currentDate = dayjs(toDate);
  let daysPassed = currentDate.diff(startOfMonth, "day");
  const targetVolume = target_volume;
  if (targetVolume) {
    const averagePerDay = targetVolume / totalDaysInMonth;
    return Math.ceil(averagePerDay * (daysPassed == 0 ? 1 : daysPassed));
  } else {
    return 0;
  }
};

// Function to sum all team totals
function calculateTeamTotalSumOfFields(data: any, fieldName: any) {
  let totalAmount = 0;
  data.forEach((item: any) => {
    totalAmount += item[fieldName];
  });
  return totalAmount || 0;
}

export const formatTeamWiseSalesRepsData = (data: any) => {
  let formatData = data.map((item: any, index: any) => {
    return {
      ...item,
      sales_rep_name:
        item?.sales_rep_name + " " + "TEAM" + " " + `(${item?.team?.length})`,
      total_facilities: calculateTeamTotalSumOfFields(
        item.team,
        "total_facilities"
      ),
      active_facilities: calculateTeamTotalSumOfFields(
        item.team,
        "active_facilities"
      ),
      total_targets: calculateTeamTotalSumOfFields(item.team, "total_targets"),
      total_cases: calculateTeamTotalSumOfFields(item.team, "total_cases"),
      target_reached: item.total_cases >= item.total_targets ? true : false,
    };
  });
  return formatData;
};
export const capitalizeAndRemoveUnderscore = (text: any) => {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};
