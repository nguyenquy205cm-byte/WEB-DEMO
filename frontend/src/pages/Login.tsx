import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = login(email.trim(), password);
    if (err) {
      setError(err);
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Welcome back</p>
        <h1 className="text-3xl font-semibold text-slate-900">Đăng nhập tài khoản</h1>
        <p className="max-w-xl text-sm text-slate-600">Đăng nhập để quản lý đơn hàng và thông tin cá nhân.</p>
      </div>
      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500"
          />
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-orange-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
          Đăng nhập
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-semibold text-orange-500 transition hover:text-orange-400">Đăng ký ngay</Link>
      </p>
    </div>
  );
}

export default Login;
