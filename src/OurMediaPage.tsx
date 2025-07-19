import { useEffect, useState, useRef } from "react";

import Footer from './components/Footer';
import Header from './components/Header';

const YOUTUBE_API_KEY = "AIzaSyDYX3_pppGQYuCTcKJaZgyg9fWZ6FBRI1A";
const CHANNEL_ID = "UCm-C1Ix_tf4PnuROw8QRqTg";

function YouTubeFeed() {
  const [shorts, setShorts] = useState([]);
  const [longVideos, setLongVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const shortsContainerRef = useRef<HTMLDivElement>(null);

  const scrollShorts = (direction: 'left' | 'right') => {
    const itemWidth = 180 + 16; 
    const scrollAmount = itemWidth * 4;
  
    if (shortsContainerRef.current) {
      shortsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`
        );
        const data = await res.json();

        const videoIds = data.items
          .filter((item) => item.id.kind === "youtube#video")
          .map((item) => item.id.videoId);

        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds.join(",")}&part=contentDetails,snippet`
        );
        const detailsData = await detailsRes.json();

        const shortsList = [];
        const longList = [];

        for (const video of detailsData.items) {
          const duration = video.contentDetails.duration;
          const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
          const minutes = parseInt(match?.[1] || "0", 10);
          const seconds = parseInt(match?.[2] || "0", 10);
          const totalSeconds = minutes * 60 + seconds;

          if (totalSeconds < 180) {
            shortsList.push(video);
          } else if (totalSeconds >= 200) {
            longList.push(video);
          }
        }

        setShorts(shortsList);
        setLongVideos(longList.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке видео:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const SkeletonBox = ({ aspect = "aspect-video" }: { aspect?: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${aspect}`} />
  );

  return (
    <div className="space-y-12">
      {loading ? (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">Shorts</h2>
            <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <SkeletonBox key={idx} aspect="min-w-[180px] aspect-[9/16]" />
                ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Последние видео</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <SkeletonBox key={idx} />
                ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {shorts.length > 0 && (
            <section className="relative">
              <h2 className="text-xl font-semibold mb-4">Shorts</h2>

              {/* button */}
              <button
                onClick={() => scrollShorts('left')}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
              >
                ←
              </button>

              {/*shorts */}
              <div
                ref={shortsContainerRef}
                className="flex overflow-x-auto gap-4 pb-2 px-4 scroll-smooth"
              >
                {shorts.map((video) => (
                  <div
                    key={video.id}
                    className="w-[180px] aspect-[9/16] flex-shrink-0"
                  >
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${video.id}?modestbranding=1`}
                      title={video.snippet.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>

              {/*button */}
              <button
                onClick={() => scrollShorts('right')}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
              >
                →
              </button>
            </section>
          )}

          {longVideos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Последние видео</h2>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {longVideos.map((video) => (
                  <div key={video.id} className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-xl"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.snippet.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}


const OurMediaPage = () => {
    return (
<>
  <Header />
  <main className="min-h-screen bg-white px-4">
    <section className="max-w-7xl mx-auto py-12 space-y-12">
      
     
      <div className="max-w-4xl mx-auto text-center px-4 space-y-4 text-gray-800 mt-10">
        <p className="text-lg font-semibold">
          <span className="text-blue-700">Crimea Vox</span> — незалежне кримськотатарське медіа, що говорить про Крим таким, яким він є.
        </p>
        <p>
          Це голос півострова, який не затихає і нагадує: Крим — не «загублена територія», а жива частина України.
          Ми працюємо, щоб повернути Крим у поле української уваги — і утримувати його там постійно, попри окупацію.
        </p>
      </div>

      
      <div >
        {/* <h1 className="text-4xl font-semibold text-center mb-10">Наш YouTube</h1> */}
        <YouTubeFeed />
      </div>

    </section>
  </main>
  <Footer />
</>

    );
  };
  

export default OurMediaPage;
