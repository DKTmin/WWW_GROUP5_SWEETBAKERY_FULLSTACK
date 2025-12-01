// src/features/cart/CartPage.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import cartApi from "./apis/cartApi"
import orderApi from "./apis/orderApi"

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
            if (!e || e.key === "cart") load()
        }
        const onCustom = () => load()

        window.addEventListener("storage", onStorage)
        window.addEventListener("cart_update", onCustom)
        return () => {
            window.removeEventListener("storage", onStorage)
            window.removeEventListener("cart_update", onCustom)
        }
    }, [])

    const total = useMemo(() => items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0), [items])

    const handleRemove = (index) => {
        const next = items.slice()
        next.splice(index, 1)
        setItems(next)
        localStorage.setItem("cart", JSON.stringify(next))
        // notify header and other listeners in this tab
        window.dispatchEvent(new CustomEvent("cart_update"))
        try {
            const token = localStorage.getItem("access_token")
            if (token) cartApi.sync(next, true).catch((e) => console.warn("cart sync failed", e))
        } catch (e) {
            console.warn(e)
        }
    }

    const handleChangeQty = (index, delta) => {
        const next = items.map((it, i) => {
            if (i !== index) return it
            const qty = Math.max(1, (Number(it.qty) || 1) + delta)
            return { ...it, qty }
        })
        setItems(next)
        localStorage.setItem("cart", JSON.stringify(next))
        // notify header and other listeners in this tab
        window.dispatchEvent(new CustomEvent("cart_update"))
        try {
            const token = localStorage.getItem("access_token")
            if (token) cartApi.sync(next, true).catch((e) => console.warn("cart sync failed", e))
        } catch (e) {
            console.warn(e)
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-linear-to-b from-[#FFF7ED] to-[#FFFBF0] py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="mb-4 text-3xl font-extrabold text-amber-800">Giỏ hàng của bạn</h2>
                    <p className="mb-6 text-stone-600">Hiện chưa có sản phẩm trong giỏ hàng.</p>
                    <button
                        onClick={() => navigate('/category/all')}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
                    >
                        Tiếp tục mua sắm
                    </button>

                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFF7ED] to-[#FFFBF0] py-12">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-6 text-3xl font-extrabold text-amber-800">Giỏ hàng của bạn</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        {items.map((it, idx) => (
                            <div key={idx} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-md transition transform duration-200 hover:scale-[1.01]">
                                <img src={it.image} alt={it.name} className="h-28 w-28 shrink-0 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold text-stone-800 text-lg">{it.name}</div>
                                            {it.size && <div className="mt-1 text-sm text-stone-500">Kích thước: {it.size}</div>}
                                        </div>
                                        <div className="text-right text-sm text-stone-600">
                                            <div>Đơn giá</div>
                                            <div className="mt-1 font-bold text-amber-700 text-lg">{formatPrice(it.price)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleChangeQty(idx, -1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm hover:bg-stone-50 transition">-</button>
                                            <div className="min-w-[44px] text-center font-medium">{it.qty}</div>
                                            <button onClick={() => handleChangeQty(idx, 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-white shadow hover:scale-105 transition">+</button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-stone-600">Tiền</div>
                                            <div className="text-lg font-bold text-amber-800">{formatPrice((Number(it.price) || 0) * (Number(it.qty) || 0))}</div>
                                            <button
                                                onClick={() => handleRemove(idx)}
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md text-sm transition"
                                            >
                                                <span className="material-icons text-base">Xóa</span>
                                           
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="rounded-xl bg-white p-6 shadow-md">
                        <div className="mb-4">
                            <div className="text-sm text-stone-600">Tổng đơn hàng</div>
                            <div className="text-3xl font-extrabold text-amber-800">{formatPrice(total)}</div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/category/all"
                                className="block w-full rounded-full border border-stone-200 px-4 py-3 text-center"
                            >
                                Tiếp tục mua sắm
                            </Link>

                            <button onClick={() => {
                                const token = localStorage.getItem("access_token")
                                if (!token) {
                                    window.location.href = "/login"
                                    return
                                }
                                navigate('/checkout')
                            }} className="w-full rounded-full bg-amber-800 px-4 py-3 text-white shadow hover:shadow-lg transition">Đặt Bánh</button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
