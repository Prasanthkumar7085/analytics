export const getTotalSumOfColmnsWithMonths = (
  data: any,
  key1: string,
  key2: string
) => {
  const groupedDataSum: any = {};
  data?.forEach((item: any) => {
    const { case_type_id, case_type_name, month_wise } = item;
    month_wise.forEach((monthItem: any) => {
      const { month } = monthItem;
      const firstColumn = parseFloat(monthItem?.[key1]);
      const secondColumn = parseFloat(monthItem?.[key2]);

      const formattedMonth = month.replace(/\s/g, "");
      if (!groupedDataSum[formattedMonth]) {
        groupedDataSum[formattedMonth] = [0, 0];
      }

      groupedDataSum[formattedMonth][0] += firstColumn;
      groupedDataSum[formattedMonth][1] += secondColumn;
    });
  });
  return groupedDataSum;
};

export const getTotalSumWithMonthWise = (
  data: any,
  key1: string,
  key2: string
) => {
  const groupedDataSum: any = {};

  data.forEach((monthItem: any) => {
    const { month } = monthItem;
    const firstColumn = parseFloat(monthItem?.[key1]);
    const secondColumn = parseFloat(monthItem?.[key2]);

    const formattedMonth = month.replace(/\s/g, "");
    if (!groupedDataSum[formattedMonth]) {
      groupedDataSum[formattedMonth] = [0, 0];
    }

    groupedDataSum[formattedMonth][0] += firstColumn;
    groupedDataSum[formattedMonth][1] += secondColumn;
  });
  return groupedDataSum;
};
