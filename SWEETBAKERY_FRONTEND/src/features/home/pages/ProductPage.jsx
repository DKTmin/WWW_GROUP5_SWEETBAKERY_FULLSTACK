// src/features/home/pages/ProductPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import pastryApi from "../apis/pastryApi";
import PastryCard from "../components/PastryCard";

// --- ICONS ---
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
);
const TruckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-3.375h3.375c.621 0 1.125-.504 1.125-1.125V9.75c0-1.005-.412-2.028-1.192-2.502L16.5 15.375Z" /></svg>
);
const ShieldCheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
);
const ShoppingBagIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5.407c.49 2.1-.924 4.086-3.083 4.086H6.214c-2.16 0-3.573-1.986-3.083-4.086l1.263-5.407a2.25 2.25 0 0 1 2.192-1.738h9.872c.98 0 1.84.628 2.192 1.738ZM6.75 6a5.25 5.25 0 0 1 10.5 0" /></svg>
);

function formatPrice(value) {
  if (value == null) return "";
  return Number(value).toLocaleString("vi-VN") + "₫";
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pastry, setPastry] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // State cho thông báo

  // Gallery & Form state
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const fallbackSizes = ["20 cm", "28 cm"];

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError("");
      // Reset state khi đổi sản phẩm
      setQuantity(1); 
      
      try {
        const res = await pastryApi.getById(id);
        const data = res.data?.data;
        if (!data) {
          setError("Không tìm thấy sản phẩm.");
          setPastry(null);
          return;
        }
        setPastry(data);
        setMainImage(data.imageUrl || data.image || "/placeholder.png");

        if (data.sizeOptions && data.sizeOptions.length > 0) {
          setSelectedSize(data.sizeOptions[0]);
        } else {
          setSelectedSize(fallbackSizes[0]);
        }

        const categoryId = data.categoryId || (data.category && data.category.id);
        if (categoryId) {
          const rel = await pastryApi.findByCategory(categoryId);
          const arr = rel.data?.data || [];
          const filtered = arr.filter((p) => p.id !== data.id).slice(0, 4); // Chỉ lấy 4 sp liên quan
          setRelated(filtered);
        } else {
          setRelated([]);
        }
      } catch (e) {
        console.error(e);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    load();
    // Scroll lên đầu trang khi chuyển trang
    window.scrollTo(0, 0);
  }, [id]);

  const priceText = useMemo(() => formatPrice(pastry?.price), [pastry]);
  const images = pastry?.images?.length ? pastry.images : (pastry ? [pastry.imageUrl || pastry.image || "/placeholder.png"] : []);

  const changeQuantity = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAddToCart = () => {
    try {
      const cartJson = localStorage.getItem("cart") || "[]";
      const cart = JSON.parse(cartJson);

      const item = {
        id: pastry.id,
        name: pastry.name || pastry.title,
        price: Number(pastry.price || 0),
        qty: quantity,
        size: selectedSize,
        image: pastry.imageUrl || pastry.image || "/placeholder.png",
      };

      const idx = cart.findIndex((c) => c.id === item.id && c.size === item.size);
      if (idx >= 0) {
        cart[idx].qty = Number(cart[idx].qty) + Number(item.qty);
      } else {
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Show toast visual feedback
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (e) {
      console.error("Add to cart failed", e);
      alert("Lỗi khi thêm vào giỏ hàng.");
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8E9]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
    </div>
  );

  if (error || !pastry) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E9] gap-4">
      <p className="text-xl text-stone-600">{error || "Sản phẩm không tồn tại"}</p>
      <button onClick={() => navigate(-1)} className="rounded-full bg-amber-800 px-6 py-2 text-white hover:bg-amber-900">Quay lại</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FFFBF0] pb-20 pt-8 font-sans text-stone-700">
      
      {/* Toast Notification */}
      <div className={`fixed right-5 top-24 z-50 flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-green-800 shadow-xl transition-all duration-300 ${showToast ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 invisible"}`}>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200"><ShieldCheckIcon className="h-4 w-4"/></div>
        <div>
           <p className="text-sm font-bold">Thêm thành công!</p>
           <p className="text-xs">Sản phẩm đã vào giỏ hàng.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-700">Trang chủ</Link> 
          <span>/</span>
          <Link to={`/category/${pastry.categoryId || "all"}`} className="hover:text-amber-700">Sản phẩm</Link>
          <span>/</span>
          <span className="font-semibold text-stone-800 truncate max-w-[200px]">{pastry.name}</span>
        </nav>

        {/* PRODUCT MAIN SECTION */}
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* LEFT: GALLERY */}
          <div className="flex flex-col gap-4">
            <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100">
              <img src={mainImage} alt={pastry.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${mainImage === img ? "border-amber-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO & ACTIONS */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-serif text-amber-900 md:text-4xl">{pastry.name}</h1>
            
            {/* Rating giả lập */}
            <div className="mt-2 flex items-center gap-1">
              {[1,2,3,4,5].map(i => <StarIcon key={i} className="h-4 w-4 text-amber-400" />)}
              <span className="ml-2 text-xs text-stone-400">(50 đánh giá)</span>
            </div>

            <div className="mt-4 text-3xl font-bold text-amber-700">{priceText}</div>

            {/* Description */}
            <div className="mt-6 border-t border-stone-200 pt-6">
               <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">Mô tả sản phẩm</h3>
               <p className="mt-2 text-sm leading-relaxed text-stone-600">
                 {pastry.description || "Bánh được làm từ nguyên liệu tự nhiên, không chất bảo quản, mang lại hương vị thơm ngon khó cưỡng."}
               </p>
            </div>

            {/* Options */}
            <div className="mt-6">
              <div className="mb-2 text-sm font-semibold text-stone-800">Kích thước:</div>
              <div className="flex flex-wrap gap-3">
                {(pastry.sizeOptions?.length ? pastry.sizeOptions : fallbackSizes).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${selectedSize === s ? "border-amber-700 bg-amber-700 text-white shadow-md" : "border-stone-200 bg-white text-stone-600 hover:border-amber-700 hover:text-amber-700"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-stone-200 pt-8">
               {/* Quantity */}
               <div className="flex items-center rounded-full border border-stone-300 bg-white px-1">
                  <button onClick={() => changeQuantity(-1)} className="h-10 w-10 text-xl font-medium text-stone-500 hover:text-amber-800">-</button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => changeQuantity(1)} className="h-10 w-10 text-xl font-medium text-stone-500 hover:text-amber-800">+</button>
               </div>

               {/* Add Button */}
               <button 
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-800 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:bg-amber-900 hover:shadow-xl active:scale-95"
               >
                 <ShoppingBagIcon className="h-5 w-5" />
                 THÊM VÀO GIỎ
               </button>
            </div>

            {/* Trust Badges (Chính sách) */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-white p-4 shadow-sm border border-stone-100">
               <div className="flex items-start gap-3">
                  <TruckIcon className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-800">Giao hàng nhanh</h4>
                    <p className="text-xs text-stone-500">Trong 2h nội thành HCM</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-800">Đảm bảo chất lượng</h4>
                    <p className="text-xs text-stone-500">Nguyên liệu tươi 100%</p>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif text-amber-900">Có thể bạn sẽ thích</h2>
            <Link to="/category/all" className="text-sm font-semibold text-amber-700 hover:underline">Xem tất cả</Link>
          </div>
          
          {related.length === 0 ? (
            <div className="py-10 text-center text-stone-500 italic">Đang cập nhật sản phẩm liên quan...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <PastryCard key={p.id} pastry={p} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}