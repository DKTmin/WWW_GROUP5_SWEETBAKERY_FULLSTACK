// src/features/home/api/pastryApi.js
import axiosClient from "../../../utils/axiosClient";

const pastryApi = {
    findAllTask: () => axiosClient.get("/pastry-management/api/v1/pastries"),
    findByCategory: (categoryId) =>
        axiosClient.get("/pastry-management/api/v1/pastries", {
            params: { category: categoryId }
        }),
    getById: (id) => axiosClient.get(`/pastry-management/api/v1/pastries/${id}`),
    search: (keyword) =>
        axiosClient.get("/pastry-management/api/v1/pastries/search", {
            params: { keyword },
        }),
};

export default pastryApi;