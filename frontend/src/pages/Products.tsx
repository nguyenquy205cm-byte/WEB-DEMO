import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../services/products';
import type { Product } from '../types/product';

const categories = ['All', 'Running', 'Lifestyle', 'Training', 'Casual', 'Basketball'];
const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Converse', 'New Balance'];

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((item: Product) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || item.brand.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedBrand, searchText]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-orange-300">Product collection</p>
            <h1 className="mt-4 text-3xl font-semibold">Khám phá giày thể thao theo thương hiệu và phong cách.</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-full bg-slate-900 px-4 py-3 text-sm text-slate-300">Tổng sản phẩm: {filteredProducts.length}</div>
            <div className="rounded-full bg-slate-900 px-4 py-3 text-sm text-slate-300">Thương hiệu nổi bật</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_0.2fr]">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500">
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Brand</label>
                <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500">
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Search</label>
                <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Tìm giày..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h2 className="text-xl font-semibold text-slate-900">Không tìm thấy sản phẩm</h2>
              <p className="mt-2 text-sm text-slate-600">Thử đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
            </div>
          )}
        </div>
        <aside className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Hướng dẫn chọn giày</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Lựa chọn giày chạy bộ nếu bạn cần tốc độ, lifestyle để phối đồ hàng ngày, hoặc casual cho phong cách thư giãn.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Tư vấn nhanh</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li>- Nike: Hiệu suất và phong cách thể thao.</li>
              <li>- Adidas: êm, thời trang và năng động.</li>
              <li>- Puma: cá tính, phù hợp streetwear.</li>
              <li>- Converse: cổ điển, dễ phối đồ.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Products;
