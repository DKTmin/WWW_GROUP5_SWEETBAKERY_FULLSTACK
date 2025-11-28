import axiosClient from "../../../utils/axiosClient";

const categoryApi = {
    getAll: () => axiosClient.get("/category-management/api/v1/categories"),
};

export default categoryApi;