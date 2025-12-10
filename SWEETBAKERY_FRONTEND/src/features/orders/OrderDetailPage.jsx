import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import orderApi from "../cart/apis/orderApi"

function formatPrice(v) {
    if (v == null) return ""
    return Number(v).toLocaleString("vi-VN") + "₫"
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

export default function OrderDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        orderApi.get(id).then(res => {
            if (!mounted) return
            setOrder(res.data)
        }).catch(err => {
            console.warn('Failed to fetch order', err)
            setOrder(null)
        }).finally(() => setLoading(false))
        return () => { mounted = false }
    }, [id])

    if (loading) return <div className="flex min-h-screen items-center justify-center">Đang tải...</div>
    if (!order) return (
        <main className="min-h-screen bg-[#FFFBF0] py-20">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <h2 className="mb-4 text-2xl font-bold">Không tìm thấy đơn hàng</h2>
                <button onClick={() => navigate('/orders')} className="mt-4 rounded-full bg-amber-800 px-4 py-2 text-white">Quay lại</button>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
            <div className="mx-auto max-w-4xl px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800">Chi tiết đơn hàng</h2>
                        <div className="text-sm text-stone-600">Mã đơn: <span className="font-semibold text-stone-800">{order.id}</span></div>
                        <div className="text-sm text-stone-500">Ngày: {new Date(order.ngayDatHang || order.createdAt || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.trangThai)}`}>
                            {statusLabel(order.trangThai)}
                        </div>
                        <div className="text-sm text-stone-600">Tổng: <span className="font-bold text-amber-800">{formatPrice(order.tongTien || order.total || 0)}</span></div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 text-sm text-stone-600">
                        <div className="font-semibold">Địa chỉ giao hàng</div>
                        <div className="text-stone-800">{order.customerAddress || 'Chưa có'}</div>
                    </div>
                    <div className="mb-4 text-sm text-stone-600">
                        <div className="font-semibold">Phương thức thanh toán</div>
                        <div className="text-stone-800">{order.paymentMethod || '-'}</div>
                        {(order.paymentMethod && order.paymentMethod.toString().toUpperCase() === 'VNPAY') && (
                            <div className="mt-2 space-y-1">
                                {order.bankAccountName && <div className="text-sm">Tên chủ TK: {order.bankAccountName}</div>}
                                {order.bankAccountNumber && <div className="text-sm">Số tài khoản: {order.bankAccountNumber}</div>}
                                {order.bankName && <div className="text-sm">Ngân hàng: {order.bankName}</div>}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h4 className="mb-3 font-semibold text-stone-800">Sản phẩm</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {(order.items || []).map((it, idx) => (
                                <div key={idx} className="flex items-center gap-3 border-b border-stone-100 pb-3">
                                    <img src={it.image || ''} alt={it.name} className="h-16 w-16 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <div className="font-medium text-stone-800">{it.name}</div>
                                        <div className="text-xs text-stone-500">Số lượng: {it.qty}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-amber-700">{formatPrice((it.price || it.unitPrice || 0) * (it.qty || 1))}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button onClick={() => navigate('/orders')} className="rounded-full bg-amber-800 px-4 py-2 text-white">Quay lại danh sách</button>
                    </div>
                </div>
            </div>
        </main>
    )
}
