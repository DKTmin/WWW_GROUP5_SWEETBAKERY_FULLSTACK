import { useEffect, useState } from "react"
import orderApi from "../cart/apis/orderApi"
import { useNavigate } from "react-router-dom"

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

function statusLabel(status) {
    if (!status) return ''
    switch (status) {
        case 'PENDING': return 'Đang chờ xử lý'
        case 'CONFIRMED': return 'Đã xác nhận'
        case 'COMPLETED': return 'Hoàn thành'
        case 'CANCELLED': return 'Đã hủy'
        case 'HOAN_THANH': return 'Hoàn thành'
        case 'DA_HUY': return 'Đã hủy'
        default: return status
    }
}

function statusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800'
        case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
        case 'COMPLETED': return 'bg-green-100 text-green-800'
        case 'CANCELLED': return 'bg-red-100 text-red-800'
        case 'HOAN_THANH': return 'bg-green-100 text-green-800'
        case 'DA_HUY': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

export default function OrdersPage() {
    const [orders, setOrders] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
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
                setOrders([...markedLocal, ...serverOrders])
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
        const localOrders = JSON.parse(localJson)
        if (!localOrders || localOrders.length === 0) {
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
        // show local orders
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="mb-6 text-3xl font-extrabold text-amber-800">Đơn hàng </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {localOrders.map((o) => (
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

                                <div className="mt-4 flex items-center justify-end">
                                    <button onClick={() => navigate(`/orders/${o.id}`)} className="rounded-full bg-amber-800 px-4 py-2 text-white shadow hover:shadow-lg transition">Xem chi tiết</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-screen bg-[#FFFBF0] py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="mb-4 text-3xl font-extrabold text-amber-800">Đơn hàng của bạn</h2>
                    <p className="mb-6 text-stone-600">Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition">Tiếp tục mua sắm</button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-6 text-3xl font-extrabold text-amber-800">Đơn hàng của bạn</h2>

                <div className="grid grid-cols-1 gap-4">
                    {orders.map((o) => (
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

                            <div className="mt-4 flex items-center justify-end">
                                <button onClick={() => navigate(`/orders/${o.id}`)} className="rounded-full bg-amber-800 px-4 py-2 text-white shadow hover:shadow-lg transition">Xem chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
