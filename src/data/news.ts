import { db } from '../../firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { pickL10n, Lang } from '../i18n/newsL10n';

export type NewsItem = {
  id: string;
  title: string;    
  excerpt: string;   
  image: string;
  date: string;      
  categoryKey: string;
  featured: boolean;
  slug?: string;
  authorEmail?: string | null;
};

// Timestamp | string → 'YYYY-MM-DD'
function toDateString(input: any): string {
  try {
    if (input && typeof input === 'object' && 'seconds' in input) {
      const ms = input.seconds * 1000 + Math.floor((input.nanoseconds || 0) / 1e6);
      return new Date(ms).toISOString().slice(0, 10);
    }
    if (typeof input === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      return isNaN(+d) ? '' : d.toISOString().slice(0, 10);
    }
    return '';
  } catch {
    return '';
  }
}

export async function fetchNews(lang: Lang): Promise<NewsItem[]> {
  const snap = await getDocs(collection(db, 'news'));
  const items: NewsItem[] = snap.docs.map((d) => {
    const data: any = d.data() || {};
    const dateStr =
      toDateString(data.date) ||
      toDateString(data.createdAt) ||
      toDateString(data.updatedAt) ||
      '';

    return {
      id: d.id,
      title: pickL10n<string>(data.title, lang),
      excerpt: pickL10n<string>(data.excerpt, lang),
      image: data.image ?? '',
      date: dateStr,
      categoryKey: data.categoryKey ?? '',
      featured: Boolean(data.featured),
      slug: pickL10n<string>(data.slug, lang),
      authorEmail: data.authorEmail ?? null,
    };
  });

  items.sort((a, b) => {
    const ta = a.date ? Date.parse(a.date) : 0;
    const tb = b.date ? Date.parse(b.date) : 0;
    return tb - ta;
  });

  return items;
}

export async function fetchNewsById(id: string, lang: Lang): Promise<NewsItem | null> {
  const ref = doc(db, 'news', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data: any = snap.data() || {};
  const dateStr =
    toDateString(data.date) ||
    toDateString(data.createdAt) ||
    toDateString(data.updatedAt) ||
    '';

  return {
    id: snap.id,
    title: pickL10n<string>(data.title, lang),
    excerpt: pickL10n<string>(data.excerpt, lang),
    image: data.image ?? '',
    date: dateStr,
    categoryKey: data.categoryKey ?? '',
    featured: Boolean(data.featured),
    slug: pickL10n<string>(data.slug, lang),
    authorEmail: data.authorEmail ?? null,
  };
}
