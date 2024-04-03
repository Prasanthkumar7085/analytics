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

export const getSingleRepCaseTypes = async (url: string, queryParams: any) => {
  try {
    const { success, data } = await $fetch.get(url, queryParams);
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
  apiurl,
  id,
  queryParams
}: {
  apiurl: string,
  id: string;
  queryParams: any
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${apiurl}/${id}/trends/revenue`, queryParams
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
  apiurl,
  id,
  queryParams
}: {
  apiurl: string;
  id: string;
  queryParams: any
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${apiurl}/${id}/trends/volume`, queryParams
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
  apiurl,
  id,
  queryParams
}: {
  apiurl: string,
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${apiurl}/${id}/insurance-payors`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};


