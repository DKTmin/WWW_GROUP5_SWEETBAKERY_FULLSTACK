import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import orderApi from "../cart/apis/orderApi"
import authApi from "../auth/apis/authApi"

function formatPrice(v) {
    if (v == null) return ""
    return Number(v).toLocaleString("vi-VN") + "₫"
}

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("CASH")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [addressDraft, setAddressDraft] = useState("")
    const [editingAddress, setEditingAddress] = useState(false)
    const [savingAddress, setSavingAddress] = useState(false)

    useEffect(() => {
        try {
            const json = localStorage.getItem("cart") || "[]"
            const arr = JSON.parse(json)
            setItems(Array.isArray(arr) ? arr : [])
        } catch (e) {
            setItems([])
        }
        // try fetch current user (to get default address)
        const token = localStorage.getItem("access_token")
        if (token) {
            authApi.getInformation()
                .then(res => {
                    const u = res.data?.data || null
                    setUser(u)
                    setAddressDraft(u?.address || "")
                })
                .catch(err => console.warn('Failed to fetch user info for checkout', err))
        }
    }, [])

    const total = useMemo(() => items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0), [items])

    // open confirmation modal (require login)
    const handlePay = () => {
        const token = localStorage.getItem("access_token")
        if (!token) {
            window.location.href = "/login"
            return
        }
        // require a shipping address before allowing checkout
        if (!user?.address) {
            // open the address editor so user can enter address
            setEditingAddress(true)
            alert('Vui lòng nhập địa chỉ giao hàng trước khi thanh toán')
            return
        }
        setShowConfirmModal(true)
    }

    const confirmOrder = async () => {
        setConfirmLoading(true)
        if (!user?.address) {
            // double-check address before sending to server
            alert('Vui lòng nhập địa chỉ giao hàng trước khi xác nhận đơn')
            setConfirmLoading(false)
            return
        }
        try {
            let res
            if (paymentMethod === 'VNPAY') {
                // Create a VNPay transaction (do NOT create the Order yet)
                res = await orderApi.createVnPayTransaction(items, user?.address)
                const payUrl = res?.data?.paymentUrl || res?.data?.paymentUrl
                if (payUrl) {
                    window.location.href = payUrl
                    return
                }
            } else {
                res = await orderApi.checkout(items, paymentMethod)
            }
            // clear cart locally for non-VNPay flows
            localStorage.setItem("cart", JSON.stringify([]))
            window.dispatchEvent(new CustomEvent("cart_update"))
            // alert("Đặt hàng thành công. Mã đơn hàng: " + (res.data?.id || "(không có)"))
            setShowConfirmModal(false)
            navigate("/orders")
            return
        } catch (e) {
            console.warn('orderApi.checkout failed, falling back to local storage', e)
            const isNotFound = !e.response || e.response.status === 404
            if (!isNotFound) {
                console.error(e)
                // alert("Thanh toán thất bại")
                setShowConfirmModal(false)
                return
            }

            // create a local order record
            const localOrdersJson = localStorage.getItem('local_orders') || '[]'
            const localOrders = JSON.parse(localOrdersJson)
            const id = 'local-' + Date.now()
            const total = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0)
            const order = {
                id,
                items,
                total,
                paymentMethod,
                createdAt: new Date().toISOString(),
                local: true
            }
            localOrders.unshift(order)
            localStorage.setItem('local_orders', JSON.stringify(localOrders))
            // clear cart locally
            localStorage.setItem("cart", JSON.stringify([]))
            window.dispatchEvent(new CustomEvent("cart_update"))
            // alert("Mặc định lưu đơn hàng cục bộ (offline). Mã: " + id)
            setShowConfirmModal(false)
            navigate('/orders')
            return
        } finally {
            setConfirmLoading(false)
        }
    }

    const handleSaveAddress = async () => {
        try {
            setSavingAddress(true)
            const res = await authApi.updateInformation({ address: addressDraft })
            const updated = res.data?.data || null
            setUser(updated)
            setEditingAddress(false)
            alert('Lưu địa chỉ thành công')
        } catch (err) {
            console.error('Failed to save address', err)
            alert('Lưu địa chỉ thất bại')
        } finally {
            setSavingAddress(false)
        }
    }

    if (!items || items.length === 0) {
        return (
            <main className="min-h-screen bg-[#FFFBF0] py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="mb-4 text-3xl font-extrabold text-amber-800">Thanh toán</h2>
                    <p className="mb-6 text-stone-600">Không có sản phẩm trong giỏ hàng.</p>
                    <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-white shadow-lg hover:shadow-xl transition">Tiếp tục mua sắm</button>
                </div>
            </main>
        )
    }

    return (
        <>
            <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="mb-6 text-3xl font-extrabold text-amber-800">Thanh toán</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-4">
                            {items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                                    <img src={it.image} alt={it.name} className="h-20 w-20 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-stone-800">{it.name}</div>
                                                {it.size && <div className="text-xs text-stone-500">Kích thước: {it.size}</div>}
                                                <div className="text-xs text-stone-500">Số lượng: {it.qty || 1}</div>
                                            </div>
                                            <div className="text-sm text-stone-500">
                                                <div>Đơn giá: {formatPrice(it.price)}</div>
                                                <div className="mt-1 font-bold text-amber-700">Tiền: {formatPrice((Number(it.price) || 0) * (Number(it.qty) || 0))}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-4">
                                <div className="text-sm text-stone-600">Tổng cộng</div>
                                <div className="text-2xl font-bold text-amber-800">{formatPrice(total)}</div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-semibold mb-2">Địa chỉ giao hàng</div>
                                {!editingAddress ? (
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="text-sm text-stone-700">{user?.address || 'Chưa có địa chỉ'}</div>
                                        <div>
                                            <button onClick={() => setEditingAddress(true)} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">Chỉnh sửa</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <textarea rows={3} value={addressDraft} onChange={(e) => setAddressDraft(e.target.value)} className="w-full rounded-md border border-stone-200 p-2 text-sm" />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveAddress} disabled={savingAddress} className="rounded-full bg-amber-800 px-4 py-2 text-white">{savingAddress ? 'Đang lưu...' : 'Lưu'}</button>
                                            <button onClick={() => { setEditingAddress(false); setAddressDraft(user?.address || ''); }} className="rounded-full border border-stone-200 px-4 py-2">Huỷ</button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="text-sm font-semibold mb-2">Phương thức thanh toán</div>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" name="payment" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} />
                                        <span className="ml-1">Tiền mặt</span>
                                    </label>
                                    <label className="mt-2 flex items-center gap-3">
                                        <input type="radio" name="payment" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                                        <span className="ml-1">VNPay</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handlePay} disabled={loading || confirmLoading} className="w-full rounded-full bg-amber-800 px-4 py-3 text-white shadow hover:shadow-lg transition">{(loading || confirmLoading) ? 'Đang xử lý...' : 'Thanh toán'}</button>
                                <button onClick={() => navigate('/cart')} className="w-full rounded-full border border-stone-200 px-4 py-3 text-center">Quay lại giỏ hàng</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <ConfirmModal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmOrder}
                items={items}
                total={total}
                address={user?.address}
                paymentMethod={paymentMethod}
                loading={confirmLoading}
            />
        </>
    )
}

