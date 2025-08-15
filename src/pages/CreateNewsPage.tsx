import React, { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

import { storage, db } from '../../firebase';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../context/TranslationContext';

type Lang = 'ua' | 'en';
type L10n<T> = Record<Lang, T>;

type FormState = {
  title: L10n<string>;
  excerpt: L10n<string>;
  image: string;
  date: string;           // YYYY-MM-DD
  categoryKey: string;    // ключ категории
  featured: boolean;
};

type Row = {
  id: string;
  title: L10n<string> | string; // поддержим старые записи
  image: string;
  date: string;                 // YYYY-MM-DD
  categoryKey?: string;
  featured: boolean;
  excerpt?: L10n<string> | string;
};

const langs: Lang[] = ['ua', 'en'];

// ---- helpers

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}
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



function slugify(s: string): string {
  const t = s.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return t.replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const CreateNews: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useTranslation();

  // form
  const [activeLang, setActiveLang] = useState<Lang>('ua');
  const [form, setForm] = useState<FormState>({
    title:   { ua: '', en: '' },
    excerpt: { ua: '', en: '' },
    image: '',
    date: '',
    categoryKey: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // table
  const [rows, setRows] = useState<Row[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
    clipboard: { matchVisual: false },
  }), []);
  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link'
  ], []);

  // list loader
  const loadRows = async () => {
    setLoadingRows(true);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, 'news'), orderBy('date', 'desc')));
      } catch {
        snap = await getDocs(collection(db, 'news')); 
      }
      const list: Row[] = snap.docs.map(d => {
        const data: any = d.data() || {};
        return {
          id: d.id,
          title: data.title ?? data.slug ?? '',
          image: data.image ?? '',
          date: toDateString(data.date) || toDateString(data.createdAt) || '',
          categoryKey: data.categoryKey ?? data.category ?? '',
          featured: !!data.featured,
          excerpt: data.excerpt ?? '',
        };
      });
      list.sort((a,b)=> (Date.parse(b.date||'')||0) - (Date.parse(a.date||'')||0));
      setRows(list);
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => { loadRows(); }, []);

  // image preview
  useEffect(() => {
    if (imageFile) setPreviewUrl(URL.createObjectURL(imageFile));
  }, [imageFile]);

  // form setters
  const setTitle = (l: Lang, v: string) =>
    setForm(p => ({ ...p, title: { ...p.title, [l]: v }}));
  const setExcerpt = (l: Lang, v: string) =>
    setForm(p => ({ ...p, excerpt: { ...p.excerpt, [l]: v }}));

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: { ua: '', en: '' },
      excerpt: { ua: '', en: '' },
      image: '',
      date: '',
      categoryKey: '',
      featured: false,
    });
    setImageFile(null);
    setPreviewUrl('');
    setError(null);
    setActiveLang('ua');
  };

  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({
      title:   typeof r.title === 'string' ? { ua: r.title, en: r.title } : (r.title as L10n<string>),
      excerpt: typeof r.excerpt === 'string' ? { ua: r.excerpt || '', en: r.excerpt || '' } : (r.excerpt as L10n<string>),
      image:   r.image || '',
      date:    r.date || '',
      categoryKey: r.categoryKey || '',
      featured: r.featured,
    });
    setImageFile(null);
    setPreviewUrl(r.image || '');
    setActiveLang('ua');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    await deleteDoc(doc(db, 'news', id));
   
    await loadRows();
    if (editingId === id) resetForm();
  };

  // SAVE
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const anyTitle = (form.title.ua || form.title.en).trim();
    if (!anyTitle) return setError('Введите заголовок (UA или EN).');
    if (!form.date) return setError('Выберите дату.');
    if (!form.categoryKey.trim()) return setError('Укажите категорию.');

    try {
      setUploading(true);
      setProgress(0);

      let imageUrl = form.image || '';
      if (imageFile) {
        const safeName = imageFile.name.replace(/\s+/g, '-');
        const path = `news/${Date.now()}-${safeName}`;
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, imageFile, {
          contentType: imageFile.type || 'image/jpeg',
        });
        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
            reject,
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      const [y, m, d] = form.date.split('-').map(Number);
      const dateTs = Timestamp.fromDate(new Date(y, m - 1, d));
      const slugs: L10n<string> = {
        ua: slugify(form.title.ua || form.title.en),
        en: slugify(form.title.en || form.title.ua),
      };

      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        slug: slugs,
        image: imageUrl,
        date: dateTs,
        categoryKey: form.categoryKey,
        featured: form.featured,
        authorEmail: user?.email || null,
        updatedAt: serverTimestamp(),
        ...(editingId ? {} : { createdAt: serverTimestamp() }),
      };

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), payload as any);
      } else {
        await addDoc(collection(db, 'news'), payload as any);
      }

      await loadRows();
      resetForm();
      // navigate('/admin')  // если нужно
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Не удалось сохранить.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-white shadow-md mt-10 rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6">
        {editingId ? 'Edit News' : 'Create News'}
      </h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {/* Табы языков */}
      <div className="mb-4 flex gap-2">
        {langs.map(l => (
          <button
            key={l}
            type="button"
            onClick={() => setActiveLang(l)}
            className={`px-3 py-1 rounded ${activeLang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title ({activeLang.toUpperCase()})</label>
          <input
            value={form.title[activeLang]}
            onChange={(e) => setTitle(activeLang, e.target.value)}
            className="w-full border p-2 rounded"
            placeholder={activeLang === 'ua' ? 'Заголовок' : 'Title'}
            minLength={3}
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              if (f && !f.type.startsWith('image/')) {
                setError('Выберите файл изображения (jpg, png, webp).');
                return;
              }
              setImageFile(f);
            }}
            className="w-full"
            {...(editingId ? {} : { required: true })}
          />
          {(previewUrl || form.image) && (
            <div className="mt-3">
              <img
                src={previewUrl || form.image}
                alt="Preview"
                className="max-h-56 rounded-lg border object-contain"
              />
            </div>
          )}
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Category key</label>
            <input
              value={form.categoryKey}
              onChange={(e) => setForm(p => ({ ...p, categoryKey: e.target.value }))}
              className="w-full border p-2 rounded"
              placeholder="e.g. projects"
              required
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-medium">Content ({activeLang.toUpperCase()})</label>
          <ReactQuill
            theme="snow"
            value={form.excerpt[activeLang]}
            onChange={(html) => setExcerpt(activeLang, html)}
            className="bg-white rounded"
            modules={modules}
            formats={formats}
          />
          <p className="text-xs text-gray-500 mt-1">
            Подсказка: для ссылки выделите текст → кнопка “link” → вставьте URL (например, https://…).
          </p>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
          />
          Featured
        </label>

        {/* Progress */}
        {uploading && (
          <div className="w-full">
            <div className="mb-2 text-sm text-gray-600">Uploading: {progress}%</div>
            <div className="h-2 w-full rounded bg-gray-200">
              <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {editingId ? 'Save' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <h3 className="text-2xl font-semibold mt-10 mb-4">Existing news</h3>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Featured</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingRows ? (
              <tr><td className="p-3" colSpan={4}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No news yet</td></tr>
            ) : (
              rows.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{pickL10n(r.title, lang) || '—'}</div>
                  </td>
                  <td className="p-3">{r.date ? new Date(r.date).toLocaleDateString(lang==='ua'?'uk-UA':'en-GB') : '—'}</td>
                  <td className="p-3">{r.featured ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="px-3 py-1 rounded border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(r.id)}
                        className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateNews;
