import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Film } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { Skeleton } from "../components/Skeleton";
import type { MediaItem } from "../utils/types";

const ReelCard = ({ item }: { item: MediaItem }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    const stopVideo = () => {
      video.pause();
      setIsPlaying(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? playVideo() : stopVideo()),
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    const handleVis = () => document.hidden && stopVideo();
    document.addEventListener("visibilitychange", handleVis);
    window.addEventListener("blur", stopVideo);
    window.addEventListener("pagehide", stopVideo);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVis);
      window.removeEventListener("blur", stopVideo);
      window.removeEventListener("pagehide", stopVideo);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className="group relative aspect-[9/16] w-[240px] sm:w-[280px] h-[426px] sm:h-[497px] shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-[var(--color-border)] hover:scale-[1.02] transition-transform bg-black/10"
    >
      <video
        ref={videoRef}
        src={`${item.mediaUrl}#t=0.001`}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        width="280"
        height="497"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover block"
      />
      <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        <div className="p-3.5 rounded-full bg-white/20 backdrop-blur-md text-white">
          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </div>
      </div>
      <button
        type="button"
        aria-label={isMuted ? "Unmute reel" : "Mute reel"}
        onClick={toggleMute}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition z-10"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default function ReelsSection() {
  const { mediaList, isLoadingMedia } = useMedia({ key: "banner" });
  const reels = mediaList?.filter((i: MediaItem) => i.mediaType === "video" || i.mediaUrl?.match(/\.(mp4|webm|mov)$/i)).slice(0, 3) || [];

  return (
    <section aria-label="Promotional Reels" className="py-6 px-4 md:px-8 max-w-[1600px] mx-auto space-y-4">
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-3">
        <div className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]"><Film className="w-5 h-5" /></div>
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--color-text-dark)]">Promotional Reels</h2>
          <p className="text-xs text-[var(--color-muted)] font-medium">Watch latest collection showcases</p>
        </div>
      </div>

      <div className="min-h-[440px] sm:min-h-[510px] flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide py-2">
        {isLoadingMedia
          ? [1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="aspect-[9/16] w-[240px] sm:w-[280px] h-[426px] sm:h-[497px] shrink-0 !rounded-2xl" />)
          : reels.map((reel: MediaItem) => <ReelCard key={reel._id} item={reel} />)}
      </div>

      {!isLoadingMedia && reels.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-[var(--color-card-bg)] border border-dashed border-[var(--color-border)] min-h-[140px] flex flex-col items-center justify-center">
          <Film className="w-8 h-8 mx-auto text-[var(--color-muted)] mb-2" />
          <p className="text-xs font-bold text-[var(--color-text-dark)] uppercase">No Promotional Reels Found</p>
        </div>
      )}
    </section>
  );
}