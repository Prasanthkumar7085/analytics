interface DataItem {
  [key: string]: any;
}
export const sortAndGetData = <T extends DataItem>(
  data: T[],
  sortBy: any,
  sortType: "asc" | "desc"
): T[] => {
  if (!data || data.length === 0 || !sortBy || !sortType) {
    return data;
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

export const sortData = (data: any, sortField: any, order = "asc") => {
  // Validate sorting order
  if (!["asc", "desc"].includes(order)) {
    throw new Error("Invalid sorting order. Use 'asc' or 'desc'.");
  }

  // Sort data based on sortField
  data.sort((a: any, b: any) => {
    if (order === "asc") {
      if (a[sortField] < b[sortField]) return -1;
      if (a[sortField] > b[sortField]) return 1;
      return 0;
    } else {
      if (a[sortField] > b[sortField]) return -1;
      if (a[sortField] < b[sortField]) return 1;
      return 0;
    }
  });

  return data;
};

export const customSortByMonth = (
  data: any,
  sortType?: any,
  sortValue?: any
) => {
  let specialColoumns = [
    "sales_rep_name",
    "new_facilities",
    "total",
    "rowTotal",
  ];

  if (specialColoumns.includes(sortValue)) {
    return data.slice().sort((a: any, b: any) => {
      const sortValueA = a[sortValue];
      const sortValueB = b[sortValue];

      if (sortType === "asc") {
        return sortValueA < sortValueB ? -1 : sortValueA > sortValueB ? 1 : 0;
      } else {
        return sortValueA > sortValueB ? -1 : sortValueA < sortValueB ? 1 : 0;
      }
    });
  } else {
    const string = sortValue.split("-");
    const datePart = string[0] + "-" + string[1];
    const remainingPart = string[2];
    if (sortType === "asc") {
      return data.sort(
        (a: any, b: any) =>
          a["monthwiseData"][datePart][remainingPart] -
          b["monthwiseData"][datePart][remainingPart]
      );
    } else {
      return data.sort(
        (a: any, b: any) =>
          b["monthwiseData"][datePart][remainingPart] -
          a["monthwiseData"][datePart][remainingPart]
      );
    }
  }
};
