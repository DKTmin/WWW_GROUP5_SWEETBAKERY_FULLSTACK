// features/auth/components/profile/ProfileUserCard.jsx
export default function ProfileUserCard({ user }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-6 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold uppercase">
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-amber-100/80">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}
