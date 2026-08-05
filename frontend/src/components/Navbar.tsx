import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-700 md:justify-start">
      <Link to="/" className="transition hover:text-orange-500">Home</Link>
      <Link to="/products" className="transition hover:text-orange-500">Products</Link>
      <Link to="/cart" className="transition hover:text-orange-500">Cart</Link>
      <Link to="/profile" className="transition hover:text-orange-500">Profile</Link>
    </nav>
  );
}

export default Navbar;
