import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getStatsVolumeDetails = async () => {
    try {
        const { data, success } = await $fetch.get("/overview/stats-volume");
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};
export const getStatsRevenueDetails = async () => {
    try {
        const { data, success } = await $fetch.get("/overview/stats-revenue");
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};
