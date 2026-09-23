import { Fragment, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingBag, Loader2, ArrowUpDown } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProduct } from "../hooks/useProduct";
import { useCategory } from "../hooks/useCategory";
import { FormSelect, type SelectOption } from "../components/FormSelect";
import { debounce } from "../utils/helper";
import { Banner } from "./Banner";
import type { CategoryItems, Product } from "../utils/types";

const SORT_OPTIONS: SelectOption[] = [
  { label: "Featured", value: "featured" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Alphabetical: A to Z", value: "name-asc" },
  { label: "Alphabetical: Z to A", value: "name-desc" },
  { label: "Highest Discount", value: "discount" },
];

const BATCH_SIZE = 6;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const subCategory = searchParams.get("subcategory") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "featured";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const { categories, isLoadingCategories } = useCategory({ isAllRecord: true });
  const { products, isLoadingProducts } = useProduct({ isAllRecord: true, isPublished: true });

  const categoryList: CategoryItems[] = categories || [];
  const productList: Product[] = products || [];

  const activeCategoryObj = useMemo(
    () => categoryList.find((c) => c.categoryname.toLowerCase() === category.toLowerCase()),
    [categoryList, category]
  );

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    !value || value === "All" ? params.delete(key) : params.set(key, value);
    if (key === "category") params.delete("subcategory");
    setSearchParams(params);
    setVisibleCount(BATCH_SIZE);
  };

  const debouncedSearch = useMemo(
    () => debounce((v: string) => updateParam("search", v), 500),
    [searchParams]
  );

  const filteredProducts = useMemo(() => {
    return productList
      .filter((item) => {
        const itemCat = typeof item.categoryname === "object" ? item.categoryname?.categoryname : item.categoryname;
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (category === "All" || itemCat?.toLowerCase() === category.toLowerCase()) &&
          (!subCategory || item.subCategory?.toLowerCase() === subCategory.toLowerCase())
        );
      })
      .sort((a, b) => {
        const pA = a.salePrice ?? a.regularPrice ?? 0, pB = b.salePrice ?? b.regularPrice ?? 0;
        const dA = parseFloat(a.discount?.replace("%", "") || "0"), dB = parseFloat(b.discount?.replace("%", "") || "0");
        if (sortBy === "new-arrivals") return Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival));
        if (sortBy === "price-low") return pA - pB;
        if (sortBy === "price-high") return pB - pA;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "discount") return dB - dA;
        return 0;
      });
  }, [productList, category, subCategory, searchQuery, sortBy]);

  const displayedProducts = useMemo(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (hasMore) setVisibleCount((prev) => prev + BATCH_SIZE);
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && hasMore && loadMore(),
      { threshold: 0.2 }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  return (
    <Fragment>
      <Banner />
      <main className="min-h-screen bg-[var(--color-bg-light)] py-6 px-4 md:px-8 max-w-[1600px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[var(--color-text-dark)]">Shop All Products</h1>
            <p className="text-xs text-[var(--color-muted)]">Explore latest trends & products</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); debouncedSearch(e.target.value); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => updateParam("category", "All")}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold ${category === "All" ? "bg-[var(--color-accent)] text-white shadow-sm" : "bg-[var(--color-card-bg)] text-[var(--color-text-dark)] border border-[var(--color-border)]"}`}
            >
              All Categories
            </button>
            {isLoadingCategories ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-muted)]" />
            ) : (
              categoryList.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParam("category", cat.categoryname)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${category.toLowerCase() === cat.categoryname.toLowerCase() ? "bg-[var(--color-accent)] text-white shadow-sm" : "bg-[var(--color-card-bg)] text-[var(--color-text-dark)] border border-[var(--color-border)]"}`}
                >
                  {cat.categoryname}
                </button>
              ))
            )}
          </div>
          {Boolean(activeCategoryObj?.subCategories?.length) && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-bold uppercase text-[var(--color-muted)] mr-1 shrink-0">Subcategories:</span>
              {activeCategoryObj?.subCategories?.map((sub, idx) => {
                const name = typeof sub === "string" ? sub : sub.subCategoryName || sub.name || "";
                const isSelected = subCategory.toLowerCase() === name.toLowerCase();
                return (
                  <button
                    key={idx}
                    onClick={() => updateParam("subcategory", isSelected ? "" : name)}
                    className={`shrink-0 px-3 py-1 rounded-lg text-[11px] font-medium ${isSelected ? "bg-[var(--color-text-dark)] text-white" : "bg-[var(--color-bg-light)] text-[var(--color-muted)] border border-[var(--color-border)]"}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between bg-[var(--color-card-bg)] px-2 py-2 rounded-2xl border border-[var(--color-border)] text-xs">
            <span>Showing <strong className="text-[var(--color-text-dark)]">{displayedProducts.length}</strong> of <strong className="text-[var(--color-text-dark)]">{filteredProducts.length}</strong> items</span>
            <div className="w-48 sm:w-56">
              <FormSelect
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(e) => updateParam("sort", e.target.value)}
                leftIcon={<ArrowUpDown size={14} />}
                containerClassName="!mb-0"
                className="!py-1.5 !text-xs !rounded-xl"
              />
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="flex justify-center py-24 bg-[var(--color-card-bg)] rounded-3xl border border-[var(--color-border)]">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
            </div>
          ) : !filteredProducts.length ? (
            <div className="text-center py-16 bg-[var(--color-card-bg)] rounded-3xl border border-dashed border-[var(--color-border)]">
              <ShoppingBag className="w-8 h-8 mx-auto text-[var(--color-muted)] mb-2" />
              <p className="text-xs font-bold uppercase text-[var(--color-text-dark)]">No Products Found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {displayedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8 items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent)]" />
                  <span className="text-xs font-semibold text-[var(--color-muted)]">Loading more products...</span>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </Fragment>
  );
};

export default ShopPage;