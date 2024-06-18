import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";
import { $globalFetch } from "@/lib/labsquireFetch";

export const getAllPatientNamesAPI = async (params: any) => {
    try {
        const { success, data } = await $globalFetch.get("/patient-results/tests", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};