import axiosClient from "../../../utils/axiosClient"

const orderApi = {
    checkout: (cart, paymentMethod = "CASH") => {
        try {
            const items = (cart || []).map((it) => ({ pastryId: it.id, qty: it.qty }))
            return axiosClient.post("/orders/checkout", { items, paymentMethod })
        } catch (e) {
            return Promise.reject(e)
        }
    },
    list: () => axiosClient.get("/orders"),
    get: (id) => axiosClient.get(`/orders/${id}`)
}

export default orderApi
