import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="space-y-4">
          <div className="text-2xl font-semibold text-white">ShoeHub</div>
          <p className="max-w-md text-sm leading-6">
            Shop giày thể thao hiện đại với trải nghiệm mua sắm nhanh chóng, thanh toán an toàn và giao hàng toàn quốc.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="transition hover:text-white">Products</Link></li>
              <li><Link to="/cart" className="transition hover:text-white">Cart</Link></li>
              <li><Link to="/profile" className="transition hover:text-white">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="transition hover:text-white">Login</Link></li>
              <li><Link to="/register" className="transition hover:text-white">Register</Link></li>
              <li><a href="#" className="transition hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Liên hệ</h3>
            <p className="text-sm leading-6 text-slate-400">support@shoehub.vn</p>
            <p className="text-sm leading-6 text-slate-400">+84 123 456 789</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 bg-slate-900 py-4 text-center text-sm text-slate-500">
        © 2026 ShoeHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
