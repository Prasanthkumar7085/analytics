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
  if (searchParams?.["from_date"]) {
    queryParams["from_date"] = searchParams["from_date"] || defaultfromDate;
  }
  if (searchParams?.["to_date"]) {
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
  searchParams: any,
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
  if (searchParams?.["from_date"]) {
    queryParams["from_date"] = searchParams?.["from_date"] || defaultfromDate;
  }
  if (searchParams?.["to_date"]) {
    queryParams["to_date"] = searchParams?.["to_date"] || defaulttoDate;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }

  router.push(`/facilities/${Id}${queryString}`);
};

export const gotoSingleBillingFacilityPage = (
  Id: string,
  searchParams: any,
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
    tab: searchParams?.tab || "billed",
  };
  if (searchParams?.["from_date"]) {
    queryParams["from_date"] = searchParams?.["from_date"] || defaultfromDate;
  }
  if (searchParams?.["to_date"]) {
    queryParams["to_date"] = searchParams?.["to_date"] || defaulttoDate;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }

  router.push(`/billing/facilities/${Id}${queryString}`);
};

//go to single sales rep page navigation event
const gotoSingleSalesRepPage = (Id: string, searchParams: any, router: any) => {
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
  if (searchParams?.["from_date"]) {
    queryParams["from_date"] = searchParams?.["from_date"] || defaultfromDate;
  }
  if (searchParams?.["to_date"]) {
    queryParams["to_date"] = searchParams?.["to_date"] || defaulttoDate;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }

  router.push(`/sales-representatives/${Id}${queryString}`);
};

export const gotoSingleBillingInsurancePage = (
  Id: string,
  searchParams: any,
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
    tab: searchParams?.tab || "billed",
  };
  if (searchParams?.["from_date"]) {
    queryParams["from_date"] = searchParams?.["from_date"] || defaultfromDate;
  }
  if (searchParams?.["to_date"]) {
    queryParams["to_date"] = searchParams?.["to_date"] || defaulttoDate;
  }
  if (Object.keys(queryParams)?.length) {
    queryString = prepareURLEncodedParams("", queryParams);
  }

  router.push(`/billing/insurances/${Id}${queryString}`);
};
