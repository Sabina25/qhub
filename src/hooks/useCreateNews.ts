import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useImageUpload } from './useImageUpload';
import { FormState, Lang, L10n, Row, useNews } from './useNews';
import { ensureAnchorAttrs } from '../utils/editor';

export const langs: Lang[] = ['ua', 'en'];

export const defaultForm: FormState = {
  title:   { ua: '', en: '' },
  excerpt: { ua: '', en: '' },
  image: '',
  date: '',
  categoryKey: '',
  featured: false,
};

// helper to avoid sharing object references
const cloneDefaultForm = (): FormState => JSON.parse(JSON.stringify(defaultForm));

export function useCreateNewsLogic() {
  const { user } = useAuth();
  const { lang } = useTranslation();

  // Firestore
  const { rows, loading, loadRows, addOrUpdate, remove } = useNews();

  // storage upload
  const { uploading, progress, uploadImage, resetUpload } = useImageUpload();

  // local state
  const [activeLang, setActiveLang] = useState<Lang>('ua');
  const [form, setForm] = useState<FormState>(cloneDefaultForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // file/preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileKey, setFileKey] = useState(0);

  // preview lifecycle
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // setters
  const setTitle = useCallback(
    (l: Lang, v: string) => setForm((p) => ({ ...p, title: { ...p.title, [l]: v } })),
    []
  );

  // IMPORTANT: bind by language (no race with activeLang)
  const onQuillChange = useCallback(
    (l: Lang, html: string) => {
      const clean = ensureAnchorAttrs(html);
      setForm((p) => ({ ...p, excerpt: { ...p.excerpt, [l]: clean } }));
    },
    []
  );

  const onImageInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = '';
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && !f.type.startsWith('image/')) {
      setError('Please choose an image file (jpg, png, webp).');
      return;
    }
    setImageFile(f);
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileRef.current) fileRef.current.value = '';
    setFileKey((k) => k + 1);
    setForm((p) => ({ ...p, image: '' }));
  };

  // reset
  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(cloneDefaultForm());
    setImageFile(null);
    setPreviewUrl('');
    setError(null);
    setActiveLang('ua');
    resetUpload();
    setFileKey((k) => k + 1);
    if (fileRef.current) fileRef.current.value = '';
  }, [resetUpload]);

  // edit -> form
  const startEdit = useCallback((r: Row) => {
    setEditingId(r.id);

    const title: L10n<string> =
      typeof r.title === 'string' ? { ua: r.title, en: r.title } : (r.title as L10n<string>) || { ua: '', en: '' };

    const excerpt: L10n<string> =
      typeof r.excerpt === 'string'
        ? { ua: r.excerpt || '', en: r.excerpt || '' }
        : ((r.excerpt as L10n<string>) || { ua: '', en: '' });

    setForm({
      title:   { ua: title.ua ?? '',   en: title.en ?? '' },
      excerpt: { ua: excerpt.ua ?? '', en: excerpt.en ?? '' },
      image: r.image || '',
      date: r.dateYMD || '',
      categoryKey: r.categoryKey || '',
      featured: !!r.featured,
    });

    setImageFile(null);
    setPreviewUrl(r.image || '');
    setActiveLang('ua');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // delete
  const onDelete = useCallback(
    async (id: string) => {
      if (!confirm('Delete this news item?')) return;
      await remove(id);
      await loadRows();
      if (editingId === id) resetForm();
    },
    [remove, loadRows, editingId, resetForm]
  );

  // submit
  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
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
        setError(err?.message || 'Failed to save.');
      }
    },
    [form, imageFile, uploadImage, addOrUpdate, editingId, user?.email, loadRows, resetForm]
  );

  return {
    // page-facing
    rows,
    loading,
    lang,

    // form
    activeLang,
    setActiveLang,
    form,
    setForm,
    editingId,
    error,
    uploading,
    progress,

    // fields
    setTitle,
    onQuillChange, // (lang, html)

    // file
    fileKey,
    fileRef,
    previewUrl,
    onImageInputClick,
    onImageChange,
    clearImage,

    // actions
    onSubmit,
    startEdit,
    onDelete,

    // utils
    resetForm,
  };
}
