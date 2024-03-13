import moment from "moment";
import { DatePicker, DateRangePicker, Stack } from "rsuite";
import "rsuite/dist/rsuite.css";

import {
  addDays,
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
} from "rsuite/esm/utils/dateUtils";
const GlobalDateRangeFilter = ({
  onChange,
}: {
  onChange: (fromDate: string, toDate: string) => void;
}) => {
  const predefinedRanges: any = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },

    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last 3 months",
      value: [
        startOfMonth(addMonths(new Date(), -3)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },

    {
      label: "Last 6 months",
      value: [
        startOfMonth(addMonths(new Date(), -6)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last 9 months",
      value: [
        startOfMonth(addMonths(new Date(), -9)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },

    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: "left",
    },
  ];
  return (
    <div>
      <DateRangePicker
        placement="bottomEnd"
        ranges={predefinedRanges}
        size="lg"
        disabledDate={(date: any) => {
          return date.getTime() > new Date().getTime();
        }}
        placeholder={"Select date range"}
        onChange={(newDate: any) => {
          if (newDate) {
            let date1 = new Date(
              moment(new Date(newDate[0])).format("YYYY-MM-DD")
            )
              .toISOString()
              .substring(0, 10);
            let date2 = new Date(
              moment(new Date(newDate[1])).format("YYYY-MM-DD")
            )
              .toISOString()
              .substring(0, 10);

            onChange(date1, date2);
          } else {
            onChange("", "");
          }
        }}
      />
    </div>
  );
};

export default GlobalDateRangeFilter;
