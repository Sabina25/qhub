import { useRef } from 'react';
import { VideoCard } from '../../types/youtube';

export const ShortsRail = ({
  items,
  onOpen,
}: {
  items: VideoCard[];
  onOpen: (v: VideoCard) => void;
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    const card = 180 + 16;
    railRef.current?.scrollBy({ left: dir === 'left' ? -card * 4 : card * 4, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="relative">
      <h2 className="text-xl font-semibold mb-4">Shorts</h2>

      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white shadow rounded-full p-2"
        aria-label="Scroll left"
      >
        ←
      </button>

      <div ref={railRef} className="flex overflow-x-auto gap-4 pb-2 px-4">
        {items.map((v) => (
          <button
            key={v.id}
            onClick={() => onOpen(v)}
            className="w-[180px] aspect-[9/16] flex-shrink-0 relative group text-left"
            aria-label={v.title}
            title={v.title}
          >
            <img
              src={v.thumb}
              alt={v.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-2 text-[11px] text-white/90 line-clamp-2 bg-gradient-to-t from-black/60 to-transparent">
              {v.title}
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-black shadow">
              ▶
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white shadow rounded-full p-2"
        aria-label="Scroll right"
      >
        →
      </button>
    </section>
  );
};
