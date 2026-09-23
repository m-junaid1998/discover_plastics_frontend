import React, { useState, useEffect, useRef } from "react";
import { useMedia } from "../hooks/useMedia";
import { Skeleton } from "../components/Skeleton";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  const [curr, setCurr] = useState(0);
  const { mediaList, isLoadingMedia } = useMedia({ key: "carousel" });
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!mediaList?.length || mediaList.length <= 1) return;
    const timer = setInterval(() => setCurr((p) => (p + 1) % mediaList.length), 6000);
    return () => clearInterval(timer);
  }, [mediaList]);

  if (isLoadingMedia) {
    return (
      <div className="w-full px-4 sm:px-8 py-4 bg-[var(--color-bg-light)]">
        <Skeleton variant="rounded"  className="w-full max-w-7xl mx-auto aspect-[12/5] !rounded-3xl" />
      </div>
    );
  }

  if (!mediaList?.length) return null;

  return (
    <div className="w-full px-4 sm:px-8 py-4 bg-[var(--color-bg-light)]">
      <section
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) setCurr((p) => (diff > 0 ? (p + 1) % mediaList.length : (p - 1 + mediaList.length) % mediaList.length));
          touchStartX.current = null;
        }}
        className="relative w-full max-w-7xl mx-auto aspect-video  rounded-xl overflow-hidden shadow-lg touch-pan-y select-none">
        {mediaList.map((item: any, i: number) => (
          <div key={item._id || i} className={`absolute inset-0 transition-opacity duration-700 ${i === curr ? "opacity-100 z-10" : "opacity-0"}`}>
            <Link to="/shop" ><img src={item.mediaUrl} alt={item.title || "Banner"} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "low"} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 " /></Link>
          </div>
        ))}
       {mediaList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-1">
        {mediaList.map((_: any, i: number) => (
        <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => setCurr(i)} className="p-2 cursor-pointer flex items-center justify-center focus:outline-none">
        <span  className={`h-1.5 rounded-full transition-all duration-300 ${i === curr ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75" }`}/></button>))}</div>)}
        </section>
    </div>
  );
};