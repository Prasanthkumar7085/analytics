import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";


export const getAllCaseTypesAPI = async () => {
  try {
    const { data, success } = await $fetch.get("/case-types");
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getCaseTypesStatsAPI = async (params: any) => {
  try {
    const { data, success } = await $fetch.get("/overview/case-types", params);
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
