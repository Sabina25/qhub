import { useCallback, useEffect, useRef, useState } from 'react';
import { L10n, Lang, LinkRef } from '../types/l10n';
import { ProjectDoc } from '../data/projects';

export type ProjectForm = Omit<ProjectDoc,
  'title' | 'descriptionHtml' | 'descriptionLinks' | 'location'
> & {
  title: L10n<string>;
  descriptionHtml: L10n<string>;
  descriptionLinks: L10n<LinkRef[]>;
  location?: L10n<string>;
};

export const defaultForm: ProjectForm = {
  title: { ua: '', en: '' },
  descriptionHtml: { ua: '', en: '' },
  descriptionLinks: { ua: [], en: [] },
  image: '',
  gallery: [],
  dateYMD: '',
  dateStartYMD: '',
  dateEndYMD: '',
  location: { ua: '', en: '' },
  youtubeUrls: [''],
  featured: false,
};

const MAX_FILE_MB = 15;

// ---- helpers for safe cloning ----
function cloneL10nString(src?: L10n<string> | string): L10n<string> {
  if (!src) return { ua: '', en: '' };
  if (typeof src === 'string') return { ua: src, en: src };
  return { ua: src.ua ?? '', en: src.en ?? '' };
}
function cloneL10nLinks(src?: L10n<LinkRef[]> | LinkRef[]): L10n<LinkRef[]> {
  if (!src) return { ua: [], en: [] };
  if (Array.isArray(src)) return { ua: [...src], en: [...src] };
  return {
    ua: Array.isArray(src.ua) ? [...src.ua] : [],
    en: Array.isArray(src.en) ? [...src.en] : [],
  };
}
function cloneArray<T>(a?: T[]): T[] { return Array.isArray(a) ? [...a] : []; }
function cloneFormBase(): ProjectForm { return JSON.parse(JSON.stringify(defaultForm)); }

