import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { NavLink, useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { Heart, Phone, MapPin, AlignJustify, X, User, ChevronDown } from "lucide-react";
import { ShoppingBagIcon } from "../utils/socialicons";
import { CartDrawer } from "./CartDrawer";
import { useCategory } from "../hooks/useCategory";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishList";
import type { CategoryItem } from "../utils/types";

// Helper for dynamic link classes
const getLinkClass = (isActive: boolean, isMobile = false) =>
  `${isMobile ? "py-1" : "py-5 shrink-0 underline-offset-8 decoration-2"} transition-colors whitespace-nowrap ${
    isActive
      ? "text-[var(--color-accent-text)] font-bold underline decoration-[var(--color-accent-text)]"
      : "text-[var(--color-text-dark)] hover:text-[var(--color-accent-text)]"
  }`;

// Mega Menu Component - Self-contained & memoized
const MegaMenu = memo(({ category, currentSub }: { category: CategoryItem; currentSub: string | null }) => {
  const subs = category.subCategories;
  if (!Array.isArray(subs) || !subs.length) return null;

  return (
    <div className="absolute top-full left-0 right-0 w-full bg-[var(--color-primary)] border-t border-[var(--color-primary-hover)] shadow-2xl z-50 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none group-hover:pointer-events-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 min-h-[200px] flex flex-col justify-center">
        <h4 className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest mb-6">{category.categoryname}</h4>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {subs.map((sub, idx) => (
           <Link
            key={`${category._id}-${idx}`}
            to={`/shop?category=${encodeURIComponent(category.categoryname)}&subcategory=${encodeURIComponent(sub)}`}
            className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] hover:underline hover:font-bold underline-offset-4 py-1 shrink-0 ${
              currentSub === sub 
                ? "text-[var(--color-accent)] font-bold underline underline-offset-4" 
                : "text-white/90 hover:text-[var(--color-accent)]"
            }`}
          >
            {sub}
          </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeMobileCat, setActiveMobileCat] = useState<string | null>(null);

  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subcategory");

  const { totalItemsCount = 0 } = useCart() || {};
  const { wishlistProducts = [] } = useWishlist() || {};
  const categoryContext = useCategory({ isAllRecord: true, sortDirection: "asc" });
  const categories: CategoryItem[] = useMemo(() => categoryContext?.categories || [], [categoryContext?.categories]);

  const closeDrawer = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reusable Action Badge Button
  const ActionBtn = ({ icon: Icon, badge, onClick, label }: { icon: any; badge?: number; onClick: () => void; label: string }) => (
    <button type="button" onClick={onClick} aria-label={label} className="relative flex h-10 w-10 items-center justify-center text-[var(--color-text-dark)]">
      <Icon size={22} />
      {!!badge && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[var(--color-bg-light)] px-4 lg:px-8 h-[68px] flex items-center shadow-sm border-b border-[var(--color-border)] w-full relative">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3 h-full">
          <button type="button" onClick={() => setIsOpen(true)} aria-label="Open Mobile Menu" className="lg:hidden w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md shrink-0">
            <AlignJustify size={22} />
          </button>

          <NavLink to="/" className="shrink-0">
            <img src="/logo.png" alt="Logo" className="w-auto h-10 md:h-12 object-contain" />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center space-x-5 xl:space-x-7 text-xs xl:text-sm font-semibold h-full flex-1 mx-3">
            <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink>
            {categories.map((cat) => (
              <div key={cat._id} className="group h-full flex items-center shrink-0 static">
                <Link to={`/shop?category=${encodeURIComponent(cat.categoryname)}`} className={getLinkClass(location.pathname === "/shop" && currentCategory === cat.categoryname)}>
                  {cat.categoryname}
                </Link>
                <MegaMenu category={cat} currentSub={currentSubCategory} />
              </div>
            ))}
            <NavLink to="/track-order" className={({ isActive }) => getLinkClass(isActive)}>Track Order</NavLink>
            <NavLink to="/contact" className={({ isActive }) => getLinkClass(isActive)}>Contact</NavLink>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-1 shrink-0 bg-[var(--color-bg-light)] pl-2 z-10">
            <ActionBtn icon={ShoppingBagIcon} badge={totalItemsCount} onClick={() => setIsCartOpen(true)} label="Open Cart" />
            <ActionBtn icon={Heart} badge={wishlistProducts.length} onClick={() => navigate("/wishlist")} label="Wishlist" />
            <ActionBtn icon={User} onClick={() => navigate("/myprofile")} label="User Profile" />
          </div>
        </div>
      </nav>

   {/* Mobile Drawer */}
{isOpen && <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={closeDrawer} />}

<aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--color-bg-light)] z-50 transition-transform duration-300 lg:hidden flex flex-col justify-between shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
  <div className="flex flex-col h-full min-h-0">
    {/* Drawer Header */}
    <div className="bg-[var(--color-primary)] text-white px-5 py-4 flex items-center justify-between shrink-0">
      <img src="/logo.png" alt="Logo" className="w-auto h-10 object-contain brightness-0 invert" />
      <button type="button" onClick={closeDrawer} aria-label="Close Menu">
        <X size={22} />
      </button>
    </div>

    {/* Menu Items List */}
    <div className="px-6 py-6 flex-1 overflow-y-auto flex flex-col space-y-3 text-sm font-bold text-[var(--color-text-dark)]">
      {/* Home Link */}
      <div className="py-1">
        <NavLink to="/" onClick={closeDrawer} className={({ isActive }) => getLinkClass(isActive, true)}>
          Home
        </NavLink>
      </div>

      {/* Dynamic Categories */}
      {categories.map((cat) => {
        const hasSubs = Array.isArray(cat.subCategories) && cat.subCategories.length > 0;
        const isCatActive = location.pathname === "/shop" && currentCategory === cat.categoryname;
        
        return (
          <div key={cat._id} className="py-1">
            <div className="flex items-center justify-between">
              <Link 
                to={`/shop?category=${encodeURIComponent(cat.categoryname)}`} 
                onClick={closeDrawer} 
                className={getLinkClass(isCatActive, true)}
              >
                {cat.categoryname}
              </Link>
              {hasSubs && (
                <button 
                  type="button" 
                  aria-label="Expand Subcategories" 
                  onClick={() => setActiveMobileCat((p) => (p === cat._id ? null : cat._id))}
                  className="p-1 text-[var(--color-text-dark)]"
                >
                  <ChevronDown size={18} className={`transition-transform duration-200 ${activeMobileCat === cat._id ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            {/* Subcategories Dropdown */}
            {hasSubs && activeMobileCat === cat._id && (
              <div className="mt-2 pl-3 border-l-2 border-[var(--color-accent-text)] flex flex-col space-y-2">
                {cat.subCategories.map((sub, idx) => (
                  <Link 
                    key={`${cat._id}-${idx}`} 
                    to={`/shop?category=${encodeURIComponent(cat.categoryname)}&subcategory=${encodeURIComponent(sub)}`} 
                    onClick={closeDrawer} 
                    className={`text-xs font-semibold py-1 block ${isCatActive && currentSubCategory === sub ? "text-[var(--color-accent-text)] font-bold" : "text-gray-500 hover:text-[var(--color-accent-text)]"}`}
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Track Order Link */}
      <div className="py-1">
        <NavLink to="/track-order" onClick={closeDrawer} className={({ isActive }) => getLinkClass(isActive, true)}>
          Track Order
        </NavLink>
      </div>

      {/* Contact Link */}
      <div className="py-1">
        <NavLink to="/contact" onClick={closeDrawer} className={({ isActive }) => getLinkClass(isActive, true)}>
          Contact
        </NavLink>
      </div>
    </div>
  </div>

  {/* Drawer Footer */}
  <div className="px-6 pb-6 pt-4 space-y-4 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-bg-light)]">
    <a href="tel:+923238224745" className="w-full bg-[var(--color-primary)] text-white py-3 rounded-full flex items-center justify-center space-x-2 font-bold text-xs uppercase hover:bg-[var(--color-primary-hover)] transition-colors">
      <Phone size={15} /><span>Call Us Now</span>
    </a>
    <div className="flex items-start space-x-2 text-[11px] text-[var(--color-muted)]">
      <MapPin size={16} className="shrink-0 mt-0.5" />
      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        HOME N’ MORE STUDIO TOWN, KARACHI
      </a>
    </div>
  </div>
</aside>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};