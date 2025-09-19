import { useMemo, useState, useCallback } from 'react';
import { parseYouTube } from '../utils/youtube';

type Props = {
  urls: string[];
  className?: string;
};

type Parsed = ReturnType<typeof parseYouTube>;

function youtubeThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function buildVideoEmbed(videoId: string) {
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`;
}

function buildPlaylistEmbed(listId: string) {
  return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}&rel=0&modestbranding=1`;
}

export default function VideoGallery({ urls, className = '' }: Props) {
  const items = useMemo(
    () =>
      (urls || [])
        .map(parseYouTube)
        .filter(Boolean)
        .filter((p) => p.videoId || p.playlistId) as Parsed[],
    [urls]
  );

  if (!items.length) return null;

  const [active, setActive] = useState(0);
  const onPick = useCallback((idx: number) => setActive(idx), []);

  const mainSrc = useMemo(() => {
    const cur = items[active];
    if (cur?.videoId) return `${buildVideoEmbed(cur.videoId)}&autoplay=1&mute=1`;
    if (cur?.playlistId) return `${buildPlaylistEmbed(cur.playlistId)}&autoplay=1&mute=1`;
    return '';
  }, [items, active]);

  return (
    <div className={`w-full ${className}`}>
      {/* Главное видео */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-sm" style={{ paddingBottom: '56.25%' }}>
        {mainSrc && (
          <iframe
            key={mainSrc}
            src={mainSrc}
            className="absolute inset-0 h-full w-full"
            title="Main video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Лента превью снизу */}
      <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
        {items.map((it, i) => {
          const isActive = i === active;
          const key = it.videoId || it.playlistId || 'x';
          const thumb = it.videoId ? (
            <img
              src={youtubeThumb(it.videoId)}
              alt={`Video ${i + 1}`}
              className="w-60 h-36 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-60 h-36 bg-gray-200 grid place-items-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-gray-500">
                <path d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2z" />
              </svg>
            </div>
          );

          return (
            <button
              key={key + i}
              onClick={() => onPick(i)}
              className={`group relative shrink-0 rounded-lg border overflow-hidden transition ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {thumb}
              {/* play-иконка поверх */}
              <div
                aria-hidden
                className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition"
              >
                <div className="w-10 h-10 rounded-full bg-black/60 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
