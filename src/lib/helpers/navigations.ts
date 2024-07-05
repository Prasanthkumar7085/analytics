import dayjs from "dayjs";
import {
  addMonths,
  endOfMonth,
  startOfMonth,
} from "rsuite/esm/internals/utils/date";
import { prepareURLEncodedParams } from "../prepareUrlEncodedParams";

export const gotoSingleCaseTypeDetails = (
  id: any,
  searchParams: any,
  router: any
) => {
  let queryString = "";
  let thisMonth =
    dayjs(startOfMonth(new Date())).format("YYYY-MM-DD") ==
    dayjs().format("YYYY-MM-DD")
      ? [
          startOfMonth(addMonths(new Date(), -1)),
          endOfMonth(addMonths(new Date(), -1)),
        ]
      : [startOfMonth(new Date()), new Date()];

  let defaultfromDate = new Date(
    Date.UTC(
      thisMonth[0].getFullYear(),
      thisMonth[0].getMonth(),
      thisMonth[0].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);
  let defaulttoDate = new Date(
    Date.UTC(
      thisMonth[1].getFullYear(),
      thisMonth[1].getMonth(),
      thisMonth[1].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);

  const queryParams: any = {
    from_date: defaultfromDate,
    to_date: defaulttoDate,
  };
  if (searchParams["from_date"]) {
    queryParams["from_date"] = searchParams["from_date"] || defaultfromDate;
  }
  if (searchParams["to_date"]) {
    queryParams["to_date"] = searchParams["to_date"] || defaulttoDate;
  }
  if (id) {
    queryParams["case_type_id"] = id;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }
  router.push(`/case-type/${queryString}`);
};

export const gotoSingleFacilityPage = (
  Id: string,
  params: any,
  router: any
) => {
  let queryString = "";
  let thisMonth = [startOfMonth(new Date()), new Date()];
  let defaultfromDate = new Date(
    Date.UTC(
      thisMonth[0].getFullYear(),
      thisMonth[0].getMonth(),
      thisMonth[0].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);
  let defaulttoDate = new Date(
    Date.UTC(
      thisMonth[1].getFullYear(),
      thisMonth[1].getMonth(),
      thisMonth[1].getDate()
    )
  )
    .toISOString()
    .substring(0, 10);
  const queryParams: any = {
    from_date: defaultfromDate,
    to_date: defaulttoDate,
  };
  if (params.get("from_date")) {
    queryParams["from_date"] = params.get("from_date") || defaultfromDate;
  }
  if (params.get("to_date")) {
    queryParams["to_date"] = params.get("to_date") || defaulttoDate;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }

  router.push(`/facilities/${Id}${queryString}`);
};
