import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";
import { $globalFetch } from "@/lib/labsquireFetch";

export const getAllPatientResultsAPI = async (params: any) => {
    try {
        const { success, data } = await $globalFetch.get("/patient-results", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};