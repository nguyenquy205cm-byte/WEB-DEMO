import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-12 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-orange-500">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">Trang không tìm thấy</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">Có vẻ bạn đã đi lạc. Hãy quay lại trang chính hoặc xem sản phẩm.</p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link to="/" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Về trang chủ</Link>
        <Link to="/products" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:text-orange-500">Xem sản phẩm</Link>
      </div>
    </div>
  );
}

export default NotFound;
