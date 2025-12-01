import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8082/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Khi token hết hạn hoặc không hợp lệ:
      // dọn toàn bộ thông tin đăng nhập & dữ liệu cục bộ liên quan
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("cart");
        localStorage.removeItem("local_orders");
        // thông báo cho các component (Header, Cart, ...) cập nhật lại state
        window.dispatchEvent(new CustomEvent("cart_update"));
      } catch (e) {
        console.warn("Failed to clear local storage on 401", e);
      }
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
