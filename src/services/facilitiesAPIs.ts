import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getFacilitiesAPI = async (updatedQueyParams: any) => {
    try {
        const { success, data } = await $fetch.get("/facilities", updatedQueyParams);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getSingleFacilityCaseTypes = async (facility_id: string, queryParams: any) => {
    try {
        const { success, data } = await $fetch.get(`/facilities/${facility_id}/case-types`, queryParams);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getSingleFacilityCaseTypesRevenueAPI = async (facility_id: string, queryParams: any) => {
    try {
        const { success, data } = await $fetch.get(`/facilities/${facility_id}/case-types-revenue`, queryParams);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getSingleFacilityCaseTypesVolumeAPI = async (facility_id: string, queryParams: any) => {
    try {
        const { success, data } = await $fetch.get(`/facilities/${facility_id}/case-types-volume`, queryParams);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};




export const getSingleFacilityDetailsAPI = async (id: string) => {
    try {
        const { success, data } = await $fetch.get(`/facilities/${id}`);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getVolumeOfInsurancePayorsByFacilitiesIdAPI = async ({
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
export const getRevenueOfInsurancePayorsByFacilitiesIdAPI = async ({
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
export const getTrendsForRevenueByFacilityIdAPI = async ({
  pageName,
  id,
  queryParams,
}: {
  pageName: string;
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/trends/revenue`,
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
export const getTrendsForVolumeByFacilityIdAPI = async ({
  pageName,
  id,
  queryParams,
}: {
  pageName: string;
  id: string;
  queryParams: any;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/${pageName}/${id}/trends/volume`,
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

