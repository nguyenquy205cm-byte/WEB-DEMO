import { brandLogos } from '../assets/brandLogos';
import type { UserProfile } from '../types/user';

const user: UserProfile = {
  id: 'user-001',
  name: 'Lê Minh',
  email: 'leminh@example.com',
  phone: '+84 987 654 321',
  address: '123 Phố Huế, Hà Nội',
  favoriteBrand: 'Nike'
};

function Profile() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
      <section className="rounded-[32px] bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">My profile</p>
            <h1 className="text-3xl font-semibold text-slate-900">Thông tin cá nhân</h1>
          </div>
          <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Họ và tên</h2>
              <p className="mt-2 text-sm text-slate-600">{user.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Email</h2>
              <p className="mt-2 text-sm text-slate-600">{user.email}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Số điện thoại</h2>
              <p className="mt-2 text-sm text-slate-600">{user.phone}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Địa chỉ</h2>
              <p className="mt-2 text-sm text-slate-600">{user.address}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Thương hiệu yêu thích</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <img src={brandLogos[user.favoriteBrand]} alt={user.favoriteBrand} className="h-5 w-auto" />
                {user.favoriteBrand}
              </p>
            </div>
          </div>
        </div>
      </section>
      <aside className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl">
        <h2 className="text-2xl font-semibold">Activity</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">Quản lý đơn hàng, thông tin cá nhân và danh sách yêu thích ở một nơi.</p>
        <div className="mt-8 space-y-4 rounded-3xl bg-slate-900 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Tổng đơn hàng</span>
            <span>12</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Sản phẩm yêu thích</span>
            <span>5</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Voucher hiện có</span>
            <span>2</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Profile;
