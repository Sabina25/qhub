import { VideoCard } from '../../types/youtube';

export const VideoGrid = ({
  items,
  onOpen,
  title = 'Последние видео',
}: {
  items: VideoCard[];
  onOpen: (v: VideoCard) => void;
  title?: string;
}) => {
  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <button
            key={v.id}
            onClick={() => onOpen(v)}
            className="relative aspect-video rounded-xl overflow-hidden text-left group"
            aria-label={v.title}
            title={v.title}
          >
            <img
              src={v.thumb}
              alt={v.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-sm text-white/90 line-clamp-2 bg-gradient-to-t from-black/60 to-transparent">
              {v.title}
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-black shadow">
              ▶
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
