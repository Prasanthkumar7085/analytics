export const groupDataWithMonthWise = (
  data: any,
  key1: string,
  key2: string
) => {
  const groupedData: any = {};

  data?.forEach((item: any) => {
    const { case_type_id, case_type_name, month_wise } = item;

    if (!groupedData[case_type_id]) {
      groupedData[case_type_id] = {
        case_type_id,
        case_type_name,
      };
    }
    month_wise.forEach((monthItem: any) => {
      const { month } = monthItem;
      const formattedMonth = month.replace(/\s/g, "");
      groupedData[case_type_id][formattedMonth] = [
        monthItem?.[key1],
        monthItem?.[key2],
      ];
    });
  });

  return groupedData;
};
