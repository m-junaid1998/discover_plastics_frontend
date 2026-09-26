import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "../utils/types";

interface RelatedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, isLoading }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full my-12 border-t border-[var(--color-border)] pt-8">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-text-dark)] mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full aspect-[4/5] bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full my-12 border-t border-[var(--color-border)] pt-8 relative group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-text-dark)]">
            You May Also Like
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Explore similar products from our catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-white hover:bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-text-dark)] transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Previous Products"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-white hover:bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-text-dark)] transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Next Products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {products.map((item) => (
          <div key={item._id} className="w-[220px] sm:w-[260px] md:w-[280px] shrink-0 flex">
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  );
};