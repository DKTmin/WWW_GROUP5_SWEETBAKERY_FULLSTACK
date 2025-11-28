export default function Footer() {
  return (
    <footer className="mt-10 bg-stone-950 text-stone-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Sweet Bakery</h3>
          <p className="mt-2 max-w-xs text-sm text-stone-400">
            Tiệm bánh mang phong cách Pháp với nguyên liệu chọn lọc, mang đến
            những chiếc bánh tươi ngon cho mọi khoảnh khắc ngọt ngào.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Liên hệ</h4>
          <p className="mt-2 text-sm text-stone-400">
            Địa chỉ: 123 Đường Ngọt Ngào, Quận Gò Vấp, TP. HCM
          </p>
          <p className="text-sm text-stone-400">Hotline: 0123 456 789</p>
          <p className="text-sm text-stone-400">
            Email: sweetbakery@gmail.com
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Giờ mở cửa</h4>
          <p className="mt-2 text-sm text-stone-400">
            Thứ 2 – Chủ nhật: 7:00 – 22:00
          </p>
          <p className="text-sm text-stone-400">Giao hàng qua ứng dụng Now, Grab</p>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <p className="text-[11px] text-stone-500">
            © {new Date().getFullYear()} Sweet Bakery. All rights reserved.
          </p>
          <p className="text-[11px] text-stone-500">
            Thiết kế bởi Sweet Bakery Team
          </p>
        </div>
      </div>
    </footer>
  );
}
