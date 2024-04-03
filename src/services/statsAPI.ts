import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getRevenueStatsDetailsAPI = async (params: any) => {
    try {
        const { data, success } = await $fetch.get("/overview/stats-revenue", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getVolumeStatsDetailsAPI = async (params: any) => {
    try {
        const { data, success } = await $fetch.get("/overview/stats-volume", params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getFacilitiesRevenueStatsDetailsAPI = async (id: any, params: any) => {
    try {
        const { data, success } = await $fetch.get(`/facilities/${id}/stats-revenue`, params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getFacilitiesVolumeStatsDetailsAPI = async (id: any, params: any) => {
    try {
        const { data, success } = await $fetch.get(`/facilities/${id}/stats-volume`, params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getSalesRepRevenueStatsDetailsAPI = async (id: any, params: any) => {
    try {
        const { data, success } = await $fetch.get(`/sales-reps/${id}/stats-revenue`, params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

export const getSalesRepVolumeStatsDetailsAPI = async (id: any, params: any) => {
    try {
        const { data, success } = await $fetch.get(`/sales-reps/${id}/stats-volume`, params);
        if (!success) {
            return handleAPIErrorResponse(data);
        }
        return data;
    } catch (err) {
        throw err;
    }
};
