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
    createVnPayTransaction: (cart, address, bankAccountName, bankAccountNumber, bankAccountId, bankName) => {
        try {
            const items = (cart || []).map((it) => ({ pastryId: it.id, qty: it.qty }))
            return axiosClient.post('/payments/vnpay/create', { items, address, paymentMethod: 'VNPAY', bankAccountName, bankAccountNumber, bankAccountId, bankName })
        } catch (e) {
            return Promise.reject(e)
        }
    },
    listBankAccounts: () => axiosClient.get("/bank-accounts"),
    createBankAccount: (payload) => axiosClient.post("/bank-accounts", payload),
    list: () => axiosClient.get("/orders"),
    get: (id) => axiosClient.get(`/orders/${id}`),
    cancel: (id, lyDoHuy) => axiosClient.put(`/orders/${id}/cancel`, { lyDoHuy })
}

export default orderApi
