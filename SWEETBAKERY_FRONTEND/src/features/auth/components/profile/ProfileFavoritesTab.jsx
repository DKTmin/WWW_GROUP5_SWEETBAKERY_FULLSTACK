// features/auth/components/profile/ProfileFavoritesTab.jsx
import { HeartIcon } from "../../pages/icon";
import { Link } from "react-router-dom";

export default function ProfileFavoritesTab() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
        <h3 className="text-lg font-bold text-stone-800">Sản phẩm yêu thích</h3>
        <p className="text-sm text-stone-500">Danh sách sản phẩm đã lưu</p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <HeartIcon className="mb-4 h-16 w-16 text-stone-300" />
        <h4 className="text-lg font-semibold text-stone-700">Danh sách trống</h4>
        <p className="mt-1 text-sm text-stone-500">Bạn chưa thêm sản phẩm nào.</p>

        <Link
          to="/category/all"
          className="mt-4 rounded-full bg-amber-700 px-6 py-2.5 text-white hover:bg-amber-800"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
}
