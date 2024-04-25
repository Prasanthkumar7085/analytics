import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getSalesRepsAPI = async (params: any) => {
  try {
    const { success, data } = await $fetch.get("/sales-reps/stats", params);
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
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/case-types-volume-targets`,
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
      `/${pageName}/${id}/trends/volume-targets`,
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

export const getVolumeDetailsOfFacilitiesBySalesRepIdAPI = async ({
  id,
  queryParams,
}: {
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/facilities/volume-month-wise`,
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

export const getRevenueDetailsOfFacilitiesBySalesRepIdAPI = async ({
  id,
  queryParams,
}: {
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/facilities/revenue-month-wise`,
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

export const getVolumeInsurancePayorsBySalesRepIdAPI = async ({
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${pageName}/${id}/insurance-payors/volume`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getRevenueInsurancePayorsBySalesRepIdAPI = async ({
  pageName,
  id,
  queryParams
}: {
  pageName: string,
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(`/${pageName}/${id}/insurance-payors/revenue`, queryParams);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getDetailsOfTargetsForEverySalesRep = async ({
  queryParams,
}: {
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps-monthly-achieves`,
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



