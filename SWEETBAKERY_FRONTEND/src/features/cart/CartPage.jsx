// src/features/cart/CartPage.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function formatPrice(v) {
    if (v == null) return ""
    return Number(v).toLocaleString("vi-VN") + "₫"
}

export default function CartPage() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(() => {
        const load = () => {
            try {
                const json = localStorage.getItem("cart") || "[]"
                const arr = JSON.parse(json)
                setItems(Array.isArray(arr) ? arr : [])
            } catch (e) {
                setItems([])
            }
        }
        load()

        const onStorage = (e) => {
            if (e.key === "cart") load()
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const total = useMemo(() => items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0), [items])

    const handleRemove = (index) => {
        const next = items.slice()
        next.splice(index, 1)
        setItems(next)
        localStorage.setItem("cart", JSON.stringify(next))
    }

    const handleChangeQty = (index, delta) => {
        const next = items.map((it, i) => {
            if (i !== index) return it
            const qty = Math.max(1, (Number(it.qty) || 1) + delta)
            return { ...it, qty }
        })
        setItems(next)
        localStorage.setItem("cart", JSON.stringify(next))
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#FFFBF0] py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-amber-800">Giỏ hàng của bạn</h2>
                    <p className="mb-6 text-stone-600">Hiện chưa có sản phẩm trong giỏ hàng.</p>
                    <button onClick={() => navigate('/')} className="rounded-full bg-amber-800 px-6 py-2 text-white">Tiếp tục mua sắm</button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#FFFBF0] py-12">
            <div className="mx-auto max-w-5xl px-4">
                <h2 className="mb-6 text-2xl font-bold text-amber-800">Giỏ hàng của bạn</h2>

                <div className="space-y-4">
                    {items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                            <img src={it.image} alt={it.name} className="h-20 w-20 rounded-md object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-stone-800">{it.name}</div>
                                        <div className="text-xs text-stone-500">Kích thước: {it.size}</div>
                                    </div>
                                    <div className="text-sm font-bold text-amber-700">{formatPrice(it.price)}</div>
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-center rounded-full border border-stone-200 bg-white px-1">
                                        <button onClick={() => handleChangeQty(idx, -1)} className="h-8 w-8">-</button>
                                        <div className="w-10 text-center font-bold">{it.qty}</div>
                                        <button onClick={() => handleChangeQty(idx, 1)} className="h-8 w-8">+</button>
                                    </div>

                                    <button onClick={() => handleRemove(idx)} className="text-sm text-red-600">Xóa</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                    <div>
                        <div className="text-sm text-stone-600">Tổng cộng</div>
                        <div className="text-2xl font-bold text-amber-800">{formatPrice(total)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="rounded-full border border-stone-200 px-4 py-2">Tiếp tục mua sắm</Link>
                        <button className="rounded-full bg-amber-800 px-6 py-2 text-white">Thanh toán</button>
                    </div>
                </div>
            </div>
        </main>
    )
}
