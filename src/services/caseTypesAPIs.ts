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


//REVIEW: getRevenueOrVolumeCaseDetailsAPI why do we have same API for both Volumn and Revenue. 

// REVIEW: SOLID : Single Responsiblity principle need ot implment here 
export const getRevenueOrVolumeCaseDetailsAPI = async (url: string, queryParams: any) => {
  try {
    //REVIEW: Whyn we need pass URL here. to avoid this type of practice we are maintain services  change this by adding url in service 

    const { data, success } = await $fetch.get(url, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
