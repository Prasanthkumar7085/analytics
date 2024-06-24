import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";
import { $LabsquireFetch } from "@/lib/labsquireFetch";

export const getSinglePatientResultAPI = async (id: any) => {
    try {
        const { success, data } = await $LabsquireFetch.get(`/patients/${id}`);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};