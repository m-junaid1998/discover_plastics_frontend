import { Link } from "react-router-dom";
import { Loader2, ArrowRight, Sparkles, Star } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useGetQuery } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { Skeleton } from "../components/Skeleton";
import ProductCard from "./ProductCard";
 const TopRated =()=> {
  const { mediaList, isLoadingMedia } = useMedia({ key: "TopRated" });
  const bannerItem = mediaList?.[0];

  const { data: productsData, isLoading: isLoadingProducts } = useGetQuery({
    endpoint: endpoints.productRoutes.getTopRated,
    params: { limit: 12 },
  });

  const topRatedProducts = productsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans text-[var(--color-text-dark)]">
      {isLoadingMedia ? (
        <div className="mb-12">
          <Skeleton variant="rounded" className="w-full aspect-[21/7] !rounded-3xl" />
        </div>
      ) : bannerItem ? (
        <div className="relative w-full rounded-3xl overflow-hidden bg-[var(--color-card-bg)] border border-[var(--color-border)] mb-12 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-64 sm:h-72 md:h-80 lg:h-96 w-full relative overflow-hidden bg-white/40 flex items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
              <Link to="/shop" className="block w-full h-full relative group">
                <img
                  src={bannerItem.mediaUrl}
                  alt={bannerItem.title || "Top Rated Banner"}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </Link>
            </div>
            <div className="md:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col items-start justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/30 border border-[var(--color-accent)] mb-3">
                <Sparkles size={13} className="text-[var(--color-accent-text)]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-accent-text)]">
                  Customer Favorites
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-dark)] leading-tight mb-3">
              Highest Rated & Top Reviewed Products
              </h1>

              <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed mb-6 max-w-xl">
                {bannerItem.description ||
                  "Explore our highest-rated items according to real reviews and verified feedback. Highly appreciated for exceptional quality, design, and reliable daily use."}
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <span>Explore Top Products</span>
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        </div>
      ) : null}

      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0 border border-[var(--color-accent)]/30">
              <Star size={20} className="text-[var(--color-accent-text)] fill-[var(--color-accent-text)]/20" />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase text-[var(--color-text-dark)] leading-tight">
                Top Rated Products
              </h2>
            </div>
          </div>

          <span className="text-xs  whitespace-nowrap font-bold px-3.5 py-1.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-badge)]">
            {topRatedProducts.length} Products
          </span>
        </div>

        {isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mb-3" />
            <span className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">
              Loading Products...
            </span>
          </div>
        ) : topRatedProducts.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border)]">
            <p className="text-sm font-bold text-[var(--color-text-dark)]">
              No Top Rated Products Available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {topRatedProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopRated 