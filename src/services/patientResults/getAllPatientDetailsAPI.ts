import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";
import { $LabsquireFetch } from "@/lib/labsquireFetch";

export const getAllPatientDetailsAPI = async (params: any) => {
    try {
        const { success, data } = await $LabsquireFetch.get("/patients-list", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};