import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth-management/api/v1/auth/log-in", data),
  register: (data) => axiosClient.post("/customer-management/api/v1/customers/register", data),
  refresh: (token) =>
    axiosClient.post("/authentication-management/api/v2/auth/refresh", {
      token,
    }),
  updateInformation: (data) => axiosClient.put("/user-management/api/v1/users/infor", data),
  getInformation: () => axiosClient.get("/user-management/api/v1/users/information"),
};

export default authApi;
