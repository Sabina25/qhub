import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useImageUpload } from '../hooks/useImageUpload';
import { FormState, Lang, L10n, Row, useNews } from '../hooks/useNews';
import { NewsTable } from '../components/NewsTable';

const langs: Lang[] = ['ua', 'en'];

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'align', 'color', 'background',
  'link',
];

const defaultForm: FormState = {
  title: { ua: '', en: '' },
  excerpt: { ua: '', en: '' },
  image: '',
  date: '',
  categoryKey: '',
  featured: false,
};

// ——— helpers for links in editor HTML ———
function ensureAnchorAttrs(html: string): string {
  if (!html) return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a[href]').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}

const CreateNews: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useTranslation();

  const { rows, loading, loadRows, addOrUpdate, remove } = useNews();
  const { uploading, progress, uploadImage, resetUpload } = useImageUpload();

  const [activeLang, setActiveLang] = useState<Lang>('ua');
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileKey, setFileKey] = useState(0);

  // —— Rich toolbar + custom link handler ——
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link'],
        ['clean'],
      ],
      handlers: {
        link: function (this: any, value: boolean) {
          const range = this.quill.getSelection();
          if (!range) return;
          if (value) {
            let href = prompt('URL (https://...)') || '';
            if (href && !/^(https?:)?\/\//i.test(href)) href = 'https://' + href;
            if (href) this.quill.format('link', href);
          } else {
            this.quill.format('link', false);
          }
        },
      },
    },
    clipboard: { matchVisual: false },
  }), []);

  // Preview lifecycle
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const setTitle = useCallback((l: Lang, v: string) =>
    setForm(p => ({ ...p, title: { ...p.title, [l]: v } })), []);

  // Single handler for Quill: normalize anchors, keep HTML
  const onQuillChange = useCallback((html: string) => {
    const cleanHtml = ensureAnchorAttrs(html);
    setForm(p => ({ ...p, excerpt: { ...p.excerpt, [activeLang]: cleanHtml } }));
  }, [activeLang]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setPreviewUrl('');
    setError(null);
    setActiveLang('ua');
    resetUpload();
    setFileKey(k => k + 1);
    if (fileRef.current) fileRef.current.value = '';
  }, [resetUpload]);

  const startEdit = useCallback((r: Row) => {
    setEditingId(r.id);
    setForm({
      title:   typeof r.title === 'string' ? { ua: r.title, en: r.title } : (r.title as L10n<string>),
      excerpt: typeof r.excerpt === 'string' ? { ua: r.excerpt || '', en: r.excerpt || '' } : (r.excerpt as L10n<string>),
      image:   r.image || '',
      date:    r.dateYMD || '',
      categoryKey: r.categoryKey || '',
      featured: r.featured,
    });
    setImageFile(null);
    setPreviewUrl(r.image || '');
    setActiveLang('ua');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onDelete = useCallback(async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    await remove(id);
    await loadRows();
    if (editingId === id) resetForm();
  }, [remove, loadRows, editingId, resetForm]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      let imageUrl = form.image || '';
      if (imageFile) imageUrl = await uploadImage(imageFile);

      await addOrUpdate(form, {
        editingId: editingId || undefined,
        authorEmail: user?.email || null,
        imageUrl,
      });

      await loadRows();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Не удалось сохранить.');
    }
  }, [form, imageFile, uploadImage, addOrUpdate, editingId, user?.email, loadRows, resetForm]);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-white shadow-md mt-10 rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6">{editingId ? 'Edit News' : 'Create News'}</h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">{error}</div>
      )}

      {/* Lang tabs */}
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
        <div>
          <label className="block mb-2 font-medium">Title ({activeLang.toUpperCase()})</label>
          <input
            value={form.title[activeLang]}
            onChange={(e) => setTitle(activeLang, e.target.value)}
            className="w-full border p-2 rounded"
            placeholder={activeLang === 'ua' ? 'Заголовок' : 'Title'}
            minLength={3}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Image</label>
          <input
            key={fileKey}
            ref={fileRef}
            type="file"
            accept="image/*"
            onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
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
            <div className="mt-3 space-y-3">
              <img src={previewUrl || form.image} alt="Preview" className="max-h-56 rounded-lg border object-contain" />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl('');
                  if (fileRef.current) fileRef.current.value = '';
                  setFileKey(k => k + 1);
                }}
                className="border px-3 py-1 rounded hover:bg-gray-50 text-sm"
              >
                Clear image
              </button>
            </div>
          )}
        </div>

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

        <div>
          <label className="block mb-2 font-medium">Content ({activeLang.toUpperCase()})</label>
          <ReactQuill
            theme="snow"
            value={form.excerpt[activeLang]}
            onChange={onQuillChange}
            className="bg-white rounded"
            modules={quillModules}
            formats={quillFormats}
          />
          <p className="text-xs text-gray-500 mt-1">
            Подсказка: выделите текст → кнопка “link” → вставьте URL (https://…).
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))} />
          Featured
        </label>

        {uploading && (
          <div className="w-full">
            <div className="mb-2 text-sm text-gray-600">Uploading: {progress}%</div>
            <div className="h-2 w-full rounded bg-gray-200">
              <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
            {editingId ? 'Save' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded hover:bg-gray-50">Cancel edit</button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold mt-10 mb-4">Existing news</h3>
      <NewsTable
        rows={rows}
        lang={lang as Lang}
        loading={loading}
        onEdit={startEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default CreateNews;
