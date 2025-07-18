import { useEffect, useState } from "react";

import Footer from './components/Footer';
import Header from './components/Header';

const YOUTUBE_API_KEY = "AIzaSyDYX3_pppGQYuCTcKJaZgyg9fWZ6FBRI1A";
const CHANNEL_ID = "UCm-C1Ix_tf4PnuROw8QRqTg";

function YouTubeFeed() {
  const [shorts, setShorts] = useState([]);
  const [longVideos, setLongVideos] = useState([]);

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

          if (totalSeconds < 60) {
            shortsList.push(video);
          } else if (totalSeconds >= 180) {
            longList.push(video);
          }
        }

        setShorts(shortsList.slice(0, 4));
        setLongVideos(longList.slice(0, 6));
      } catch (error) {
        console.error("Ошибка при загрузке видео:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="space-y-12">
      {shorts.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Shorts</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
            {shorts.map((video) => (
              <div
                key={video.id}
                className="min-w-[180px] aspect-[9/16] flex-shrink-0"
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
    </div>
  );
}


const OurMedia = () => {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white px-4">
          <section className="max-w-7xl mx-auto py-12">
            <h1 className="text-4xl font-semibold text-center mb-10">Наш YouTube</h1>
            <YouTubeFeed />
          </section>
        </main>
        <Footer />
      </>
    );
  };
  

export default OurMedia;
