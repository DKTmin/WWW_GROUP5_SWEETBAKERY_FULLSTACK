import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import orderApi from "../cart/apis/orderApi"

function formatPrice(v) {
    if (v == null) return ""
    return Number(v).toLocaleString("vi-VN") + "₫"
}

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("CASH")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {
            const json = localStorage.getItem("cart") || "[]"
            const arr = JSON.parse(json)
            setItems(Array.isArray(arr) ? arr : [])
        } catch (e) {
            setItems([])
        }
    }, [])

    const total = useMemo(() => items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0), [items])

    const handlePay = async () => {
        try {
            const token = localStorage.getItem("access_token")
            if (!token) {
                window.location.href = "/login"
                return
            }
            setLoading(true)
            try {
                const res = await orderApi.checkout(items, paymentMethod)
                // clear cart locally
                localStorage.setItem("cart", JSON.stringify([]))
                window.dispatchEvent(new CustomEvent("cart_update"))
                alert("Đặt hàng thành công. Mã đơn hàng: " + (res.data?.id || "(không có)"))
                navigate("/orders")
                return
            } catch (e) {
                // if backend not available (404) or network error, fallback to local storage
                console.warn('orderApi.checkout failed, falling back to local storage', e)
                const isNotFound = !e.response || e.response.status === 404
                if (!isNotFound) throw e

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
                alert("Mặc định lưu đơn hàng cục bộ (offline). Mã: " + id)
                navigate('/orders')
                return
            }
        } catch (e) {
            console.error(e)
            alert("Thanh toán thất bại")
        } finally {
            setLoading(false)
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
                            <div className="text-sm font-semibold mb-2">Phương thức thanh toán</div>
                            <label className="flex items-center gap-3">
                                <input type="radio" name="payment" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} />
                                <span className="ml-1">Tiền mặt</span>
                            </label>
                            <label className="mt-2 flex items-center gap-3">
                                <input type="radio" name="payment" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} />
                                <span className="ml-1">Momo</span>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <button onClick={handlePay} disabled={loading} className="w-full rounded-full bg-amber-800 px-4 py-3 text-white shadow hover:shadow-lg transition">{loading ? 'Đang xử lý...' : 'Thanh toán'}</button>
                            <button onClick={() => navigate('/cart')} className="w-full rounded-full border border-stone-200 px-4 py-3 text-center">Quay lại giỏ hàng</button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
