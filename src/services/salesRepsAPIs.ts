import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const salesRepsAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/sales-reps", params);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleRepCaseTypes = async (salerep_id: string, queryParams: any) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${salerep_id}/case-types`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleRepDeatilsAPI = async (salerep_id: string) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${salerep_id}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};



export const getTrendsForRevenueBySalesRepIdAPI = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/trends/revenue`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getTrendsForVolumeBySalesRepIdAPI = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/trends/volume`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getFacilitiesBySalesRepId = async ({ id, queryParams }: { id: string, queryParams: any }) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${id}/facilities`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};


export const getAllInsurancePayorsBySalesRepIdAPI = async ({
  id,
  queryParams
}: {
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${id}/insurance-payors`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};