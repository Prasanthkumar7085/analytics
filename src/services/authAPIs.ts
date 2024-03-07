import { $globalFetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const signInAPI = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { success, data } = await $globalFetch.post("/signin", payload);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllUsersAPI = async () => {
  try {
    let queryParams = {
      get_all: true,
      order_by: "first_name",
      order_type: "asc",
    };
    const { success, data } = await $globalFetch.get("/users", queryParams);
    2;

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
