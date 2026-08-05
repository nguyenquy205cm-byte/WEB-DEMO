import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../services/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import ProductCard from '../components/ProductCard';

function ProductDetail() {
  const { id } = useParams();
  const product = useMemo(() => products.find(item => item.id === id), [id]);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sản phẩm không tồn tại</h1>
        <p className="mt-3 text-slate-600">Hãy quay lại trang sản phẩm và chọn đôi giày khác.</p>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
          Quay lại Products
        </Link>
      </div>
    );
  }

  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr]">
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-[32px] bg-slate-100">
            <img src={product.image} alt={product.name} className="w-full object-cover" />
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-500">
              <span>{product.brand}</span>
              <span>{product.category}</span>
            </div>
            <h1 className="text-4xl font-semibold text-slate-900">{product.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{product.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</span>
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">{product.rating} ★</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.features.map(feature => (
                <div key={feature} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-[32px] bg-black px-6 py-8 text-white shadow-xl">
            <h2 className="text-2xl font-semibold">Mua ngay</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Thêm vào giỏ hàng để thanh toán và nhận ưu đãi giao hàng.</p>
            <button onClick={() => addToCart(product)} className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
              Thêm vào giỏ
            </button>
            <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-sm text-slate-300">
              <p>Available colors</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <span key={color} className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase text-slate-300">{color}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Thông tin vận chuyển</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Giao hàng nhanh trong 2-4 ngày và chính sách đổi trả miễn phí trong 15 ngày.</p>
          </div>
        </aside>
      </section>

      <section className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Related</p>
            <h2 className="text-2xl font-semibold text-slate-900">Sản phẩm cùng loại</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {related.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
