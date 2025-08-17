import { useEffect, useState } from 'react';
import { fetchChannelVideos } from '../utils/youtubeApi';
import { VideoCard } from '../types/youtube';

const cacheKey = (ch: string) => `yt-feed-v1:${ch}`;
const TTL = 5 * 60 * 1000; 

function readCache(channelId: string) {
  try {
    const raw = sessionStorage.getItem(cacheKey(channelId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > TTL) return null;
    return parsed.data as { shorts: VideoCard[]; longs: VideoCard[] };
  } catch {
    return null;
  }
}
function writeCache(channelId: string, data: { shorts: VideoCard[]; longs: VideoCard[] }) {
  try {
    sessionStorage.setItem(cacheKey(channelId), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export function useYouTubeFeed(apiKey: string, channelId: string) {
  const [shorts, setShorts] = useState<VideoCard[]>([]);
  const [longs, setLongs] = useState<VideoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const cached = readCache(channelId);
    if (cached) {
      setShorts(cached.shorts);
      setLongs(cached.longs);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchChannelVideos(apiKey, channelId, ac.signal);
        writeCache(channelId, data);
        setShorts(data.shorts);
        setLongs(data.longs);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setErr(e?.message || 'Не удалось загрузить видео');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [apiKey, channelId]);

  const refresh = async () => {
    const ac = new AbortController();
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchChannelVideos(apiKey, channelId, ac.signal);
      writeCache(channelId, data);
      setShorts(data.shorts);
      setLongs(data.longs);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setErr(e?.message || 'Не удалось загрузить видео');
      }
    } finally {
      setLoading(false);
    }
  };

  return { shorts, longs, loading, err, refresh };
}
