import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getCaseTypesStatsAPI = async () => {
    try {
        const { data, success } = await $fetch.get("/overview/case-types");
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};
