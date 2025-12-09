import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth-management/api/v1/auth/log-in", data),
  register: (data) => axiosClient.post("/customer-management/api/v1/customers/register", data),
  refresh: (token) =>
    axiosClient.post("/auth-management/api/v1/auth/refresh", {
      token,
    }),
  updateInformation: (data) => axiosClient.put("/user-management/api/v1/users/infor", data),
  getInformation: () => axiosClient.get("/user-management/api/v1/users/information"),
  updateCustomerInformation: (data, userId) =>
    axiosClient.post(`/customer-management/api/v1/customers/update/${userId}`, data),
  getOtpToResetPassword: (email) =>
    axiosClient.post("/gmail-management/api/v1/gmail/otp-forget-password", email),
  verifyOTpToResetPassword: (data) =>
    axiosClient.post("/gmail-management/api/v1/gmail/verify-otp-forget-password", data),
  forgetPassword: (data) => axiosClient.post("/auth-management/api/v1/auth/forget-password", data),
};

export default authApi;
