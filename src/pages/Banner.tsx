import { useMedia } from "../hooks/useMedia";
import { Skeleton } from "../components/Skeleton";

export const Banner = () => {
  const { mediaList: banners, isLoadingMedia } = useMedia({ key: "hero" });

  if (isLoadingMedia) {
    return (
      <div className="w-full py-3 sm:py-4">
        <Skeleton variant="rectangular" className="w-full aspect-[16/7]  !rounded-none"/>
      </div>
    );
  }

  if (!banners || banners.length === 0) null

  return (
    <section aria-label="Banner" className="w-full ">
      {banners.map((banner: any) => (
        <div key={banner._id} className="w-full aspect-[16/7] overflow-hidden">
          <img src={banner.mediaUrl} alt={banner.title || "Banner"} loading="lazy" className="w-full h-full object-cover object-center "/>
        </div>
      ))}
    </section>
  );
};
