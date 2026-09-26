import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, Eye, EyeClosed } from "lucide-react";
import { createSlug } from "../utils/helper";
import { useWishlist } from "../hooks/useWishList";
import { useCart } from "../hooks/useCart";
import { toast } from "../utils/toast";
import type { Product } from "../utils/types";

const getColorValue = (colorStr: string): string => {
  if (!colorStr) return "#e5e7eb";
  const trimmed = colorStr.trim().toLowerCase();
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) return trimmed;

  const colorsMap: Record<string, string> = {
    white: "#ffffff", black: "#000000", red: "#dc2626", blue: "#2563eb",
    green: "#15803d", yellow: "#eab308", brown: "#6b7280", pink: "#fbcfe8",
    purple: "#9333ea", orange: "#ea580c", gray: "#6b7280", grey: "#6b7280",
    gold: "#d97706", silver: "#d1d5db", beige: "#fef3c7", cream: "#fffdd0",
  };
  return colorsMap[trimmed] || trimmed;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();

  const prod = product as any;
  const colors: string[] = prod.colors || [];

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  // even if the user never taps a swatch.
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [previewImages, setPreviewImages] = useState(false);

  const { toggleWishlist, isInWishlist, isWishlistMutationLoading } = useWishlist();
  const { cartItems, addToCart, isCartMutationLoading } = useCart();

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const currentImg = selectedImg || product.images?.[0] || "";
  const productSlug = createSlug(product.name);

  const categoryLabel = typeof product.categoryname === "object"
    ? product.categoryname?.categoryname
    : product.categoryname || "";

  const displayCategory = product.subCategory && product.subCategory !== "None" 
    ? product.subCategory 
    : categoryLabel;

  const dimensions = prod.dimensions;
  const hasDimensions = dimensions && (dimensions.length > 0 || dimensions.width > 0 || dimensions.height > 0);

  const handleNavigate = () => navigate(`/product/${productSlug}`, { state: { product } });

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const actionText = isWishlisted ? "Removed from Wishlist:" : "Added to Wishlist:";
    await toggleWishlist(product._id, { successMessage: `${actionText} ${product.name}` });
  };

  const validateStock = () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return false;
    }
    const currentInCart = cartItems?.find((item: any) => (item.product?._id || item.product) === product._id)?.qty || 0;
    if (currentInCart + 1 > product.stock) {
      toast.error(`Only ${product.stock} ${product.stock === 1 ? "item" : "items"} available in stock.`);
      return false;
    }
    return true;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!validateStock()) return;
    addToCart(
      product._id,
      1,
      false,
      { successMessage: `Added ${product.name} to Cart` },
      selectedColor || colors[0] || null
    );
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!validateStock()) return;
    const chosenColor = selectedColor || colors[0] || null;
    const res = await addToCart(product._id, 1, false, undefined, chosenColor);
    if (res?.success) navigate("/checkout", { state: { directItem: { product, qty: 1, selectedColor: chosenColor } } });
  };

  return (
    <article className="group relative w-full bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-500 hover:shadow-xl flex flex-col">
      {/* Top Overlay Controls */}
      <div className="absolute top-1 inset-x-1.5 z-20 flex justify-between items-center pointer-events-none">
        <div>
          {product.isNewArrival && (
            <span className="bg-[var(--color-accent)] text-[var(--color-accent-text)] text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={isWishlistMutationLoading}
          onClick={handleWishlist}
          className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[var(--color-text-dark)] hover:bg-white hover:scale-110 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Heart size={16} className={isWishlisted ? "fill-[var(--color-danger)] text-[var(--color-danger)]" : "stroke-[1.5]"} />
        </button>
      </div>

      {/* Main Image Banner */}
      <div onClick={handleNavigate} className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--color-card-bg)] cursor-pointer">
        <img src={currentImg} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        
        {product.discount && product.discount !== "0%" && (
          <span className="absolute bottom-1.5 right-1 z-10 bg-red-600 text-white text-[11px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md shadow-xs">
            -{product.discount}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white text-[var(--color-danger)] font-extrabold text-[11px] uppercase px-3 py-1.5 rounded-full tracking-widest shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {previewImages && product.images?.length > 1 && (
          <div className="absolute bottom-2 left-2 z-10 flex gap-1 p-1 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-[var(--color-border)]">
            {product.images.slice(0, 4).map((img, idx) => (
              <button key={idx} type="button" onClick={(e) => { e.stopPropagation(); setSelectedImg(img); }}
                className={`w-6 h-8 rounded overflow-hidden transition-all cursor-pointer ${currentImg === img ? "ring-2 ring-[var(--color-primary)] scale-105" : "opacity-60 hover:opacity-100"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3.5 flex flex-col justify-between flex-grow bg-white">
        <div>
          {displayCategory && (
            <span className="block font-extrabold text-[var(--color-accent-text)] text-[11px] md:text-xs tracking-wider uppercase truncate mb-1">
              {displayCategory}
            </span>
          )}

          <p onClick={handleNavigate} className="text-sm md:text-base font-bold text-[var(--color-text-dark)] leading-snug line-clamp-1 hover:text-[var(--color-accent-text)] cursor-pointer transition-colors mb-2">
            {product.name}
          </p>

     {colors.length > 0 && (
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
      {colors.map((clr, i) => {
        const isSelected = selectedColor === clr;
        return (
          <button
            key={i}
            type="button"
            title={clr}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedColor(clr);
            }}
            className={`p-[2px] rounded-full transition-all cursor-pointer border ${
              isSelected
                ? "border-black scale-110 shadow-xs"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <span
              className="block w-4 h-4 rounded-full border border-black/10"
              style={{ backgroundColor: getColorValue(clr) }}
            />
          </button>
        );
      })}
    </div>
 
)}

          {hasDimensions && (
            <div className="hidden md:flex items-center text-xs text-gray-700 font-semibold mb-2.5 bg-[#fbf6f0] px-2.5 py-1 rounded-lg w-fit border border-amber-100/60">
              <span>
                <strong className="text-gray-900 font-bold mr-0.5">Size:</strong>
                {dimensions?.length || 0}L x {dimensions?.width || 0}W x {dimensions?.height || 0}H cm
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap mb-2">
            <span className="text-base md:text-lg font-black text-[var(--color-text-dark)]">
              Rs. {product.salePrice?.toLocaleString()}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-[var(--color-muted)] line-through">
                Rs. {product.regularPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock & Preview Toggle (Justify Between on all screen sizes) */}
          <div className="flex items-center justify-between gap-2 mb-3 w-full">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isOutOfStock ? "text-[var(--color-danger)] bg-red-50" : "text-[var(--color-success)] bg-emerald-50"}`}>
              Stock: {product.stock}
            </span>
            {product.images?.length > 1 && (
              <button type="button" onClick={() => setPreviewImages(!previewImages)} className="cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-text-dark)] transition-colors p-1">
                {previewImages ? <Eye size={16} /> : <EyeClosed size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 w-full pt-1">
          <button type="button" disabled={isCartMutationLoading} onClick={handleAddToCart}
            className="w-full py-2.5 px-3 bg-[var(--color-card-bg)] hover:bg-[var(--color-border)] text-[var(--color-text-dark)] border border-[var(--color-border)] rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
            <ShoppingBag size={14} />
            <span>Add To Cart</span>
          </button>
          <button type="button" disabled={isCartMutationLoading} onClick={handleBuyNow}
            className="w-full py-2.5 px-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50">
            <span>Buy Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;