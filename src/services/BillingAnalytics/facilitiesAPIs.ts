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

export const getMonthWiseFacilityBilledCaseTypesDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-facilities/${id}/monthly-case-type`,
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

export const getMonthWiseFacilityRevenueCaseTypesDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/revenue-facilities/${id}/monthly-case-type`,
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

export const getFacilityMonthWiseInsuranceWiseRevenueCaseTypesDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/revenue-facilities/${id}/insurance-wise`,
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

export const getFacilityMonthWiseInsuranceWiseBilledCaseTypesDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-facilities/${id}/insurance-wise`,
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
