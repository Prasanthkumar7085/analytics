import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getSalesRepTargetsAPI = async (params: any) => {
    try {
        const { success, data } = await $fetch.get("/sales-reps-targets", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const updateTargetsAPI = async (body: any, id: string) => {
    try {
        const { success, data } = await $fetch.patch(`/sales-reps-targets/${id}`, body);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};