import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useCategoryImage } from '../hooks/useCategoryImage';
import { useProduct } from '../hooks/useProduct';
import ProductCard from './ProductCard';

export const CategoryGridSection: React.FC = () => {
  const { categoryImages, isLoadingCategoryImages } = useCategoryImage();
  const { products, isLoadingProducts } = useProduct({ isAllRecord: true, isPublished: true });

  if (isLoadingCategoryImages || isLoadingProducts) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" /></div>;
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto my-8 px-4 md:px-8 space-y-12">
      {categoryImages?.map((cat: any) => {
        const matched = products?.filter((p: any) => {
          const pCat = (p.categoryname?.categoryname || p.categoryname || '').toLowerCase();
          return cat.subCategoryName ? pCat === cat.categoryName?.toLowerCase() && p.subCategory?.toLowerCase() === cat.subCategoryName.toLowerCase() : pCat === cat.categoryName?.toLowerCase();
        }) || [];

        if (!matched.length) return null;

        return (
          <section key={cat._id} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[350px] flex flex-col justify-end p-6 bg-zinc-900 group">
                <img src={cat.imageUrl} alt={cat.categoryName} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="relative z-20 text-white space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{cat.subCategoryName || "Collection"}</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold capitalize">{cat.categoryName}</h2>
                  <NavLink to={`/shop?category=${encodeURIComponent(cat.categoryName)}${cat.subCategoryName ? `&subCategory=${encodeURIComponent(cat.subCategoryName)}` : ''}`} className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white text-xs font-semibold hover:bg-white hover:text-black transition">
                    <span>See More ({matched.length})</span><ArrowUpRight size={14} />
                  </NavLink>
                </div>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-2">
                {matched.slice(0, 2).map((prod: any) => <ProductCard key={prod._id} product={prod} />)}
              </div>
            </div>
            {matched.length > 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {matched.slice(2, 6).map((prod: any) => <ProductCard key={prod._id} product={prod} />)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default CategoryGridSection;