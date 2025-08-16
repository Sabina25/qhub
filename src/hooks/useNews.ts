import { useCallback, useEffect, useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query,
  serverTimestamp, Timestamp, updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { slugify } from '../utils/slugify';
import { ensureYMD, ymdToTimestampUTC } from '../utils/dates';

export type Lang = 'ua' | 'en';
export type L10n<T> = Record<Lang, T>;

export type FormState = {
  title: L10n<string>;
  excerpt: L10n<string>;
  image: string;
  date: string;        // YYYY-MM-DD
  categoryKey: string;
  featured: boolean;
};

export type Row = {
  id: string;
  title: L10n<string> | string;
  image: string;
  dateYMD: string; // stable for ordering & UI
  categoryKey?: string;
  featured: boolean;
  excerpt?: L10n<string> | string;
};

export function useNews() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, 'news'), orderBy('dateYMD', 'desc')));
      } catch {
        // fallback if index not yet present
        snap = await getDocs(collection(db, 'news'));
      }
      const list: Row[] = snap.docs.map(d => {
        const data: any = d.data() || {};
        const dateNew: string = ensureYMD(data.dateYMD) || ensureYMD(data.date) || '';
        return {
            id: d.id,
            title: data.title ?? data.slug ?? '',
            image: data.image ?? '',
            dateYMD: dateNew,             
            categoryKey: data.categoryKey ?? data.category ?? '',
            featured: !!data.featured,
            excerpt: data.excerpt ?? '',
          };
      });
      list.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));
      setRows(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRows(); }, [loadRows]);

  const addOrUpdate = useCallback(async (
    form: FormState,
    options: { editingId?: string; authorEmail?: string | null; imageUrl?: string }
  ) => {
    const anyTitle = (form.title.ua || form.title.en).trim();
    if (!anyTitle) throw new Error('Введите заголовок (UA или EN).');
    if (!form.date) throw new Error('Выберите дату.');
    if (!form.categoryKey.trim()) throw new Error('Укажите категорию.');

    const dateYMD = form.date; // already validated
    const dateTs: Timestamp = ymdToTimestampUTC(dateYMD);
    const slugs: L10n<string> = {
      ua: slugify(form.title.ua || form.title.en),
      en: slugify(form.title.en || form.title.ua),
    };

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      slug: slugs,
      image: options.imageUrl || form.image || '',
      dateYMD,
      dateTs,
      categoryKey: form.categoryKey,
      featured: form.featured,
      authorEmail: options.authorEmail || null,
      updatedAt: serverTimestamp(),
      ...(options.editingId ? {} : { createdAt: serverTimestamp() }),
    };

    if (options.editingId) {
      await updateDoc(doc(db, 'news', options.editingId), payload as any);
    } else {
      await addDoc(collection(db, 'news'), payload as any);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'news', id));
  }, []);

  return { rows, loading, loadRows, addOrUpdate, remove };
}