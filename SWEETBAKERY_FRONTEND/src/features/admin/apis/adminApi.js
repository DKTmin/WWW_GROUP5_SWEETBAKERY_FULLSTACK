import axiosClient from "../../../utils/axiosClient";

const adminApi = {
  getOtp: () =>
    axiosClient.get("/gmail-management/api/v1/gmail/send-otp"),
  verifyOtp: (otp) =>
    axiosClient.post("/gmail-management/api/v1/gmail/verify-otp", otp),
};

export default adminApi;
