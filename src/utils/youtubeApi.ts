import { VideoCard } from '../types/youtube';

// ISO8601 -> сек
function isoToSeconds(iso = 'PT0S'): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = Number(m?.[1] ?? 0);
  const min = Number(m?.[2] ?? 0);
  const s = Number(m?.[3] ?? 0);
  return h * 3600 + min * 60 + s;
}

export async function fetchChannelVideos(
  apiKey: string,
  channelId: string,
  signal?: AbortSignal
): Promise<{ shorts: VideoCard[]; longs: VideoCard[] }> {

  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
      new URLSearchParams({
        key: apiKey,
        channelId,
        part: 'snippet,id',
        order: 'date',
        maxResults: '50',
        type: 'video',
        fields:
          'items(id/videoId,snippet/title,snippet/thumbnails/high/url,snippet/thumbnails/medium/url)'
      }),
    { signal }
  );
  const searchJson: any = await searchRes.json();

  const ids: string[] =
    searchJson?.items?.map((it: any) => it?.id?.videoId).filter(Boolean) ?? [];
  if (!ids.length) return { shorts: [], longs: [] };


  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        key: apiKey,
        id: ids.join(','),
        part: 'contentDetails,snippet',
        fields:
          'items(id,contentDetails/duration,snippet/title,snippet/thumbnails/high/url,snippet/thumbnails/medium/url)'
      }),
    { signal }
  );
  const detailsJson: any = await detailsRes.json();

  const shorts: VideoCard[] = [];
  const longs: VideoCard[] = [];

  for (const v of detailsJson?.items ?? []) {
    const seconds = isoToSeconds(v.contentDetails?.duration);
    const title: string = v.snippet?.title || 'Video';
    const thumb: string =
      v.snippet?.thumbnails?.high?.url ||
      v.snippet?.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;

    const card: VideoCard = {
      id: v.id,
      title,
      thumb,
      seconds,
      isShort: seconds <= 90 
    };

    if (card.isShort) shorts.push(card);
    else if (seconds >= 210) longs.push(card); 
  }

  return { shorts, longs: longs.slice(0, 6) };
}
