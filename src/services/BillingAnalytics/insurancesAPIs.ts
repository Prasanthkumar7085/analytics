import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getAllBilledInsurancesListAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/billed-insurances", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllRevenueInsurancesListAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/revenue-insurances", params);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getInsuranceBilledMonthWiseCaseTypeDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-insurances/${id}/monthly-case-type`,
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

export const getInsuranceRevenueMonthWiseCaseTypeDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/revenue-insurances/${id}/monthly-case-type`,
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

export const getMonthWiseInsuranceBilledTreadsDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `/billed-insurances/${id}/trend`,
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

export const getMonthWiseInsuranceRevenueTreadsDataAPI = async (
  params: any,
  id: any
) => {
  try {
    const { success, data } = await $fetch.get(
      `revenue-insurances/${1}/trend`,
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
