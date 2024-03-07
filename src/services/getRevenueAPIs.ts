import { $fetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const getRevenueAPI = async () => {
  try {
    const { success, data } = await $fetch.get("/overview/revenue");
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};


export const getTrendsForRevenueBySalesRepIdAPI = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/trends/revenue`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getTrendsForVolumeBySalesRepIdAPI = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const { success, data } = await $fetch.get(
      `/sales-reps/${id}/trends/volume`
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};