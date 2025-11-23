import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) =>
    axiosClient.post("/auth-management/api/v1/auth/log-in", data),
  register: (data) =>
    axiosClient.post("/auth-management/api/v1/auth/register", data),
  refresh: (token) =>
    axiosClient.post("/authentication-management/api/v2/auth/refresh", {
      token,
    }),
};

export default authApi;
