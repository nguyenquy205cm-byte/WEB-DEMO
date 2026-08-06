import { Link } from 'react-router-dom';
import { brandLogos } from '../assets/brandLogos';
import type { UserProfile } from '../types/user';
import { useAuth } from '../context/AuthContext';

const fallbackProfile: UserProfile = {
  id: 'user-001',
  name: 'Khách hàng',
  email: 'email@example.com',
  phone: '+84 000 000 000',
  address: '123 Phố Huế, Hà Nội',
  favoriteBrand: 'Nike'
};

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-500">My profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bạn chưa đăng nhập</h1>
        <p className="mt-3 text-sm text-slate-600">Đăng nhập để xem thông tin cá nhân và quản lý đơn hàng.</p>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const profile: UserProfile = { ...fallbackProfile, name: user.name, email: user.email, phone: user.phone || fallbackProfile.phone };

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
              <p className="mt-2 text-sm text-slate-600">{profile.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Email</h2>
              <p className="mt-2 text-sm text-slate-600">{profile.email}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Số điện thoại</h2>
              <p className="mt-2 text-sm text-slate-600">{profile.phone}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Địa chỉ</h2>
              <p className="mt-2 text-sm text-slate-600">{profile.address}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Thương hiệu yêu thích</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <img src={brandLogos[profile.favoriteBrand]} alt={profile.favoriteBrand} className="h-5 w-auto" />
                {profile.favoriteBrand}
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
