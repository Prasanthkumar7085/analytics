import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const facilitiesAPI = async (updatedQueyParams: any) => {
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


