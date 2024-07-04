import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getBillingStatsCardDataAPI = async (params:any) => {
  try {
    const { success, data } = await $fetch.get("/billed-overview/stats", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getRevenueStatsCardDataAPI = async (params:any) => {
  try {
    const { success, data } = await $fetch.get("/revenue-overview/stats", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
