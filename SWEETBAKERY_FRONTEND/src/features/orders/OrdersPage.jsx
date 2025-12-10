import { useEffect, useState } from "react"
import orderApi from "../cart/apis/orderApi"
import { useNavigate, useLocation } from "react-router-dom"

function formatPrice(v) {
    if (v == null) return ""
    return Number(v).toLocaleString("vi-VN") + "₫"
}

function placeholderImageDataUrl() {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" stroke-width="1"><rect width="24" height="24" rx="4" ry="4" fill="#F8FAFC"/></svg>`
    )
}

function getItemImage(it) {
    return it.image || it.pastryImage || (it.pastry && it.pastry.image) || placeholderImageDataUrl()
}

function isVnPay(order) {
    const method = (order?.paymentMethod || order?.payment_method || "").toString().toUpperCase()
    return method === 'VNPAY'
}

function statusLabel(status) {
    if (!status) return ''
    switch (status) {
        case 'PENDING': return 'Đang chờ xử lý'
        case 'PAID': return 'Đã thanh toán'
        case 'CONFIRMED': return 'Đã xác nhận'
        case 'COMPLETED': return 'Hoàn thành'
        case 'REFUND_PENDING': return 'Đang đợi hoàn tiền'
        case 'CANCELLED': return 'Đã hủy'
        case 'HOAN_THANH': return 'Hoàn thành'
        case 'DA_HUY': return 'Đã hủy'
        default: return status
    }
}

function statusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800'
        case 'PAID': return 'bg-indigo-100 text-indigo-800'
        case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
        case 'COMPLETED': return 'bg-green-100 text-green-800'
        case 'REFUND_PENDING': return 'bg-orange-100 text-orange-800'
        case 'CANCELLED': return 'bg-red-100 text-red-800'
        case 'HOAN_THANH': return 'bg-green-100 text-green-800'
        case 'DA_HUY': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Sắp xếp orders: mới nhất trước.
// Hỗ trợ nhiều trường ngày: ngayDatHang, createdAt, createdDate, created, date.
// Nếu không có ngày, cố lấy id số, ngược lại trả 0.
function sortOrdersArray(arr) {
    if (!Array.isArray(arr)) return arr
    return arr.slice().sort((a, b) => {
        const getTime = (o) => {
            if (!o) return 0
            const dateVal = o?.ngayDatHang ?? o?.createdAt ?? o?.createdDate ?? o?.created ?? o?.date
            if (dateVal) {
                const t = new Date(dateVal).getTime()
                if (!isNaN(t)) return t
            }
            // fallback: if id is numeric, use that (useful for some local orders)
            const id = o?.id
            if (typeof id === 'number') return id
            if (typeof id === 'string' && /^\d+$/.test(id)) return parseInt(id, 10)
            return 0
        }
        return getTime(b) - getTime(a)
    })
}

