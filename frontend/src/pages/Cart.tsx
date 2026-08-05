import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

function Cart() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Your cart</p>
            <h1 className="text-3xl font-semibold text-slate-900">Giỏ hàng của bạn</h1>
          </div>
          <button onClick={clearCart} className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
            Xóa giỏ hàng
          </button>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Giỏ hàng trống</h2>
          <p className="mt-3 text-sm text-slate-600">Thêm sản phẩm vào giỏ để bắt đầu mua sắm.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            Tiếp tục mua sắm
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
          <div className="space-y-4">
            {items.map(item => (
              <article key={item.product.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.product.image} alt={item.product.name} className="h-28 w-28 rounded-3xl object-cover" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.product.brand}</p>
                      <p className="mt-2 text-sm text-slate-600">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 text-sm text-slate-700 sm:items-end">
                    <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="rounded-full border border-slate-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="rounded-[32px] bg-slate-950 p-6 text-white shadow-xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Tổng đơn hàng</h2>
              <p className="text-sm text-slate-300">Thanh toán đơn giản và an toàn, giao hàng nhanh chóng.</p>
              <div className="rounded-3xl bg-slate-900 p-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Tổng</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <button className="w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-orange-600">
                Tiến hành thanh toán
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
