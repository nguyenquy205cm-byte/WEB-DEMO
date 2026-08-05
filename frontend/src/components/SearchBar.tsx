import { useState, type ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';
import type { Product } from '../types/product';

interface SearchBarProps {
  products: Product[];
}

function SearchBar({ products }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-xl">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Tìm kiếm giày, thương hiệu hoặc phong cách"
          className="w-full rounded-full border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>
      <div className="hidden w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:block">
        <p className="text-sm font-medium text-slate-600">Kết quả nổi bật</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-700">
          {filtered.slice(0, 4).map(product => (
            <div key={product.id} className="rounded-xl bg-slate-50 px-3 py-2">
              {product.brand} · {product.name}
            </div>
          ))}
          {filtered.length === 0 && <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-500">Không có sản phẩm khớp.</div>}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
