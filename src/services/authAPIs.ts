import { $fetch, $globalFetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const signInAPI = async (payload: {
  user_name: string;
  password: string;
}) => {
  try {
    const { success, data } = await $fetch.post("/lis/signin", payload);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllFacilitiesAPI = async () => {
  try {
    let queryParams = {
      get_all: true,
    };
    const { success, data } = await $globalFetch.get("/hospitals", queryParams);
    2;

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
