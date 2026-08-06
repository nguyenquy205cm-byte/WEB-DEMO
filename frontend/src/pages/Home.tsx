import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../services/products';

function Home() {
  const featured = products.slice(0, 8);

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-sm uppercase tracking-[0.32em] text-orange-300">
              Premium sportswear
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Tạo nên phong cách giày thể thao đẳng cấp.
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Mua giày Nike, Adidas, Puma, Converse, New Balance với thiết kế hiện đại và trải nghiệm mua sắm mượt mà.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#featured" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
                Khám phá ngay
              </a>
              <Link to="/products" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-orange-500 hover:text-orange-500">
                Xem bộ sưu tập
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] bg-slate-900 p-6 shadow-xl sm:p-10">
            <div className="space-y-4">
              <div className="rounded-[32px] bg-slate-950 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Limited collection</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Nike Air Zoom Pegasus 40</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Đệm Zoom Air, thiết kế thoáng khí và cảm giác nhẹ nhàng khi di chuyển.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-900 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Fit tối ưu</p>
                  <p className="mt-2">Phù hợp cho cả chạy bộ lẫn phong cách đời thường.</p>
                </div>
                <div className="rounded-[28px] bg-slate-900 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Thiết kế</p>
                  <p className="mt-2">Thời trang hiện đại với tông màu đen cam cá tính.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Featured sneakers</p>
            <h2 className="text-3xl font-semibold text-slate-900">Bộ sưu tập nổi bật</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            Lựa chọn hàng đầu cho phong cách thể thao, đường phố và lifestyle.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-slate-900 px-6 py-10 text-white shadow-2xl sm:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_0.45fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Why choose us</p>
            <h2 className="text-3xl font-semibold">Sự kết hợp giữa hiệu suất và phong cách.</h2>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              ShoeHub mang đến giày thể thao cao cấp, thiết kế thẩm mỹ và trải nghiệm đặt hàng nhanh chóng cho mọi nhu cầu.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-5">
                <h3 className="font-semibold">Giao hàng nhanh</h3>
                <p className="mt-2 text-sm text-slate-400">Đặt hàng trong ngày, nhận sản phẩm nhanh chóng.</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-5">
                <h3 className="font-semibold">Hỗ trợ 24/7</h3>
                <p className="mt-2 text-sm text-slate-400">Tư vấn giày, đổi trả và chăm sóc khách hàng tận tâm.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[32px] bg-slate-950 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Top brands</p>
            <div className="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-4">Nike</div>
              <div className="rounded-3xl bg-slate-900 p-4">Adidas</div>
              <div className="rounded-3xl bg-slate-900 p-4">Puma</div>
              <div className="rounded-3xl bg-slate-900 p-4">Converse</div>
              <div className="rounded-3xl bg-slate-900 p-4">New Balance</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
