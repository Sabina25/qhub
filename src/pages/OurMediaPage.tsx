import { useCallback, useMemo, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useYouTubeFeed } from '../hooks/useYouTubeFeed';
import { ShortsRail } from '../components/media/ShortsRail';
import { VideoGrid } from '../components/media/VideoGrid';
import { VideoLightbox } from '../components/media/VideoLightbox';
import { VideoCard } from '../types/youtube';

const YT_API_KEY =
  import.meta.env.VITE_YT_API_KEY ?? 'AIzaSyDYX3_pppGQYuCTcKJaZgyg9fWZ6FBRI1A';
const CHANNEL_ID =
  import.meta.env.VITE_YT_CHANNEL_ID ?? 'UCm-C1Ix_tf4PnuROw8QRqTg';

const OurMediaPage = () => {
  const { shorts, longs, loading, err } = useYouTubeFeed(YT_API_KEY, CHANNEL_ID);

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; isShort: boolean; title?: string } | null>(null);
  const openVideo = useCallback((v: VideoCard) => {
    setSelected({ id: v.id, isShort: v.isShort, title: v.title });
    setOpen(true);
  }, []);
  const closeVideo = useCallback(() => setOpen(false), []);

  const Hero = useMemo(
    () => (
      <div className="max-w-4xl mx-auto text-center px-4 space-y-4 text-gray-800 mt-10">
        <p className="text-lg font-semibold">
          <span className="text-blue-700">Crimea Vox</span> — незалежне кримськотатарське медіа, що говорить про Крим
          таким, яким він є.
        </p>
        <p>
          Це голос півострова, який не затихає. Ми працюємо, щоб повернути Крим у поле української уваги — і
          утримувати його там постійно, попри окупацію.
        </p>
      </div>
    ),
    []
  );

  // скелетоны
  const Skeleton = ({ aspect = 'aspect-video' }: { aspect?: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${aspect}`} />
  );

  return (
    <>
      <Header appearance="solid" />
      <main className="min-h-screen bg-white px-4">
        <section className="max-w-7xl mx-auto py-12 space-y-12">
          {Hero}

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>
          )}

          {/* SHORTS */}
          {loading ? (
            <section>
              <h2 className="text-xl font-semibold mb-4">Shorts</h2>
              <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} aspect="min-w-[180px] aspect-[9/16]" />
                ))}
              </div>
            </section>
          ) : (
            <ShortsRail items={shorts} onOpen={openVideo} />
          )}

          {/* LONGS */}
          {loading ? (
            <section>
              <h2 className="text-xl font-semibold mb-4">Последние видео</h2>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            </section>
          ) : (
            <VideoGrid items={longs} onOpen={openVideo} title="Последние видео" />
          )}

          <VideoLightbox
            open={open}
            onClose={closeVideo}
            videoId={selected?.id ?? null}
            isShort={!!selected?.isShort}
            title={selected?.title}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OurMediaPage;
