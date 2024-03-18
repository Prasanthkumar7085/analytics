import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getInsurancesAPI = async (params: any) => {
    try {
        const { success, data } = await $fetch.get("/insurances", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getInsurancesCaseTypesAPI = async (insurace_id: string, params: any) => {
    try {
        const { success, data } = await $fetch.get(`/insurances/${insurace_id}/case-types`, params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

