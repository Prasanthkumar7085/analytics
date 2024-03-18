import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";


export const getAllCaseTypesAPI = async (updatedQueyParams: any) => {
  try {
    const { data, success } = await $fetch.get("/case-types", updatedQueyParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getCaseTypesStatsAPI = async (url: string, params: any) => {
  try {
    const { data, success } = await $fetch.get(url, params);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getRevenueOrVolumeCaseDetailsAPI = async (url: string, queryParams: any) => {
  try {
    const { data, success } = await $fetch.get(url, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
