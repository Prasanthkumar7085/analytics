import { store } from "@/Redux";
import { useSelector } from "react-redux";

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
  return name ? name : "";
};
