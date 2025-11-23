import axiosClient from "../../../utils/axiosClient";

const pastryApi = {
  findAllTask: () => axiosClient.get("/pastry-management/api/v1/pastries"),
};

export default pastryApi;
