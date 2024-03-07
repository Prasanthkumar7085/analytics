import { $globalFetch } from "@/lib/fetch";
import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";

export const signInAPI = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { success, data } = await $globalFetch.post("/signin", payload);
    console.log(success, data);

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
      user_type: "HOSPITAL_MARKETING_MANAGER",
    };
    const { success, data } = await $globalFetch.get("/users", queryParams);
    console.log(success, data);

    if (!success) {
      return handleAPIErrorResponse(data);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
