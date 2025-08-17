import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useImageUpload } from './useImageUpload';
import { FormState, Lang, L10n, Row, useNews } from './useNews';
import { ensureAnchorAttrs } from '../utils/editor';

export const langs: Lang[] = ['ua', 'en'];

export const defaultForm: FormState = {
  title: { ua: '', en: '' },
  excerpt: { ua: '', en: '' },
  image: '',
  date: '',
  categoryKey: '',
  featured: false,
};

export function useCreateNewsLogic() {
  const { user } = useAuth();
  const { lang } = useTranslation();

  // данные с Firestore (новости)
  const { rows, loading, loadRows, addOrUpdate, remove } = useNews();

  // загрузка изображений в storage
  const { uploading, progress, uploadImage, resetUpload } = useImageUpload();

  // локальное состояние формы
  const [activeLang, setActiveLang] = useState<Lang>('ua');
  const [form, setForm] = useState<FormState>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // файл/превью
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

  const onQuillChange = useCallback(
    (html: string) => {
      const clean = ensureAnchorAttrs(html);
      setForm((p) => ({ ...p, excerpt: { ...p.excerpt, [activeLang]: clean } }));
    },
    [activeLang]
  );

  const onImageInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = '';
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && !f.type.startsWith('image/')) {
      setError('Выберите файл изображения (jpg, png, webp).');
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

  // сброс
  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setPreviewUrl('');
    setError(null);
    setActiveLang('ua');
    resetUpload();
    setFileKey((k) => k + 1);
    if (fileRef.current) fileRef.current.value = '';
  }, [resetUpload]);

  // edit -> форма
  const startEdit = useCallback((r: Row) => {
    setEditingId(r.id);
    setForm({
      title: typeof r.title === 'string' ? { ua: r.title, en: r.title } : (r.title as L10n<string>),
      excerpt:
        typeof r.excerpt === 'string'
          ? { ua: r.excerpt || '', en: r.excerpt || '' }
          : ((r.excerpt as L10n<string>) || { ua: '', en: '' }),
      image: r.image || '',
      date: r.dateYMD || '',
      categoryKey: r.categoryKey || '',
      featured: r.featured,
    });
    setImageFile(null);
    setPreviewUrl(r.image || '');
    setActiveLang('ua');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // delete
  const onDelete = useCallback(
    async (id: string) => {
      if (!confirm('Удалить новость?')) return;
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
        setError(err?.message || 'Не удалось сохранить.');
      }
    },
    [form, imageFile, uploadImage, addOrUpdate, editingId, user?.email, loadRows, resetForm]
  );

  return {
    // внешние для страницы
    rows,
    loading,
    lang,

    // форма
    activeLang,
    setActiveLang,
    form,
    setForm,
    editingId,
    error,
    uploading,
    progress,

    // поля формы
    setTitle,
    onQuillChange,

    // файл
    fileKey,
    fileRef,
    previewUrl,
    onImageInputClick,
    onImageChange,
    clearImage,

    // сабмит/удаление/редактирование
    onSubmit,
    startEdit,
    onDelete,

    // утилиты
    resetForm,
  };
}
