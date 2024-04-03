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