import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import SearchBar from './SearchBar';
import { products } from '../services/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const { user, logout } = useAuth();
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold uppercase tracking-[0.25em] text-brand">
          <span className="text-orange-500">Shoe</span>Hub
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link to="/" className="transition hover:text-orange-500">Home</Link>
            <Link to="/products" className="transition hover:text-orange-500">Products</Link>
            <Link to="/cart" className="transition hover:text-orange-500">Cart</Link>
            <Link to="/profile" className="transition hover:text-orange-500">Profile</Link>
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
                {user.name}
              </Link>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-400 hover:text-red-500">
                <FiLogOut /> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                Register
              </Link>
            </>
          )}
          <Link to="/cart" className="relative inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
            <FiShoppingBag className="mr-2" />
            {cartCount}
          </Link>
        </div>

        <button className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-700 md:hidden" onClick={() => setOpen(value => !value)}>
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
            <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="rounded-full border border-slate-200 px-4 py-2 text-center text-slate-700">
                Đăng xuất ({user.name})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-center text-slate-700">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-full bg-orange-500 px-4 py-2 text-center text-white">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:px-6">
        <SearchBar products={products} />
      </div>
    </header>
  );
}

export default Header;
