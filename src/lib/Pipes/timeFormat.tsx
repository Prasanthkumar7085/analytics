import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const momentWithTimezone = (value: any, format = "MM-DD-YYYY", timeZone = "America/New_York") => {
    return dayjs(value).tz(timeZone).format(format);
};
