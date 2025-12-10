import axiosClient from "../../../utils/axiosClient"

const cartApi = {
    // attempt to sync local cart to server for authenticated user
    // Backend endpoint expects items: [{ pastryId, qty }]
    sync: (cart, replace = false) => {
        try {
            const items = (cart || []).map((it) => ({ pastryId: it.id, qty: it.qty }))
            return axiosClient.post("/cart/sync", { items, replace })
        } catch (e) {
            return Promise.reject(e)
        }
    },
    // fetch server-side cart for current authenticated user
    get: () => axiosClient.get("/cart"),
}

export default cartApi
