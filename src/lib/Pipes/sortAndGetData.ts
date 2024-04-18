interface DataItem {
  [key: string]: any;
}
export const sortAndGetData = <T extends DataItem>(
  data: T[],
  sortBy: keyof T,
  sortType: "asc" | "desc"
): T[] => {
  if (!data || data.length === 0 || !sortBy || !sortType) {
    return data; // Return the original data if it's empty or sorting parameters are missing
  }

  return data.slice().sort((a, b) => {
    const sortValueA = a[sortBy];
    const sortValueB = b[sortBy];

    if (sortType === "asc") {
      return sortValueA < sortValueB ? -1 : sortValueA > sortValueB ? 1 : 0;
    } else {
      return sortValueA > sortValueB ? -1 : sortValueA < sortValueB ? 1 : 0;
    }
  });
};


export const customSortByMonth = (data: any, monthName: any, index: any) => {
  return data.sort((a: any, b: any) => a[monthName][index] - b[monthName][index]);
}