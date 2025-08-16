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
      const d = new Date(input.seconds * 1000);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (typeof input === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      if (isNaN(+d)) return '';
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return '';
  } catch {
    return '';
  }
}

export async function fetchNews() {
  const snap = await getDocs(collection(db, 'news'));
  const rows = snap.docs.map((d) => {
    const data: any = d.data() || {};
    const dateYMD =
      (typeof data.dateYMD === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.dateYMD) && data.dateYMD) ||
      toDateString(data.dateTs || data.date) || // Fallback для старых записей
      '';

    return {
      id: d.id,
      ...data,
      dateYMD,
    };
  });

  rows.sort((a: any, b: any) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));
  return rows;
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
