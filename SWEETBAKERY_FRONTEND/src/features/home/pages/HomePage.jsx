import { useEffect, useState } from "react"; // Thêm useState, useEffect
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm hooks router
import HomeBanner from "../components/HomeBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import cartApi from "../../cart/apis/cartApi"; // Import api cart để sync giỏ hàng nếu cần

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);

  // --- LOGIC XỬ LÝ GOOGLE LOGIN ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get("code");

    // Nếu tìm thấy code trên URL -> Bắt đầu xử lý
    if (authCode) {
      handleGoogleCallback(authCode);
    }
  }, [location]);

  const handleGoogleCallback = async (code) => {
    setIsProcessingGoogle(true);
    try {
      console.log("Đang xử lý Google Code tại HomePage:", code);

      // Gọi API Backend (Port 8082 như code cũ của bạn)
      const res = await fetch("http://localhost:8082/auth-management/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });

      const data = await res.json();

      if (data.code === 200) {
        console.log("Login Google thành công:", data);
        const { accessToken, refreshToken } = data.data;

        // 1. Lưu token
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // 2. Xử lý Cart (Merge giỏ hàng - Logic giống bên Login)
        // (Tùy chọn: Nếu bạn muốn merge giỏ hàng ngay tại đây)
        await handleMergeCart();

        // 3. Dispatch event để Header cập nhật lại avatar/tên user
        window.dispatchEvent(new Event("storage"));

        // 4. Dọn dẹp URL (Xóa ?code=... đi nhìn cho đẹp)
        navigate("/", { replace: true });

        // Reload nhẹ một cái để đảm bảo mọi state (Header, Auth) được cập nhật mới nhất
        window.location.reload();
      } else {
        alert("Đăng nhập Google thất bại: " + data.message);
        navigate("/", { replace: true }); // Xóa code lỗi đi
      }
    } catch (err) {
      console.error("Lỗi kết nối Google Login:", err);
      alert("Có lỗi xảy ra khi kết nối tới server.");
    } finally {
      setIsProcessingGoogle(false);
    }
  };

  // Hàm phụ trợ merge cart (lấy từ logic cũ của bạn)
  const handleMergeCart = async () => {
    try {
      // Logic merge cart đơn giản hóa: Bắn event để component Cart tự xử lý hoặc gọi API sync
      // Ở đây mình trigger event update để UI cập nhật số lượng
      window.dispatchEvent(new CustomEvent("cart_update"));

      // Nếu muốn sync server kỹ hơn, bạn có thể copy đoạn logic map/reduce từ LoginForm qua đây
      // ...
    } catch (e) {
      console.warn("Lỗi sync cart:", e);
    }
  };
  // --------------------------------

  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6 relative">
      {/* Loading Overlay khi đang xử lý Google Login */}
      {isProcessingGoogle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
          <p className="mt-4 font-semibold text-amber-800">Đang đăng nhập với Google...</p>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4">
        {/* Banner (carousel) */}
        <HomeBanner />

        {/* Featured categories (3 boxes linking to category pages) */}
        <FeaturedCategories />

        {/* Intro section + small highlight card (kept from original) */}
        <section className="mx-auto mt-8 flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          {/* Left: intro text */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Sweet Bakery
            </p>
            <h1 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
              Ngọt ngào cho mọi khoảnh khắc trong ngày của bạn
            </h1>
            <p className="mt-3 text-sm text-stone-600 md:text-[15px]">
              Bánh tươi mỗi ngày với nguyên liệu chọn lọc, phong cách Pháp hiện đại. Đặt bánh sinh
              nhật, bánh ngọt, bánh mì chỉ với vài thao tác.
            </p>
          </div>

          {/* Right: small highlight card */}
          <div className="mt-2 w-full max-w-xs rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-stone-900 p-px shadow-lg md:mt-0">
            <div className="flex h-full w-full flex-col justify-between rounded-3xl bg-[#FFF8E9] p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Special of the day
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  Combo trà chiều Sweet Day
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  Chọn 3 bánh ngọt + 2 thức uống, ưu đãi dành riêng cho hôm nay.
                </p>
              </div>
              <button className="mt-3 self-start rounded-full bg-amber-700 px-4 py-1.5 text-xs font-semibold text-amber-50 shadow-sm transition hover:-translate-y-px hover:shadow-md">
                Đặt ngay
              </button>
            </div>
          </div>
        </section>

        {/* Featured products section */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-stone-900 md:text-xl">Sản phẩm nổi bật</h2>
            <p className="mt-1 text-sm text-stone-600">
              Những chiếc bánh được khách hàng yêu thích nhất.
            </p>
          </div>

          <FeaturedProducts size={8} />

          {/* Xem thêm -> dẫn tới trang hiển thị tất cả sản phẩm */}
          <div className="mt-6 text-center">
            <Link
              to="/category/all"
              className="inline-block rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800"
            >
              Xem thêm →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
