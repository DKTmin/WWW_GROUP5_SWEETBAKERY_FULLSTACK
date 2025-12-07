import axiosClient from "../../../utils/axiosClient";

const adminApi = {
  getOtp: () => axiosClient.get("/gmail-management/api/v1/gmail/send-otp"),
  verifyOtp: (otp) => axiosClient.post("/gmail-management/api/v1/gmail/verify-otp", otp),

  // user
  getAllUsers: () => axiosClient.get("/user-management/api/v1/users"),
  deleteUser: (userId) => axiosClient.post(`/user-management/api/v1/users/delete/${userId}`),

  // employees
  getAllEmployees: () => axiosClient.get("/employee-management/api/v1/employees"),

  // customers
  getAllCustomers: () => axiosClient.get("/customer-management/api/v1/customers"),

  // orders
  getAllOrders: () => axiosClient.get("/admin/api/v1/orders"),
  getOrderById: (orderId) => axiosClient.get(`/admin/api/v1/orders/${orderId}`),
  updateOrderStatus: (orderId, status) =>
    axiosClient.put(`/admin/api/v1/orders/${orderId}/status`, { trangThai: status }),
};

export default adminApi;
