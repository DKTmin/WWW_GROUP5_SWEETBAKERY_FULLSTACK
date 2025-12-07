import axiosClient from "../../../utils/axiosClient";

const adminApi = {
  // OTP / auth cho admin
  getOtp: () => axiosClient.get("/gmail-management/api/v1/gmail/send-otp"),
  verifyOtp: (otp) =>
    axiosClient.post("/gmail-management/api/v1/gmail/verify-otp", otp),

  // ==== USERS ====
  getAllUsers: () => axiosClient.get("/user-management/api/v1/users"),
  deleteUser: (userId) =>
    axiosClient.post(`/user-management/api/v1/users/delete/${userId}`),

  // ==== EMPLOYEES ====
  getAllEmployees: () =>
    axiosClient.get("/employee-management/api/v1/employees"),

  // ==== CUSTOMERS ====
  getAllCustomers: () =>
    axiosClient.get("/customer-management/api/v1/customers"),

  // ===================================================
  // =============== ADMIN PASTRIES =====================
  // ===================================================

  // Admin: luôn gọi vào /admin/api/...
  getAdminPastries: () =>
    axiosClient.get("/admin/api/v1/pastries"),

  createPastry: (data) =>
    axiosClient.post("/admin/api/v1/pastries", data),

  updatePastry: (id, data) =>
    axiosClient.put(`/admin/api/v1/pastries/${id}`, data),

  deletePastry: (id) =>
    axiosClient.delete(`/admin/api/v1/pastries/${id}`),

  // ===================================================
  // ============ ADMIN CATEGORIES =====================
  // ===================================================

  getAdminCategories: () =>
    axiosClient.get("/admin/api/v1/categories"),

  createCategory: (data) =>
    axiosClient.post("/admin/api/v1/categories", data),

  updateCategory: (id, data) =>
    axiosClient.put(`/admin/api/v1/categories/${id}`, data),

  deleteCategory: (id) =>
    axiosClient.delete(`/admin/api/v1/categories/${id}`),
};

export default adminApi;
