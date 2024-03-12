import { store } from "@/Redux";

export const mapSalesRepNameWithId = (id: string) => {
  let marketers = store.getState()?.users?.marketers;
  if (!(marketers?.length && id)) {
    return;
  }

  let markter = marketers.find(
    (item: { first_name: string; last_name: string; _id: string }) =>
      item._id == id
  );
  let name = markter?.first_name
    ? markter?.first_name
    : "" + " " + markter?.last_name
    ? markter?.last_name
    : "" + " " + markter?.last_name
    ? markter?.last_name
    : "";
  return name ? name?.slice(0, 1)?.toUpperCase() + name?.slice(1) : "";
};

export const mapFacilityNameWithId = (id: string) => {
  let facilities = store.getState()?.users?.facilities;
  if (!(facilities?.length && id)) {
    return;
  }

  let facility = facilities.find(
    (item: { first_name: string; last_name: string; _id: string }) =>
      item._id == id
  );

  return facility?.name ? facility?.name : "";
};


export const mapCaseTypeTitleWithCaseType = (
  caseType: string,
  returnValue = "title"
) => {
  let cases = store.getState()?.users?.caseTypes;

  if (!(cases?.length && caseType)) {
    return;
  }
  let caseTypeObj = cases.find(
    (item: { title: string; value: string; color: string }) =>
      item.value == caseType
  );

  return caseTypeObj ? caseTypeObj[returnValue] : "";
};