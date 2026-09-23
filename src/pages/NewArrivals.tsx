import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import ProductCard from './ProductCard';
import { Skeleton } from '../components/Skeleton';
import type { Product } from '../utils/types';

export const NewArrivals: React.FC = () => {
  const { products = [], isLoadingProducts } = useProduct({ isNewArrival: true, isAllRecord: true, sortOn: 'latest', isPublished: true });

  return (
    <div className="bg-[var(--color-bg-light)] py-6 px-4 sm:px-8">
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div>
          <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-[var(--color-text-dark)] leading-tight">New Arrivals</h1>
          <p className="text-xs text-[var(--color-muted)] font-medium mt-0.5">Discover this week's fresh arrivals</p>
          </div>
        </div>
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-2 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" className="aspect-[4/5] h-full min-h-[320px]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {products.map((product: Product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
         <div className="text-center py-10 bg-[var(--color-card-bg)]/50 rounded-2xl border border-dashed border-[var(--color-border)] max-w-md mx-auto p-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[var(--color-text-dark)] mb-1">No New Arrivals</h2>
            <p className="text-xs text-[var(--color-muted)]">We haven't added any new products in the last 7 days. Check back soon for fresh stock!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;