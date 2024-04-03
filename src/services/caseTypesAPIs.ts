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

  //REVIEW: Whyn we need pass URL here. to avoid this type of practice we are maintain services 


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

// REVIEW: SOLID : Single Responsiblity principle need ot implment here 
export const getMonthWiseVolumeCaseDetailsAPI = async (pageName: string, queryParams: any) => {
  try {
    const { data, success } = await $fetch.get(`/${pageName}/months/volume`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
export const getMonthWiseRevenueCaseDetailsAPI = async (pageName: string, queryParams: any) => {
  try {
    const { data, success } = await $fetch.get(`/${pageName}/months/revenue`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getMonthWiseVolumeCaseTypesForSinglePageAPI = async ({
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: any;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${pageName}/${id}/case-types/months/volume`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getMonthWiseRevenueCaseTypesForSinglePageAPI = async ({
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: any;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${pageName}/${id}/case-types/months/revenue`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};