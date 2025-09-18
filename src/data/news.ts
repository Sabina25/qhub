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

function deepCleanKeepEmptyStrings<T>(v: T): T {
  if (Array.isArray(v)) {
    return v.map(deepCleanKeepEmptyStrings) as unknown as T;
  }
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v as Record<string, any>)
        .map(([k, val]) => [k, deepCleanKeepEmptyStrings(val)])
        .filter(([_, val]) => val !== undefined && val !== null)  
    ) as unknown as T;
  }
  return v;
}

export async function fetchNews() {
  const snap = await getDocs(collection(db, 'news'));
  return snap.docs.map(d => {
    const data = d.data({ serverTimestamps: 'estimate' }); 
    return deepCleanKeepEmptyStrings({ id: d.id, ...data });
  });
}

export async function fetchNewsById(id: string, lang: 'ua' | 'en' = 'ua'): Promise<NewsItem | null> {
  const ref = doc(db, 'news', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapDocToItem(snap.id, snap.data(), lang);
}
