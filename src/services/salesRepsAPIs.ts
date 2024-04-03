import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getSalesRepsAPI = async (params: any) => {
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

export const getSingleSalesRepCaseTypesVolumeAPI = async (id: string, queryParams: any) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${id}/case-types-volume`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSingleSalesRepCaseTypesRevenueAPI = async (id: string, queryParams: any) => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/${id}/case-types-revenue`, queryParams);
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

export const getSingleRepProfileDeatilsAPI = async () => {
  try {
    const { success, data } = await $fetch.get(`/sales-reps/ref-id`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};



export const getTrendsForRevenueBySalesRepIdAPI = async ({
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: string;
  queryParams: any
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/trends/revenue`, queryParams
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
  pageName,
  id,
  queryParams
}: {
  pageName: string;
  id: string;
  queryParams: any
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/trends/volume`, queryParams
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
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${pageName}/${id}/insurance-payors`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};


