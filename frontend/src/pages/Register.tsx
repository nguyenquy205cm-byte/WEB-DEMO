import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Create account</p>
        <h1 className="text-3xl font-semibold text-slate-900">Đăng ký tài khoản mới</h1>
        <p className="max-w-xl text-sm text-slate-600">Tạo tài khoản để nhận thông báo ưu đãi và theo dõi đơn hàng.</p>
      </div>
      <form className="mt-10 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên</label>
            <input type="text" placeholder="Nguyễn Văn A" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
            <input type="tel" placeholder="0123 456 789" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input type="email" placeholder="email@example.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
          <input type="password" placeholder="••••••••" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500" />
        </div>
        <button type="submit" className="w-full rounded-full bg-orange-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
          Đăng ký
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-orange-500 transition hover:text-orange-400">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default Register;
