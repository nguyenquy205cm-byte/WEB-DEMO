import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>${product.price.toFixed(2)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{product.rating.toFixed(1)} ★</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
