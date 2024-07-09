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

export const getFacilityBillingStatsCardDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-facilities/${id}/stats`,
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getFacilityRevenueStatsCardDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/revenue-facilities/${id}/stats`,
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getFacilitycaseTyeWiseBillingStatsAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-facilities/${id}/case-types`,
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getFacilitycaseTyeWiseRevenueStatsAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/revenue-facilities/${id}/case-types`,
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getMonthWiseBilledCaseTypesDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/billed-overview/monthly-case-type-wise",
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getMonthWiseRevenueCaseTypesDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/revenue-overview/monthly-case-type-wise",
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getMonthWiseRevenueTreadsDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/revenue-overview/trend",
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getMonthWiseBilledTreadsDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/billed-overview/trend",
      params
    );

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
