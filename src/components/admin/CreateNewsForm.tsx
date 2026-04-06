import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Lang } from '../../hooks/useNews';
import { quillFormats, buildQuillModules } from '../../utils/editor';

const modules = buildQuillModules();
const DRAFT_KEY = 'news-draft';

export type CreateNewsFormProps = {
  langs: Lang[];
  activeLang: Lang;
  setActiveLang: (l: Lang) => void;
  form: {
    title: Record<Lang, string>;
    excerpt: Record<Lang, string>;
    image: string;
    date: string;
    categoryKey: string;
    featured: boolean;
  };
  editingId: string | null;
  error: string | null;
  uploading: boolean;
  progress: number;
  setTitle: (l: Lang, v: string) => void;
  onQuillChange: (l: Lang, html: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  fileKey: number;
  fileRef: React.RefObject<HTMLInputElement>;
  previewUrl: string;
  onImageInputClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  resetForm: () => void;
};

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #d1d5db',
  borderRadius: 6, padding: '7px 10px', fontSize: 14,
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14,
};
const btnBase: React.CSSProperties = {
  padding: '8px 18px', borderRadius: 8, border: '1px solid #d1d5db',
  background: '#fff', fontSize: 14, cursor: 'pointer',
};

export const CreateNewsForm: React.FC<CreateNewsFormProps> = (p) => {
  const lang = p.activeLang;
  const [draftRestored,   setDraftRestored]   = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const isLangComplete = (l: Lang) =>
    !!(p.form.title[l]?.trim() && p.form.excerpt[l]?.replace(/<[^>]*>/g, '').trim());
  const isLangPartial = (l: Lang) =>
    !!(p.form.title[l]?.trim() || p.form.excerpt[l]?.replace(/<[^>]*>/g, '').trim());
  const allComplete = p.langs.every(isLangComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomplete = p.langs.filter(l => !isLangComplete(l));
    if (incomplete.length > 0) {
      alert(`Please fill in title and content for: ${incomplete.map(l => l.toUpperCase()).join(' and ')}`);
      p.setActiveLang(incomplete[0]);
      return;
    }
    p.onSubmit(e);
  };

  // Autosave
  useEffect(() => {
    if (p.editingId) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(p.form)); } catch { /* ignore */ }
  }, [p.form, p.editingId]);

  // Check draft
  useEffect(() => {
    if (p.editingId || draftRestored) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d?.title?.ua || d?.title?.en || d?.excerpt?.ua || d?.excerpt?.en)
        setShowDraftBanner(true);
    } catch { /* ignore */ }
  }, []);

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      p.setForm((prev: any) => ({ ...prev, ...draft }));
      setDraftRestored(true);
      setShowDraftBanner(false);
    } catch { /* ignore */ }
  };

  const discardDraft = () => { localStorage.removeItem(DRAFT_KEY); setShowDraftBanner(false); };

  const openPreview = () => {
    const title   = p.form.title[lang] || '—';
    const excerpt = p.form.excerpt[lang] || '';
    const image   = p.previewUrl || p.form.image || '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Preview: ${title}</title>
      <style>body{font-family:sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1a1a1a}
      img{max-width:100%;border-radius:8px;margin-bottom:24px}h1{font-size:2rem;margin-bottom:8px}
      .meta{color:#666;font-size:14px;margin-bottom:24px}.prose{line-height:1.75;font-size:16px}</style>
      </head><body>
      ${image ? `<img src="${image}" alt="cover"/>` : ''}
      <h1>${title}</h1>
      <div class="meta">${p.form.date} · ${p.form.categoryKey}${p.form.featured ? ' · ⭐ Featured' : ''}</div>
      <div class="prose">${excerpt}</div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        .cnf-grid-2 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .cnf-grid-2 { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* Draft banner */}
      {showDraftBanner && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderRadius: 8, border: '1px solid #fde68a', background: '#fffbeb', padding: '10px 16px', fontSize: 13, color: '#92400e' }}>
          <span>📝 Unsaved draft found. Restore it?</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={restoreDraft}
              style={{ padding: '4px 12px', borderRadius: 6, background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>
              Restore
            </button>
            <button type="button" onClick={discardDraft}
              style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #fde68a', background: '#fff', cursor: 'pointer', fontSize: 12 }}>
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {p.error && (
        <div style={{ borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', padding: '10px 16px', color: '#dc2626', fontSize: 13 }}>
          {p.error}
        </div>
      )}

      {/* Lang tabs */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {p.langs.map((l) => {
          const complete = isLangComplete(l);
          const partial  = isLangPartial(l);
          return (
            <button key={l} type="button" onClick={() => p.setActiveLang(l)}
              style={{ padding: '4px 14px', borderRadius: 6, border: '1px solid', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderColor: lang === l ? '#2563eb' : '#d1d5db', background: lang === l ? '#2563eb' : '#fff', color: lang === l ? '#fff' : '#374151' }}>
              {l.toUpperCase()}
              <span style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block', background: complete ? '#22c55e' : partial ? '#f59e0b' : '#d1d5db' }} />
            </button>
          );
        })}
        {p.langs.filter(l => !isLangComplete(l)).map(l => (
          <span key={l} style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {l.toUpperCase()} incomplete</span>
        ))}
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={labelStyle}>Title ({lang.toUpperCase()})</label>
        <input key={`title-${lang}`} value={p.form.title[lang] || ''}
          onChange={e => p.setTitle(lang, e.target.value)}
          style={inputStyle} placeholder={lang === 'ua' ? 'Title in Ukrainian' : 'Title'}
          minLength={3} required />
        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>
          {p.form.title[lang]?.length ?? 0} chars
        </p>
      </div>

      {/* Image */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={labelStyle}>Image</label>
        <input key={p.fileKey} ref={p.fileRef} type="file" accept="image/*"
          onClick={p.onImageInputClick} onChange={p.onImageChange}
          style={{ fontSize: 13 }}
          {...(p.editingId ? {} : { required: true })} />
        {(p.previewUrl || p.form.image) && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <img src={p.previewUrl || p.form.image} alt="Preview"
              style={{ maxHeight: 180, borderRadius: 8, border: '1px solid #e5e7eb', objectFit: 'contain' }} />
            <button type="button" onClick={p.clearImage}
              style={{ ...btnBase, alignSelf: 'flex-start', fontSize: 13, padding: '4px 12px' }}>
              Clear image
            </button>
          </div>
        )}
      </div>

      {/* Date & Category */}
      <div className="cnf-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={p.form.date}
            onChange={e => p.setForm((prev: any) => ({ ...prev, date: e.target.value }))}
            style={inputStyle} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Category key</label>
          <input value={p.form.categoryKey}
            onChange={e => p.setForm((prev: any) => ({ ...prev, categoryKey: e.target.value }))}
            style={inputStyle} placeholder="e.g. projects" required />
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={labelStyle}>Content ({lang.toUpperCase()})</label>
        <ReactQuill key={`excerpt-${lang}`} theme="snow"
          value={p.form.excerpt[lang] || ''}
          onChange={html => p.onQuillChange(lang, html)}
          className="bg-white rounded"
          modules={modules} formats={quillFormats} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>Tip: select text → "link" → paste URL.</p>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>
            {p.form.excerpt[lang]?.replace(/<[^>]*>/g, '').length ?? 0} chars
          </p>
        </div>
      </div>

      {/* Featured */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={p.form.featured}
          onChange={e => p.setForm((prev: any) => ({ ...prev, featured: e.target.checked }))} />
        Featured
      </label>

      {/* Upload progress */}
      {p.uploading && (
        <div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Uploading: {p.progress}%</p>
          <div style={{ height: 6, width: '100%', borderRadius: 4, background: '#e5e7eb' }}>
            <div style={{ height: '100%', borderRadius: 4, background: '#2563eb', width: `${p.progress}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="submit" disabled={p.uploading || !allComplete}
          title={!allComplete ? 'Fill in both languages before saving' : ''}
          style={{ padding: '8px 22px', borderRadius: 8, border: 'none', background: (p.uploading || !allComplete) ? '#93c5fd' : '#2563eb', color: '#fff', fontSize: 14, fontWeight: 600, cursor: (p.uploading || !allComplete) ? 'not-allowed' : 'pointer', opacity: !allComplete ? 0.6 : 1 }}>
          {p.editingId ? 'Save' : 'Create'}
        </button>

        <button type="button" onClick={openPreview} style={btnBase}>
          👁 Preview
        </button>

        {p.editingId && (
          <button type="button" onClick={p.resetForm} style={btnBase}>Cancel edit</button>
        )}

        {!p.editingId && (
          <button type="button"
            onClick={() => { p.resetForm(); localStorage.removeItem(DRAFT_KEY); }}
            style={{ ...btnBase, color: '#6b7280' }}>
            🗑 Clear
          </button>
        )}
      </div>

      {!p.editingId && (
        <p style={{ fontSize: 11, color: '#9ca3af' }}>💾 Draft is saved automatically</p>
      )}
    </form>
  );
};
