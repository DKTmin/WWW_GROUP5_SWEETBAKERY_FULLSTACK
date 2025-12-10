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
    const [bankAccountName, setBankAccountName] = useState("")
    const [bankAccountNumber, setBankAccountNumber] = useState("")
    const [bankName, setBankName] = useState("")
    const [bankAccounts, setBankAccounts] = useState([])
    const [selectedBankAccountId, setSelectedBankAccountId] = useState("")
    const [savingBank, setSavingBank] = useState(false)

    // Auto-pick default bank when list loaded
    useEffect(() => {
        if (bankAccounts && bankAccounts.length > 0 && !selectedBankAccountId) {
            const def = bankAccounts.find((b) => b.isDefault) || bankAccounts[0]
            if (def) {
                setSelectedBankAccountId(String(def.id))
                setBankAccountName(def.accountHolderName || "")
                setBankAccountNumber(def.accountNumber || "")
                setBankName(def.bankName || "")
            }
        }
    }, [bankAccounts, selectedBankAccountId])

    // Khi chọn lại VNPay, nếu đã có tài khoản thì tự đổ vào
    useEffect(() => {
        if (paymentMethod === 'VNPAY') {
            // Nếu chưa có danh sách tài khoản (chưa load) thì fetch ngay — chỉ khi có token
            const token = localStorage.getItem("access_token")
            if (token && (!Array.isArray(bankAccounts) || bankAccounts.length === 0) && typeof orderApi.listBankAccounts === 'function') {
                orderApi.listBankAccounts().then(res => {
                    const raw = res.data?.data ?? res.data ?? []
                    const list = Array.isArray(raw) ? raw : []
                    setBankAccounts(list)
                    const def = list.find((b) => b.isDefault) || list[0]
                    if (def) {
                        setSelectedBankAccountId(String(def.id))
                        setBankAccountName(def.accountHolderName || "")
                        setBankAccountNumber(def.accountNumber || "")
                        setBankName(def.bankName || "")
                    }
                }).catch(() => { /* ignore */ })
            }
        }
        if (paymentMethod === 'VNPAY' && Array.isArray(bankAccounts) && bankAccounts.length > 0) {
            const current = bankAccounts.find((b) => String(b.id) === String(selectedBankAccountId));
            if (current) {
                setBankAccountName(current.accountHolderName || "");
                setBankAccountNumber(current.accountNumber || "");
                setBankName(current.bankName || "");
            } else {
                const def = bankAccounts.find((b) => b.isDefault) || bankAccounts[0];
                if (def) {
                    setSelectedBankAccountId(String(def.id));
                    setBankAccountName(def.accountHolderName || "");
                    setBankAccountNumber(def.accountNumber || "");
                    setBankName(def.bankName || "");
                }
            }
        }
        if (paymentMethod !== 'VNPAY') {
            // không bắt buộc nhưng giữ nguyên giá trị để user quay lại VNPay vẫn còn
        }
    }, [paymentMethod, bankAccounts, selectedBankAccountId])
    const [user, setUser] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [addressDraft, setAddressDraft] = useState("")
    const [editingAddress, setEditingAddress] = useState(false)
    const [savingAddress, setSavingAddress] = useState(false)
    const [bankInfoRequired, setBankInfoRequired] = useState(false)
    const [showBankList, setShowBankList] = useState(false)

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
            // fetch saved bank accounts
            orderApi.listBankAccounts?.().then(res => {
                const raw = res.data?.data ?? res.data ?? []
                const list = Array.isArray(raw) ? raw : []
                setBankAccounts(list)
                const defaultAcc = list.find((b) => b.isDefault) || list[0]
                if (defaultAcc) {
                    setSelectedBankAccountId(String(defaultAcc.id))
                    setBankAccountName(defaultAcc.accountHolderName || "")
                    setBankAccountNumber(defaultAcc.accountNumber || "")
                    setBankName(defaultAcc.bankName || "")
                }
            }).catch((err) => { console.warn('Failed to fetch saved bank accounts', err) })
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
        // If VNPay selected, require bank refund account info (auto-filled when available)
        if (paymentMethod === 'VNPAY') {
            // if any of the bank fields empty, prompt user to fill
            if (!bankAccountName?.trim() || !bankAccountNumber?.trim() || !bankName?.trim()) {
                setBankInfoRequired(true)
                // scroll VNPay section into view if present
                try {
                    const el = document.getElementById('vnpay-section')
                    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                } catch (e) { /* ignore */ }
                alert('Vui lòng nhập hoặc chọn tài khoản nhận hoàn tiền trước khi thanh toán bằng VNPay')
                return
            }
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
                // Cho phép bỏ trống, nếu có sẽ gửi kèm
                res = await orderApi.createVnPayTransaction(
                    items,
                    user?.address,
                    bankAccountName?.trim() || undefined,
                    bankAccountNumber?.trim() || undefined,
                    selectedBankAccountId || undefined,
                    bankName?.trim() || undefined
                )
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
                                    {paymentMethod === 'VNPAY' && (
                                        <div id="vnpay-section" className="mt-3 space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                            <p className="text-sm text-amber-800 font-semibold">Tài khoản nhận hoàn tiền</p>
                                            <div className="mb-2">
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const token = localStorage.getItem('access_token')
                                                        if (!token) {
                                                            alert('Vui lòng đăng nhập để chọn tài khoản đã lưu')
                                                            return
                                                        }
                                                        // fetch if not loaded
                                                        if ((!Array.isArray(bankAccounts) || bankAccounts.length === 0) && typeof orderApi.listBankAccounts === 'function') {
                                                            try {
                                                                const res = await orderApi.listBankAccounts()
                                                                const raw = res.data?.data ?? res.data ?? []
                                                                const list = Array.isArray(raw) ? raw : []
                                                                setBankAccounts(list)
                                                            } catch (err) {
                                                                console.warn('Failed to fetch bank accounts on choose', err)
                                                            }
                                                        }
                                                        setShowBankList((s) => !s)
                                                    }}
                                                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800 hover:bg-amber-100"
                                                >
                                                    Chọn tài khoản có sẵn
                                                </button>
                                            </div>
                                            {Array.isArray(bankAccounts) && bankAccounts.length > 0 && (
                                                <select
                                                    className="w-full rounded-md border border-stone-200 p-2 text-sm"
                                                    value={selectedBankAccountId}
                                                    onChange={(e) => {
                                                        const id = e.target.value
                                                        setSelectedBankAccountId(id)
                                                        const found = (Array.isArray(bankAccounts) ? bankAccounts : []).find((b) => String(b.id) === String(id))
                                                        if (found) {
                                                            setBankAccountName(found.accountHolderName || "")
                                                            setBankAccountNumber(found.accountNumber || "")
                                                            setBankName(found.bankName || "")
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Chọn tài khoản đã lưu --</option>
                                                    {(Array.isArray(bankAccounts) ? bankAccounts : []).map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.accountHolderName} - {b.accountNumber} ({b.bankName})
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {showBankList && (
                                                <div className="mt-2 space-y-2 rounded-md border border-stone-100 bg-white p-2">
                                                    {(!Array.isArray(bankAccounts) || bankAccounts.length === 0) ? (
                                                        <div className="text-sm text-stone-500">Không có tài khoản đã lưu</div>
                                                    ) : (
                                                        bankAccounts.map((b) => (
                                                            <div key={b.id} className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-stone-50">
                                                                <div className="text-sm">
                                                                    <div className="font-medium text-stone-800">{b.accountHolderName}</div>
                                                                    <div className="text-xs text-stone-500">{b.accountNumber} — {b.bankName}</div>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedBankAccountId(String(b.id))
                                                                            setBankAccountName(b.accountHolderName || "")
                                                                            setBankAccountNumber(b.accountNumber || "")
                                                                            setBankName(b.bankName || "")
                                                                            setShowBankList(false)
                                                                        }}
                                                                        className="rounded-full bg-amber-800 px-3 py-1 text-sm text-white"
                                                                    >
                                                                        Chọn
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-stone-200 p-2 text-sm"
                                                placeholder="Tên chủ tài khoản"
                                                value={bankAccountName}
                                                onChange={(e) => setBankAccountName(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-stone-200 p-2 text-sm"
                                                placeholder="Số tài khoản"
                                                value={bankAccountNumber}
                                                onChange={(e) => setBankAccountNumber(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-stone-200 p-2 text-sm"
                                                placeholder="Tên ngân hàng"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    disabled={savingBank || !bankAccountNumber.trim() || !bankAccountName.trim() || !bankName.trim()}
                                                    onClick={async () => {
                                                        try {
                                                            setSavingBank(true)
                                                            await orderApi.createBankAccount({
                                                                bankName: bankName.trim(),
                                                                accountHolderName: bankAccountName.trim(),
                                                                accountNumber: bankAccountNumber.trim(),
                                                                isDefault: true,
                                                            })
                                                            const res = await orderApi.listBankAccounts()
                                                            const rawList = res.data?.data ?? res.data ?? []
                                                            const list = Array.isArray(rawList) ? rawList : []
                                                            setBankAccounts(list)
                                                            const def = list.find((b) => b.isDefault) || list[0]
                                                            if (def) {
                                                                setSelectedBankAccountId(String(def.id))
                                                                setBankAccountName(def.accountHolderName || "")
                                                                setBankAccountNumber(def.accountNumber || "")
                                                                setBankName(def.bankName || "")
                                                            }
                                                            alert("Đã lưu tài khoản ngân hàng")
                                                        } catch (err) {
                                                            console.error(err)
                                                            alert("Lưu tài khoản thất bại")
                                                        } finally {
                                                            setSavingBank(false)
                                                        }
                                                    }}
                                                    className="rounded-full bg-amber-800 px-3 py-1 text-sm text-white disabled:opacity-50"
                                                >
                                                    {savingBank ? "Đang lưu..." : "Lưu tài khoản"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-full border border-stone-200 px-3 py-1 text-sm"
                                                    onClick={() => {
                                                        setSelectedBankAccountId("")
                                                        setBankAccountName("")
                                                        setBankAccountNumber("")
                                                        setBankName("")
                                                    }}
                                                >
                                                    Nhập mới
                                                </button>
                                            </div>
                                            <p className="text-xs text-amber-700">Lưu sẵn để tự động điền cho lần thanh toán sau.</p>
                                            {bankInfoRequired && (!bankAccountName?.trim() || !bankAccountNumber?.trim() || !bankName?.trim()) && (
                                                <div className="mt-2 text-sm text-red-600">Vui lòng nhập/chọn tài khoản nhận hoàn tiền để tiếp tục.</div>
                                            )}
                                        </div>
                                    )}
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
                bankAccountName={bankAccountName}
                bankAccountNumber={bankAccountNumber}
                bankName={bankName}
                loading={confirmLoading}
            />
        </>
    )
}

// Confirmation modal
function ConfirmModal({ open, onClose, onConfirm, items, total, address, paymentMethod, bankAccountName, bankAccountNumber, bankName, loading }) {
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
                    {paymentMethod === 'VNPAY' && (
                        <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-amber-800 text-sm">
                            <div className="font-semibold">Tài khoản nhận hoàn tiền</div>
                            <div className="mt-1">{bankAccountName || 'Chưa có tên chủ tài khoản'}</div>
                            <div className="mt-1">Số tài khoản: {bankAccountNumber || 'Chưa có'}</div>
                            <div className="mt-1">Ngân hàng: {bankName || 'Chưa có'}</div>
                            <div className="mt-2 text-xs text-amber-700">Nếu thông tin trống, hãy nhập tài khoản nhận hoàn tiền ở phần VNPay trên trang thanh toán trước khi xác nhận.</div>
                        </div>
                    )}
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
