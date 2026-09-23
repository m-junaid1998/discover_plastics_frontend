import { useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, Ruler, Star } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { CustomerReviews } from "../components/CustomerReviews";
import { WhatsAppIcon } from "../utils/socialicons";
import { useWishlist } from "../hooks/useWishList";
import { useCart } from "../hooks/useCart";
import { useReview } from "../hooks/useReview";

// Helper function to convert color names / hex codes to CSS valid color strings
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

export default function ProductDetails() {
  useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  if (!product) {
    return (
      <div className="p-20 text-center text-xl font-bold font-serif text-[var(--color-text-dark)]">
        Product Not Found
      </div>
    );
  }

  const {
    _id,
    name,
    categoryname,
    subCategory,
    stock = 0,
    regularPrice = 0,
    salePrice = 0,
    discount,
    images = [],
    description,
    colors = [],
    dimensions,
    ratings: staticRatings = 0,
    numReviews: staticNumReviews = 0,
  } = product as any;

  // Dynamic Reviews Syncing
  const { reviews = [], reviewsCount = 0 } = useReview(_id);

  const dynamicReviewsCount = reviewsCount || staticNumReviews;
  const dynamicAvgRating = reviewsCount > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviewsCount).toFixed(1)
    : Number(staticRatings).toFixed(1);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [qty, setQty] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { toggleWishlist, isInWishlist, isWishlistMutationLoading } = useWishlist();
  const { addToCart, isCartMutationLoading } = useCart();

  const isWishlisted = isInWishlist(_id);
  const isOutOfStock = stock <= 0;
  const categoryLabel =
    typeof categoryname === "object"
      ? categoryname?.categoryname || categoryname?.name
      : categoryname || "";

  const hasDimensions = dimensions && (dimensions.length > 0 || dimensions.width > 0 || dimensions.height > 0);

  const handleSelectImage = (index: number) => {
    setSelectedImgIndex(index);
    if (sliderRef.current) {
      const targetScroll = sliderRef.current.offsetWidth * index;
      sliderRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const newIdx = Math.round(e.currentTarget.scrollLeft / width);
      setSelectedImgIndex(newIdx);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(_id, {
      successMessage: `${isWishlisted ? "Removed from" : "Added to"} Wishlist: ${name}`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock)
      addToCart(_id, qty, false, { successMessage: `Added ${name} to Cart` });
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    const res = await addToCart(_id, qty, false);
    if (res?.success) {
      navigate("/checkout", {
        state: {
          directItem: {
            product: { _id, name, stock, salePrice, regularPrice, images },
            qty,
          },
        },
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (isOutOfStock) return;
    const colorText = selectedColor ? `\n*Selected Color:* ${selectedColor}` : "";
    const message = `*PRODUCT INQUIRY / ORDER*\n\n*Product:* ${name}${colorText}\n*Quantity:* ${qty}\n*Price:* Rs. ${salePrice.toLocaleString()} x ${qty} = Rs. ${(salePrice * qty).toLocaleString()}\n*Product Link:* ${window.location.href}\n\nHi, I want to place an order for this item. Please share further details.`;
    window.open(
      `https://wa.me/923238224745?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-[var(--color-text-dark)]">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Shop", link: "/shop" },
            categoryLabel && { label: categoryLabel, link: "/shop" },
            { label: name },
          ].filter(Boolean)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Side: Images */}
        <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-auto max-h-[480px] shrink-0 no-scrollbar p-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectImage(i)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImgIndex === i
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-105"
                      : "border-[var(--color-border)] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="w-full max-w-[480px] aspect-square bg-[var(--color-card-bg)] rounded-2xl relative overflow-hidden border border-[var(--color-border)] shadow-sm mx-auto sm:mx-0">
            {discount && discount !== "0%" && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md shadow z-10">
                -{discount}
              </span>
            )}

            <button
              type="button"
              disabled={isWishlistMutationLoading}
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[var(--color-text-dark)] hover:bg-white hover:scale-105 shadow transition z-10 disabled:opacity-50 cursor-pointer"
            >
              <Heart
                size={20}
                className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-white text-[var(--color-danger)] font-bold text-xs uppercase px-4 py-2 rounded-full tracking-widest shadow">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Main Image Slider */}
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
              {images.map((img: string, idx: number) => (
                <div key={idx} className="w-full h-full shrink-0 snap-center">
                  <img
                    src={img}
                    alt={`${name}-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {categoryLabel && (
                <span className="text-xs font-extrabold text-[var(--color-accent-text)] bg-[var(--color-card-bg)] px-2.5 py-1 rounded tracking-wide uppercase">
                  {categoryLabel}
                </span>
              )}
              {subCategory && subCategory !== "None" && (
                <span className="text-xs text-[var(--color-muted)] font-semibold tracking-wide uppercase">
                  • {subCategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-dark)] leading-snug mb-2">
              {name}
            </h1>

            {/* Dynamic Ratings & Reviews Count Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                <Star size={13} className="fill-amber-400 text-amber-500" />
                <span className="text-xs font-black text-amber-900">
                  {dynamicAvgRating}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({dynamicReviewsCount} {dynamicReviewsCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          {/* Color Swatches Selection */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
                COLORS:
              </span>
              <div className="flex items-center gap-1.5">
                {colors.map((clr: string, i: number) => {
                  const isSelected = selectedColor === clr;
                  return (
                    <button
                      key={i}
                      type="button"
                      title={clr}
                      onClick={() => setSelectedColor(clr)}
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
            </div>
          )}

          {/* Dimensions Display */}
          {hasDimensions && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold bg-[#fbf6f0] px-2.5 py-1.5 rounded-lg w-fit border border-amber-100/60">
              <Ruler size={14} className="shrink-0 text-amber-700" />
              <span>
                <strong className="text-gray-900 font-bold mr-0.5">Dimension:</strong>
                {dimensions?.length || 0}L x {dimensions?.width || 0}W x {dimensions?.height || 0}H cm
              </span>
            </div>
          )}

          {/* Price & Stock */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-dark)]">
                Rs. {salePrice.toLocaleString()}
              </span>
              {regularPrice > salePrice && (
                <span className="text-[var(--color-muted)] line-through text-base font-normal">
                  Rs. {regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded ${
                isOutOfStock ? "text-[var(--color-danger)] bg-red-50" : "text-[var(--color-success)] bg-emerald-50"
              }`}
            >
              Stock: {stock}
            </span>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] block mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center border border-[var(--color-border)] rounded-xl bg-[var(--color-card-bg)] p-1">
              <button
                type="button"
                disabled={isOutOfStock || qty <= 1}
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center font-bold text-[var(--color-text-dark)] hover:bg-white rounded-lg disabled:opacity-40 cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-bold">{qty}</span>
              <button
                type="button"
                disabled={isOutOfStock || qty >= stock}
                onClick={() => setQty((prev) => Math.min(stock, prev + 1))}
                className="w-8 h-8 flex items-center justify-center font-bold text-[var(--color-text-dark)] hover:bg-white rounded-lg disabled:opacity-40 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isOutOfStock || isCartMutationLoading}
                onClick={handleAddToCart}
                className="py-3.5 bg-[var(--color-card-bg)] hover:bg-[var(--color-border)] text-[var(--color-text-dark)] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                disabled={isOutOfStock || isCartMutationLoading}
                onClick={handleBuyNow}
                className="py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Buy It Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleWhatsAppOrder}
              className="py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <WhatsAppIcon size={16} />
              <span>Order via WhatsApp</span>
            </button>
          </div>

          {/* Product Description */}
          {description && (
            <div className="border-t border-[var(--color-border)] pt-3 mt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">
                Description
              </span>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-2">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>

      <CustomerReviews productId={_id} />
    </div>
  );
}