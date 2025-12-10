import axiosClient from "../../../utils/axiosClient";

const userApi = {
  findAllUser: () => axiosClient.get("/user-management/api/v1/users"),
};

export default userApi;