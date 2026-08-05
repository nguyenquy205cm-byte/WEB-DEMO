import { Link } from 'react-router-dom';

function Banner() {
  return (
    <section className="grid gap-6 rounded-[32px] bg-black px-6 py-12 text-white sm:grid-cols-[1.2fr_0.8fr] lg:px-12">
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-sm uppercase tracking-[0.3em] text-orange-300">
          New Arrival
        </span>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Đổi mới phong cách với giày thể thao hiện đại.
        </h1>
        <p className="max-w-xl text-sm text-slate-300 sm:text-base">
          Khám phá bộ sưu tập giày chạy bộ, lifestyle và streetwear từ Nike, Adidas, Puma, Converse và New Balance.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
            Mua ngay
          </Link>
          <Link to="/products" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-orange-500 hover:text-orange-500">
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="grid gap-4 rounded-[28px] bg-slate-950 p-6 sm:p-8">
        <div className="rounded-[28px] bg-slate-800 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Sản phẩm nổi bật</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">Nike Air Zoom Pegasus 40</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Đệm Zoom Air, thiết kế thoáng khí, phù hợp chạy đường dài và mọi hoạt động hằng ngày.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
          <div className="rounded-3xl bg-black/70 p-4">
            <p className="font-semibold text-white">Khả năng phản hồi</p>
            <p className="mt-2 text-slate-400">Phản hồi mềm mại và đàn hồi tối ưu.</p>
          </div>
          <div className="rounded-3xl bg-black/70 p-4">
            <p className="font-semibold text-white">Phong cách</p>
            <p className="mt-2 text-slate-400">Đẳng cấp thể thao và linh hoạt cho mọi outfit.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
