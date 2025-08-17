import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

type L10n<T> = string | { ua?: T; en?: T };

export type NewsItem = {
  id: string;
  title: string;         
  excerpt: string;       
  image: string;
  dateYMD: string;      
  category?: string;      
  categoryKey?: string;
  featured: boolean;
  dateTs?: any;
  date?: any;
};

function pickL10n<T>(val: L10n<T>, lang: 'ua' | 'en'): T | '' {
  if (typeof val === 'string') return val as unknown as T;
  if (val && typeof val === 'object')
    return (val[lang] ?? val.ua ?? val.en ?? '') as T | '';
  return '' as T | '';
}

export function toDateYMD(input: any): string {
  try {
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    // Firestore Timestamp-like
    if (input && typeof input === 'object' && 'seconds' in input) {
      const d = new Date(input.seconds * 1000);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (input) {
      const d = new Date(input);
      if (!isNaN(d.getTime())) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    }
    return '';
  } catch {
    return '';
  }
}

function mapDocToItem(
  id: string,
  data: any,
  lang: 'ua' | 'en'
): NewsItem {
  const dateYMD =
    (typeof data.dateYMD === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.dateYMD) && data.dateYMD) ||
    toDateYMD(data.dateTs ?? data.date) ||
    '';

  return {
    id,
    title: pickL10n<string>(data.title, lang),
    excerpt: pickL10n<string>(data.excerpt, lang),
    image: data.image ?? '',
    dateYMD,
    categoryKey: data.categoryKey ?? data.category ?? '',
    category: data.category ? pickL10n<string>(data.category, lang) : undefined,
    featured: !!data.featured,
    dateTs: data.dateTs,
    date: data.date,
  };
}

export async function fetchNews(lang: 'ua' | 'en' = 'ua'): Promise<NewsItem[]> {
  const q = query(collection(db, 'news'), orderBy('dateYMD', 'desc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => mapDocToItem(d.id, d.data(), lang));
  return list.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));
}

export async function fetchNewsById(id: string, lang: 'ua' | 'en' = 'ua'): Promise<NewsItem | null> {
  const ref = doc(db, 'news', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapDocToItem(snap.id, snap.data(), lang);
}
