import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllBilledFacilitiesListAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/billed-facilities", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllRevenueFacilitiesListAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/revenue-facilities", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