export function useProjectForm() {
  const [activeLang, setActiveLang] = useState<Lang>('ua');
  const [form, setForm] = useState<ProjectForm>(cloneFormBase());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // files
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [coverPreview, setCoverPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const coverRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  const [coverKey, setCoverKey] = useState(0);
  const [galleryKey, setGalleryKey] = useState(0);

  const lastGalleryUrlsRef = useRef<string[]>([]);

  // ------- helpers -------
  const fileErr = (msg: string) => {
    setError(msg);
    setTimeout(() => setError((e) => (e === msg ? null : e)), 3000);
  };

  const isImage = (f: File) => f.type.startsWith('image/');
  const isOkSize = (f: File) => f.size <= MAX_FILE_MB * 1024 * 1024;

  // ------- effects: previews -------
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview('');
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    lastGalleryUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    lastGalleryUrlsRef.current = [];

    if (!galleryFiles.length) {
      setGalleryPreviews([]);
      return;
    }
    const urls = galleryFiles.map((f) => URL.createObjectURL(f));
    lastGalleryUrlsRef.current = urls;
    setGalleryPreviews(urls);

    return () => {
      lastGalleryUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      lastGalleryUrlsRef.current = [];
    };
  }, [galleryFiles]);

  // ------- setters -------
  const setField = useCallback(<K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  }, []);

  const setTitle = useCallback((lang: Lang, v: string) => {
    setForm((p) => ({ ...p, title: { ...p.title, [lang]: v } }));
  }, []);

  const setLocation = useCallback((lang: Lang, v: string) => {
    setForm((p) => ({ ...p, location: { ...(p.location || { ua: '', en: '' }), [lang]: v } }));
  }, []);

  const setDesc = useCallback((lang: Lang, html: string) => {
    setForm((p) => ({ ...p, descriptionHtml: { ...p.descriptionHtml, [lang]: html } }));
  }, []);

  const setDateSingle = useCallback((ymd: string) => {
    setForm((p) => ({
      ...p,
      dateYMD: ymd,
      dateStartYMD: ymd ? '' : p.dateStartYMD,
      dateEndYMD: ymd ? '' : p.dateEndYMD,
    }));
  }, []);

  const setDateStart = useCallback((ymd: string) => {
    setForm((p) => ({
      ...p,
      dateStartYMD: ymd,
      dateYMD: ymd ? '' : p.dateYMD,
    }));
  }, []);

  const setDateEnd = useCallback((ymd: string) => {
    setForm((p) => ({
      ...p,
      dateEndYMD: ymd,
      dateYMD: ymd ? '' : p.dateYMD,
    }));
  }, []);

  // ------- youtube (без гонок состояния) -------
  const setYouTubeUrl = (i: number, val: string) => {
    setForm(prev => {
      const arr = [...prev.youtubeUrls];
      arr[i] = val;
      return { ...prev, youtubeUrls: arr };
    });
  };
  const addVideoField = () => {
    setForm(prev => ({ ...prev, youtubeUrls: [...prev.youtubeUrls, ''] }));
  };
  const removeVideoField = (i: number) => {
    setForm(prev => ({ ...prev, youtubeUrls: prev.youtubeUrls.filter((_, idx) => idx !== i) }));
  };

  // ------- files handlers -------
  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      if (!isImage(f)) return fileErr('Выберите файл изображения (jpg, png, webp).');
      if (!isOkSize(f)) return fileErr(`Слишком большой файл (>${MAX_FILE_MB}MB).`);
    }
    setCoverFile(f);
  };

  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const badType = files.find((f) => !isImage(f));
    if (badType) return fileErr('Галерея: только изображения (jpg, png, webp).');
    const badSize = files.find((f) => !isOkSize(f));
    if (badSize) return fileErr(`Галерея: один из файлов больше ${MAX_FILE_MB}MB.`);
    setGalleryFiles(files);
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview('');
    if (coverRef.current) coverRef.current.value = '';
    setCoverKey((k) => k + 1);
    setField('image', '');
  };

  const clearGallery = () => {
    setGalleryFiles([]);
    setGalleryPreviews([]);
    if (galleryRef.current) galleryRef.current.value = '';
    setGalleryKey((k) => k + 1);
    setField('gallery', []);
  };

  // ------- flow -------
  const resetForm = useCallback(() => {
    setForm(cloneFormBase());
    setEditingId(null);
    setError(null);
    setActiveLang('ua');
    clearCover();
    clearGallery();
  }, []);

  const startEdit = (row: any) => {
    setEditingId(row.id);

    const title = cloneL10nString(row.title);
    const descriptionHtml = cloneL10nString(row.descriptionHtml);
    const descriptionLinks = cloneL10nLinks(row.descriptionLinks);
    const location = cloneL10nString(row.location);

    setForm({
      ...cloneFormBase(),
      title,
      descriptionHtml,
      descriptionLinks,
      image: row.image || '',
      gallery: cloneArray(row.gallery),
      dateYMD: row.dateYMD || '',
      dateStartYMD: row.dateStartYMD || '',
      dateEndYMD: row.dateEndYMD || '',
      location,
      youtubeUrls: Array.isArray(row.youtubeUrls) && row.youtubeUrls.length ? [...row.youtubeUrls] : [''],
      featured: !!row.featured,
    });

    setCoverFile(null);
    setGalleryFiles([]);
    setCoverPreview(row.image || '');
    setGalleryPreviews([]);
    if (coverRef.current) coverRef.current.value = '';
    if (galleryRef.current) galleryRef.current.value = '';
    setCoverKey((k) => k + 1);
    setGalleryKey((k) => k + 1);

    setActiveLang('ua');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCoverInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = '';
  };
  const onGalleryInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = '';
  };

  // ------- public API -------
  return {
    // state
    activeLang, form, editingId, error, uploading,
    coverPreview, galleryPreviews, coverKey, galleryKey,
    coverRef, galleryRef,

    // setters
    setActiveLang, setField, setTitle, setLocation, setDesc,
    setYouTubeUrl, addVideoField, removeVideoField,
    setError, setUploading,
    setDateSingle, setDateStart, setDateEnd,

    // files
    onCoverChange, onGalleryChange, clearCover, clearGallery,
    onCoverInputClick, onGalleryInputClick,

    // flow
    resetForm, startEdit,
  };
}
