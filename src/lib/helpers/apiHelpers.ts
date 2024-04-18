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

export const getOnlyMonthNames = (data: any) => {
    let responseData = [...data];
    const monthNames = Object.keys(responseData[0]).filter(key => key !== "id" && key !== "sales_rep_id" && key !== "year" && key !== "sales_rep_name");
    return monthNames;

}

export const formatMothNameWithYear = (month: string, year: string) => {
    let monthValue = month.substring(0, 1).toUpperCase() + month.substring(1, 3);
    let yearValue = year.substring(year.length - 2);
    return monthValue + " '" + yearValue;
}