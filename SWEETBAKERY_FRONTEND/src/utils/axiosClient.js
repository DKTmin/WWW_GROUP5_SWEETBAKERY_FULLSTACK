import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8082/",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- NEW: axios riêng để gọi refresh (không có interceptor request) ---
const refreshClient = axios.create({
  baseURL: "http://localhost:8082/",
  headers: {
    "Content-Type": "application/json",
  },
});

// === BIẾN TOÀN CỤC CHO REFRESH TOKEN ===
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// 1. Request interceptor: gắn access_token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response interceptor: bắt 401 → tự refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // nếu request là call tới refresh endpoint thì không retry tiếp
    if (originalRequest?.url?.includes("/auth-management/api/v1/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang có thằng khác refresh → xếp hàng chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      const oldAccessToken = localStorage.getItem("access_token");

      try {
        const rs = await refreshClient.post("/auth-management/api/v1/auth/refresh", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = rs.data.data;

        localStorage.setItem("access_token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
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
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
