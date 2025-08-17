export type YouTubeParse = { videoId?: string; playlistId?: string };

export function parseYouTube(url: string): YouTubeParse {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    const qpV = u.searchParams.get('v') || undefined;
    const qpList = u.searchParams.get('list') || undefined;

    if (host === 'youtu.be') {
      return { videoId: u.pathname.replace(/^\//, '') || undefined, playlistId: qpList };
    }

    if (host.endsWith('youtube.com')) {
      if (u.pathname === '/watch') {
        return { videoId: qpV, playlistId: qpList };
      }
      if (u.pathname.startsWith('/playlist')) {
        return { playlistId: qpList };
      }
      if (u.pathname.startsWith('/embed/')) {
        return { videoId: u.pathname.split('/').pop() || undefined, playlistId: qpList };
      }
    }
  } catch {}
  return {};
}

export function buildEmbedUrl(input: string): string | null {
  const { videoId, playlistId } = parseYouTube(input);
  if (playlistId && !videoId) {
    return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`;
  }
  if (videoId) {
    const listPart = playlistId ? `&list=${encodeURIComponent(playlistId)}` : '';
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0${listPart}`;
  }
  if (/^https:\/\/www\.youtube\.com\/embed\//.test(input)) return input;
  return null;
}