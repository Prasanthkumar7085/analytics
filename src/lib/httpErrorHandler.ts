export const handleAPIErrorResponse = async (response: any) => {
  switch (response?.status) {
    case 422:
      return {
        type: "VALIDATION_ERROR",
        message: response?.message,
        error_data: response?.errors,
        status: response?.status
      };
    case 409:
      return {
        type: "CONFLICT",
        message: response?.message,
        error_data: response?.errors,
      };
    case 401:
      return {
        type: "Invalid_Credentials",
        message: response?.message,
        error_data: response?.message,
      };
    case 400:
      return {
        type: "BAD_REQUEST",
        message: response?.message,
        error_data: response?.error,
      };

    default:
      return {
        type: "OTHER",
        message: response?.message,
        error_data: response?.error,
      };
  }
};
