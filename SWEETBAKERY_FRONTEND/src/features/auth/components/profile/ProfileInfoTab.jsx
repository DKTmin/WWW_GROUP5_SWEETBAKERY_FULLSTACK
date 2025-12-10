// features/auth/components/profile/ProfileInfoTab.jsx
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PencilSquareIcon } from "../../pages/icon";

export default function ProfileInfoTab({ user, onEdit }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
        <h3 className="text-lg font-bold text-stone-800">Thông tin tài khoản</h3>
        <p className="text-sm text-stone-500">Thông tin cá nhân của bạn</p>
      </div>

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-4">
            <label className="text-xs font-semibold text-stone-400">Họ và tên</label>
            <p className="text-base font-medium text-stone-800">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <label className="text-xs font-semibold text-stone-400">Tên đăng nhập</label>
            <p className="text-base font-medium text-stone-800">@{user.username}</p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-400">
              <EnvelopeIcon className="h-4 w-4" /> Email
            </label>
            <p className="text-base font-medium text-stone-800">{user.email}</p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-400">
              <PhoneIcon className="h-4 w-4" /> Số điện thoại
            </label>
            <p className="text-base font-medium">{user.phoneNumber || "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4 md:col-span-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-400">
              <MapPinIcon className="h-4 w-4" /> Địa chỉ
            </label>
            <p className="text-base font-medium">{user.address || "Chưa cập nhật"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-800"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
