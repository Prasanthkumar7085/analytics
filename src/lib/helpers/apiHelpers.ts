export const getUniqueMonths = (data: any) => {
    let monthArray = data?.map((item: any) => item.month.replace(/\s/g, ''))
    let uniqueMonths = Array.from(new Set(monthArray));
    return uniqueMonths;
}

export const formatMonthYear = (monthYear: string) => {
    let month = monthYear.substring(0, 3);
    let year = monthYear.substring(monthYear.length - 2);
    return month + " '" + year;
}
export const formatDateToMonthName = (date: any) => {
  const [month, year] = date.split("-");

  // Convert month number to month name abbreviation
  const monthAbbr = new Date(`${year}-${month}-01`).toLocaleString("en-US", {
    month: "short",
  });

  // Format year to 'YY
  const yearShort = `'${year.slice(-2)}`;

  const formattedDate = `${monthAbbr} ${yearShort}`;
  return formattedDate;
};

export const getOnlyMonthNames = (data: any) => {
    let responseData = [...data];
    const monthNames = Object.keys(responseData[0]).filter(key => key !== "id" && key !== "sales_rep_id" && key !== "year" && key !== "sales_rep_name");
    return monthNames;

}

export const formatMothNameWithYear = (month: string, year: string) => {
    let monthValue = month.substring(0, 1).toUpperCase() + month.substring(1, 3);
    let yearValue = year?.substring(year.length - 2);
    return monthValue + " '" + yearValue;
}
export const checkNumbersOrnot = (event: any) => {
    const value = event.target.value.replace(/\D/g, "");
    event.target.value = value;
};

