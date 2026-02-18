export const extractErrorMessage = (e: any): string => {
  if (e.response?.data?.message) return e.response.data.message;
  if (e.response?.data?.error) return e.response.data.error;
  if (e.message) return e.message;
  return "Unknown error occurred";
};
