import axiosClient from "../../../utils/axiosClient";

const aiApi = {
    chat: (message) => axiosClient.post("/ai-management/api/v1/ai/chat", { message }),
};

export default aiApi;