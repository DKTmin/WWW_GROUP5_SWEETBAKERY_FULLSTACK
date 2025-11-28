import axiosClient from "../../../utils/axiosClient";

const categoryApi = {
    getAll: () => axiosClient.get("/pastry-management/api/v1/pastry-categories"),
};

export default categoryApi;