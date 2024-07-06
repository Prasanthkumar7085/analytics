import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllCaseTypesAPI = async (updatedQueyParams: any) => {
  try {
    const { data, success } = await $fetch.get(
      "/case-types/stats",
      updatedQueyParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllCaseTypesListAPI = async () => {
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

export const getDashboardCaseTypesVolumeStatsAPI = async (params: any) => {
  try {
    const { data, success } = await $fetch.get(
      "/overview/case-types-volume-targets",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getDashboardCaseTypesRevenueStatsAPI = async (params: any) => {
  try {
    const { data, success } = await $fetch.get(
      "/overview/case-types-revenue",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
export const getMonthWiseVolumeCaseDetailsAPI = async (
  pageName: string,
  queryParams: any
) => {
  try {
    const { data, success } = await $fetch.get(
      `/${pageName}/months/volume`,
      queryParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
export const getMonthWiseRevenueCaseDetailsAPI = async (
  pageName: string,
  queryParams: any
) => {
  try {
    const { data, success } = await $fetch.get(
      `/${pageName}/months/revenue`,
      queryParams
    );
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
  queryParams,
}: {
  pageName: any;
  id: any;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/case-types/months/volume-targets`,
      queryParams
    );
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
  queryParams,
}: {
  pageName: string;
  id: any;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/case-types/months/revenue`,
      queryParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getMonthWiseVolumeCaseTypesForSinglePageFacilitiesAPI = async ({
  pageName,
  id,
  queryParams,
}: {
  pageName: string;
  id: any;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/case-types/months/volume`,
      queryParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getSingleCaseTypeMonthWiseFacilityDetailsAPI = async ({
  queryParams,
}: {
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/case-types/facilities/months/volume`,
      queryParams
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
