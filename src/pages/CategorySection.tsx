import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useCategoryImage } from '../hooks/useCategoryImage';
import { useProduct } from '../hooks/useProduct';
import ProductCard from './ProductCard';
import type { Product } from '../utils/types';

export const CategorySection: React.FC = () => {
  const { categoryImages, isLoadingCategoryImages } = useCategoryImage();
  const { products, isLoadingProducts } = useProduct({ isAllRecord: true, isPublished: true });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (categoryImages && categoryImages.length > 0 && !selectedId) {
      setSelectedId(categoryImages[0]._id);
    }
  }, [categoryImages]);

  const selectedCategory = categoryImages?.find((item: any) => item._id === selectedId);
  const matchedProducts = selectedCategory && products?.length ? products.filter((p: Product) => {
    const pCat = (typeof p.categoryname === 'object' ? p.categoryname?.categoryname : p.categoryname)?.toLowerCase();
    const isCatMatch = pCat === selectedCategory.categoryName?.toLowerCase();
    return selectedCategory.subCategoryName ? isCatMatch && p.subCategory?.toLowerCase() === selectedCategory.subCategoryName.toLowerCase() : isCatMatch;
  }) : [];

  return (
    <section className="py-8 bg-[var(--color-bg-light)]">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-3">
          <div className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--color-text-dark)]">Shop By Category</h2>
            <p className="text-xs text-[var(--color-muted)] font-medium">Explore our curated collections</p>
          </div>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 sm:gap-8 w-max mx-auto py-2 p-0.5">
            {isLoadingCategoryImages ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[var(--color-card-bg)] animate-pulse" />) : 
              categoryImages?.map((item: any) => (
                <button 
                  key={item._id} 
                  onClick={() => setSelectedId(prev => (prev === item._id ? null : item._id))} 
                  className="flex flex-col items-center group shrink-0 cursor-pointer"
                >
                  <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden p-[1.5px] border transition ${selectedId === item._id ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/50' : 'border-transparent'}`}>
                    <img src={item.imageUrl} alt={`${item.subCategoryName || item.categoryName} category`} aria-hidden="true" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-300" />
                  </div>
                  <span className={`text-xs font-medium md:text-sm mt-2  ${selectedId === item._id ? 'text-[var(--color-success)] font-bold' : 'text-[var(--color-text-dark)]'}`}>
                    {item.subCategoryName || item.categoryName}
                  </span>
                </button>
              ))}
          </div>
        </div>
        {selectedCategory && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b border-[var(--color-border)]/60 pb-2">
              <h3 className="text-sm font-bold uppercase text-[var(--color-primary)]">
                 {selectedCategory.subCategoryName}
              </h3>
              <NavLink 
                to={`/shop?category=${encodeURIComponent(selectedCategory.categoryName)}${selectedCategory.subCategoryName ? `&subCategory=${encodeURIComponent(selectedCategory.subCategoryName)}` : ''}`} 
                className="text-xs font-bold text-white bg-black px-3 py-1 rounded-md"
              >
                View All&nbsp;&nbsp;<span className="text-[var(--color-accent)]">({matchedProducts.length})</span> →
              </NavLink>
            </div>
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-[var(--color-card-bg)] rounded-xl" />)}
              </div>
            ) : matchedProducts.length > 0 ? (
              <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
                {matchedProducts.slice(0, 4).map((prod: Product) => (
                  <div key={prod._id} className="w-[165px] sm:w-auto shrink-0">
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted)] py-4 text-center">No products found in this category.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;