export default function OrdersPage() {
    const [orders, setOrders] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [cancelReason, setCancelReason] = useState("")
    const [customReason, setCustomReason] = useState("")
    const [cancelling, setCancelling] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const CANCEL_REASONS = [
        "Thay đổi ý định mua hàng",
        "Đặt nhầm sản phẩm",
        "Tìm thấy sản phẩm tốt hơn ở nơi khác",
        "Giá cả không phù hợp",
        "Không còn nhu cầu sử dụng",
        "Lý do khác"
    ]

    useEffect(() => {
        // Nếu URL có fromPayment=1 (VNPay redirect sau khi thanh toán thành công)
        // thì dọn giỏ hàng local và xóa query param khỏi URL.
        try {
            const params = new URLSearchParams(location.search)
            if (params.get("fromPayment") === "1") {
                localStorage.removeItem("cart")
                window.dispatchEvent(new CustomEvent("cart_update"))
                // Xóa query khỏi thanh địa chỉ để F5 không dọn giỏ nữa
                navigate("/orders", { replace: true })
            }
        } catch (e) {
            console.warn("Handle fromPayment flag failed", e)
        }

        let mounted = true
        orderApi.list().then(res => {
            if (!mounted) return
            try {
                // merge server orders with any locally saved orders
                // handle different response shapes: array or { data: [...] }
                let serverOrders = []
                if (Array.isArray(res.data)) {
                    serverOrders = res.data
                } else if (Array.isArray(res.data?.data)) {
                    serverOrders = res.data.data
                } else if (res.data && typeof res.data === 'object') {
                    // sometimes backend may wrap result differently; try to find array value
                    const possible = Object.values(res.data).find(v => Array.isArray(v))
                    if (Array.isArray(possible)) serverOrders = possible
                    else {
                        // unexpected shape — log for debugging and fallback to empty
                        console.warn('Unexpected orders response shape', res.data)
                        serverOrders = []
                    }
                }

                const localJson = localStorage.getItem('local_orders') || '[]'
                const localOrders = JSON.parse(localJson) || []
                // mark local orders
                const markedLocal = localOrders.map(o => ({ ...o, local: true }))
                // Sort combined list so newest orders appear first
                setOrders(sortOrdersArray([...markedLocal, ...serverOrders]))
            } catch (parseErr) {
                console.error('Failed to parse orders response', parseErr, res)
                setOrders(false)
            }
        }).catch(e => {
            console.warn('orders fetch failed', e)
            // keep error info in state by setting to special value false
            setOrders(false)
        })
        return () => { mounted = false }
    }, [])

    const fetchOrders = () => {
        orderApi.list().then(res => {
            try {
                let serverOrders = []
                if (Array.isArray(res.data)) {
                    serverOrders = res.data
                } else if (Array.isArray(res.data?.data)) {
                    serverOrders = res.data.data
                } else if (res.data && typeof res.data === 'object') {
                    const possible = Object.values(res.data).find(v => Array.isArray(v))
                    if (Array.isArray(possible)) serverOrders = possible
                    else {
                        console.warn('Unexpected orders response shape', res.data)
                        serverOrders = []
                    }
                }

                const localJson = localStorage.getItem('local_orders') || '[]'
                const localOrders = JSON.parse(localJson) || []
                const markedLocal = localOrders.map(o => ({ ...o, local: true }))
                setOrders(sortOrdersArray([...markedLocal, ...serverOrders]))
            } catch (parseErr) {
                console.error('Failed to parse orders response', parseErr, res)
                setOrders(false)
            }
        }).catch(e => {
            console.warn('orders fetch failed', e)
            setOrders(false)
        })
    }

    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId)
        setCancelReason("")
        setCustomReason("")
        setShowCancelModal(true)
    }

    const handleConfirmCancel = async () => {
        const finalReason = cancelReason === "Lý do khác" ? customReason : cancelReason
        if (!finalReason.trim()) {
            alert("Vui lòng chọn hoặc nhập lý do hủy đơn hàng")
            return
        }

        setCancelling(true)
        try {
            await orderApi.cancel(selectedOrderId, finalReason)
            alert("Hủy đơn hàng thành công!")
            setShowCancelModal(false)
            setSelectedOrderId(null)
            setCancelReason("")
            setCustomReason("")
            fetchOrders() // Reload orders
        } catch (error) {
            console.error("Cancel order failed:", error)
            const errorMsg = error.response?.data?.message || error.message || "Không thể hủy đơn hàng"
            alert(errorMsg)
        } finally {
            setCancelling(false)
        }
    }

    if (orders === null) {
        return (
            <main className="min-h-screen bg-[#FFFBF0] py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-300 border-t-transparent"></div>
                    <div className="mt-4 text-stone-600">Đang tải đơn hàng...</div>
                </div>
            </main>
        )
    }
    // if fetch failed (orders === false), then try to read local_orders
    if (orders === false) {
        const localJson = localStorage.getItem('local_orders') || '[]'
        const localOrders = JSON.parse(localJson) || []
        const sortedLocalOrders = sortOrdersArray(localOrders)
        if (!sortedLocalOrders || sortedLocalOrders.length === 0) {
            return (
                <main className="min-h-screen bg-[#FFFBF0] py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="mb-4 text-3xl font-extrabold text-amber-800">Đơn hàng của bạn</h2>
                        <p className="mb-6 text-stone-600">Không thể kết nối server. Bạn chưa có đơn hàng cục bộ.</p>
                        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition">Tiếp tục mua sắm</button>
                    </div>
                </main>
            )
        }
        // show local orders (sắp xếp: mới nhất trước)
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="mb-6 text-3xl font-extrabold text-amber-800">Đơn hàng </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {sortedLocalOrders.map((o) => (
                            <div key={o.id} className="rounded-xl bg-white p-5 shadow-md transition transform hover:scale-[1.01]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-stone-600">Mã đơn: <span className="font-semibold text-stone-800">{o.id}</span></div>
                                        <div className="mt-1 text-sm text-stone-500">Ngày: {new Date(o.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800`}>
                                            Cục bộ
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-stone-600">Tổng</div>
                                            <div className="mt-1 text-xl font-bold text-amber-800">{formatPrice(o.total || 0)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-2">
                                    {(o.items || []).map((it, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <img src={it.image || ''} alt={it.name} className="h-12 w-12 rounded-md object-cover" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-stone-800">{it.name}</div>
                                                <div className="text-xs text-stone-500">Số lượng: {it.qty}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-amber-700">{formatPrice((it.price || 0) * (it.qty || 1))}</div>
                                        </div>
                                    ))}
                                </div>

                                {o.lyDoHuy && (
                                    <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
                                        <p className="text-xs font-semibold text-red-800 mb-1">Lý do hủy:</p>
                                        <p className="text-sm text-red-700">{o.lyDoHuy}</p>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <button onClick={() => navigate(`/orders/${o.id}`)} className="rounded-full bg-amber-800 px-4 py-2 text-white shadow hover:shadow-lg transition">Xem chi tiết</button>
                                    {(!o.local && (o.trangThai === 'PENDING' || (o.trangThai === 'PAID' && isVnPay(o)))) && (
                                        <button
                                            onClick={() => handleCancelClick(o.id)}
                                            className="rounded-full bg-red-600 px-4 py-2 text-white shadow hover:shadow-lg transition hover:bg-red-700"
                                        >
                                            {o.trangThai === 'PAID' ? 'Hủy & đợi hoàn tiền' : 'Hủy đơn'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    // Lọc đơn theo tên sản phẩm nếu có nhập từ khóa
    const normalizedSearch = (searchText || "").trim().toLowerCase()
    const displayOrders = normalizedSearch
        ? orders.filter(o =>
            Array.isArray(o.items) &&
            o.items.some(it => {
                const name = (it.name || it.pastryName || "").toLowerCase()
                return name.includes(normalizedSearch)
            })
        )
        : orders

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-3xl font-extrabold text-amber-800">Đơn hàng của bạn</h2>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm đơn theo tên sản phẩm..."
                        className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 md:w-72"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {displayOrders.length === 0 && (
                        <div className="rounded-xl bg-white p-8 text-center text-stone-600 shadow-md">
                            {orders.length === 0
                                ? "Bạn chưa có đơn hàng nào."
                                : "Không tìm thấy đơn hàng chứa sản phẩm phù hợp với từ khóa."}
                        </div>
                    )}

                    {displayOrders.map((o) => (
                        <div key={o.id} className="rounded-xl bg-white p-5 shadow-md transition transform hover:scale-[1.01]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-sm text-stone-600">Mã đơn: <span className="font-semibold text-stone-800">{o.id}</span></div>
                                    <div className="mt-1 text-sm text-stone-500">Ngày: {new Date(o.ngayDatHang || o.createdAt || o.createdDate || Date.now()).toLocaleString()}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(o.trangThai)}`}>
                                        {statusLabel(o.trangThai)}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-stone-600">Tổng</div>
                                        <div className="mt-1 text-xl font-bold text-amber-800">{formatPrice(o.tongTien || o.total || o.amount || 0)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2">
                                {(o.items || []).slice(0, 4).map((it, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={getItemImage(it)} alt={it.name || it.pastryName} className="h-12 w-12 rounded-md object-cover" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-stone-800">{it.name || it.pastryName}</div>
                                            <div className="text-xs text-stone-500">Số lượng: {it.qty}</div>
                                        </div>
                                        <div className="text-sm font-semibold text-amber-700">{formatPrice((it.price || it.unitPrice || 0) * (it.qty || 1))}</div>
                                    </div>
                                ))}
                            </div>

                            {o.lyDoHuy && (
                                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
                                    <p className="text-xs font-semibold text-red-800 mb-1">Lý do hủy:</p>
                                    <p className="text-sm text-red-700">{o.lyDoHuy}</p>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-end gap-2">
                                <button onClick={() => navigate(`/orders/${o.id}`)} className="rounded-full bg-amber-800 px-4 py-2 text-white shadow hover:shadow-lg transition">Xem chi tiết</button>
                                {(!o.local && (o.trangThai === 'PENDING' || (o.trangThai === 'PAID' && isVnPay(o)))) && (
                                    <button
                                        onClick={() => handleCancelClick(o.id)}
                                        className="rounded-full bg-red-600 px-4 py-2 text-white shadow hover:shadow-lg transition hover:bg-red-700"
                                    >
                                        {o.trangThai === 'PAID' ? 'Hủy & đợi hoàn tiền' : 'Hủy đơn'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h3 className="text-xl font-bold text-slate-800">Hủy đơn hàng</h3>
                            <p className="mt-1 text-sm text-slate-600">Vui lòng chọn lý do hủy đơn hàng của bạn</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Lý do hủy đơn hàng
                                </label>
                                <select
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                >
                                    <option value="">-- Chọn lý do hủy --</option>
                                    {CANCEL_REASONS.map((reason, idx) => (
                                        <option key={idx} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {cancelReason === "Lý do khác" && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Mô tả chi tiết
                                    </label>
                                    <textarea
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Nhập lý do hủy đơn hàng..."
                                        rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false)
                                    setSelectedOrderId(null)
                                    setCancelReason("")
                                    setCustomReason("")
                                }}
                                disabled={cancelling}
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={cancelling || (!cancelReason.trim() || (cancelReason === "Lý do khác" && !customReason.trim()))}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
