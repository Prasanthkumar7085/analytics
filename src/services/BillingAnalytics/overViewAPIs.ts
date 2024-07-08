import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getBillingStatsCardDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/billed-overview/stats",
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

export const getRevenueStatsCardDataAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/revenue-overview/stats",
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

export const getcaseTyeWiseBillingStatsAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/billed-overview/case-types",
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

export const getcaseTyeWiseRevenueStatsAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get(
      "/revenue-overview/case-types",
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

export const getMonthWiseRevenueTreadsDataAPI = async (params: any) => {
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
