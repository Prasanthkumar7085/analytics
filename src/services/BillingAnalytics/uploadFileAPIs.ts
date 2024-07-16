import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const uploadBillingDataAPI = async (payload: any) => {
  try {
    const { success, data } = await $fetch.postFile("/billing/upload", payload);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const uploadRevenueDataAPI = async (payload: any) => {
  try {
    const { success, data } = await $fetch.postFile("/revenue/upload", payload);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