// Confirmation modal
function ConfirmModal({ open, onClose, onConfirm, items, total, address, paymentMethod, loading }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-stone-800">Xác nhận đặt hàng</h3>
                <div className="max-h-60 overflow-auto">
                    {items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-stone-100 py-2">
                            <div>
                                <div className="font-medium text-stone-800">{it.name}</div>
                                <div className="text-xs text-stone-500">Số lượng: {it.qty || 1}</div>
                            </div>
                            <div className="text-sm font-semibold text-amber-700">{formatPrice(Number(it.qty || 1) * Number(it.price || 0))}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-stone-600">
                        <div>Tổng tiền</div>
                        <div className="font-bold text-amber-800">{formatPrice(total)}</div>
                    </div>
                    <div className="text-sm text-stone-600">
                        <div className="font-semibold">Địa chỉ giao hàng</div>
                        <div className="text-stone-800">{address || 'Chưa có địa chỉ'}</div>
                    </div>
                    <div className="text-sm text-stone-600">
                        <div className="font-semibold">Phương thức thanh toán</div>
                        <div className="text-stone-800">{paymentMethod}</div>
                    </div>
                    {!address && (
                        <div className="mt-2 text-sm text-red-600">Vui lòng nhập địa chỉ giao hàng trước khi xác nhận đơn.</div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-full border border-stone-200 px-4 py-2">Huỷ</button>
                    <button onClick={onConfirm} disabled={loading || !address} className="rounded-full bg-amber-800 px-4 py-2 text-white">{loading ? 'Đang xử lý...' : 'Xác nhận'}</button>
                </div>
            </div>
        </div>
    )
}

export { ConfirmModal }
