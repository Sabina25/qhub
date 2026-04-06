import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Lang } from '../../types/l10n';
import { ProjectForm } from '../../hooks/useProjectForm';

const DRAFT_KEY = 'project-draft';

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  },
  clipboard: { matchVisual: false },
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'align', 'color', 'background', 'link',
];

const LANGS: Lang[] = ['ua', 'en'];

export type ProjectFormUIProps = {
  activeLang: Lang;
  setActiveLang: (l: Lang) => void;
  form: ProjectForm;
  editingId: string | null;
  error: string | null;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setTitle: (l: Lang, v: string) => void;
  setLocation: (l: Lang, v: string) => void;
  setDesc: (l: Lang, html: string) => void;
  setField: <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => void;
  setDateSingle: (ymd: string) => void;
  setDateStart: (ymd: string) => void;
  setDateEnd: (ymd: string) => void;
  coverPreview: string;
  galleryPreviews: string[];
  coverKey: number;
  galleryKey: number;
  coverRef: React.RefObject<HTMLInputElement>;
  galleryRef: React.RefObject<HTMLInputElement>;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverInputClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  onGalleryInputClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  clearCover: () => void;
  clearGallery: () => void;
  setYouTubeUrl: (i: number, v: string) => void;
  addVideoField: () => void;
  removeVideoField: (i: number) => void;
  resetForm: () => void;
};

export const ProjectFormUI: React.FC<ProjectFormUIProps> = (p) => {
  const lang = p.activeLang;
  const hasSingle = !!p.form.dateYMD;
  const hasRange  = !!(p.form.dateStartYMD || p.form.dateEndYMD);

  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftRestored,   setDraftRestored]   = useState(false);

  // ── Validation ──
  const isLangComplete = (l: Lang) =>
    !!(p.form.title[l]?.trim() && p.form.descriptionHtml[l]?.replace(/<[^>]*>/g, '').trim());
  const isLangPartial = (l: Lang) =>
    !!(p.form.title[l]?.trim() || p.form.descriptionHtml[l]?.replace(/<[^>]*>/g, '').trim());
  const allComplete = LANGS.every(isLangComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomplete = LANGS.filter(l => !isLangComplete(l));
    if (incomplete.length > 0) {
      const names = incomplete.map(l => l.toUpperCase()).join(' and ');
      alert(`Please fill in title and description for: ${names}`);
      p.setActiveLang(incomplete[0]);
      return;
    }
    p.onSubmit(e);
  };

  // ── Autosave ──
  useEffect(() => {
    if (p.editingId) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(p.form)); }
    catch { /* ignore */ }
  }, [p.form, p.editingId]);

  // ── Check for draft ──
  useEffect(() => {
    if (p.editingId || draftRestored) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      const hasContent = draft?.title?.ua || draft?.title?.en;
      if (hasContent) setShowDraftBanner(true);
    } catch { /* ignore */ }
  }, []);

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      p.setField('title' as any, draft.title);
      p.setField('descriptionHtml' as any, draft.descriptionHtml);
      setDraftRestored(true);
      setShowDraftBanner(false);
    } catch { /* ignore */ }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
  };

  // ── Preview ──
  const openPreview = () => {
    const title = p.form.title[lang] || '—';
    const desc  = p.form.descriptionHtml[lang] || '';
    const image = p.coverPreview || p.form.image || '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Preview: ${title}</title>
      <style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a}
      img{max-width:100%;border-radius:8px;margin-bottom:24px}h1{font-size:2rem;margin-bottom:8px}
      .prose{line-height:1.75;font-size:16px}</style></head><body>
      ${image ? `<img src="${image}" alt="cover"/>` : ''}
      <h1>${title}</h1>
      <div class="prose">${desc}</div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '7px 10px', fontSize: 14 };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 };
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        .pf-grid-3 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .pf-grid-2 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) {
          .pf-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .pf-grid-2 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── Draft banner ── */}
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

      {/* ── Error ── */}
      {p.error && (
        <div style={{ borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', padding: '10px 16px', color: '#dc2626', fontSize: 13 }}>
          {p.error}
        </div>
      )}

      {/* ── Lang tabs ── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {LANGS.map((l) => {
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
        {LANGS.filter(l => !isLangComplete(l)).map(l => (
          <span key={l} style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {l.toUpperCase()} incomplete</span>
        ))}
      </div>

      {/* ── Title ── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Title ({lang.toUpperCase()})</label>
        <input key={`title-${lang}`} value={p.form.title[lang] || ''}
          onChange={e => p.setTitle(lang, e.target.value)}
          style={inputStyle} placeholder={lang === 'ua' ? 'Title in Ukrainian' : 'Title'} required />
        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>
          {p.form.title[lang]?.length ?? 0} chars
        </p>
      </div>

      {/* ── Location ── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Location ({lang.toUpperCase()})</label>
        <input key={`location-${lang}`} value={p.form.location?.[lang] || ''}
          onChange={e => p.setLocation(lang, e.target.value)}
          style={inputStyle} placeholder={lang === 'ua' ? 'Kyiv, Ukraine' : 'Kyiv, Ukraine'} />
      </div>

      {/* ── Dates ── */}
      <div className="pf-grid-3">
        <div style={sectionStyle}>
          <label style={labelStyle}>Date (single)</label>
          <input type="date" value={p.form.dateYMD || ''} onChange={e => p.setDateSingle(e.target.value)}
            style={{ ...inputStyle, opacity: hasRange ? 0.4 : 1 }} disabled={hasRange} />
          <p style={{ fontSize: 11, color: '#9ca3af' }}>or use range below</p>
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle}>Period start</label>
          <input type="date" value={p.form.dateStartYMD || ''} onChange={e => p.setDateStart(e.target.value)}
            style={{ ...inputStyle, opacity: hasSingle ? 0.4 : 1 }} disabled={hasSingle} />
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle}>Period end</label>
          <input type="date" value={p.form.dateEndYMD || ''} onChange={e => p.setDateEnd(e.target.value)}
            style={{ ...inputStyle, opacity: hasSingle ? 0.4 : 1 }} disabled={hasSingle} />
        </div>
      </div>

      {/* ── Description ── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Description ({lang.toUpperCase()})</label>
        <ReactQuill key={`desc-${lang}`} theme="snow"
          value={p.form.descriptionHtml[lang] || ''}
          onChange={html => p.setDesc(lang, html)}
          modules={quillModules as any} formats={quillFormats}
          className="bg-white rounded" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>Links will be saved and remain clickable.</p>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>
            {p.form.descriptionHtml[lang]?.replace(/<[^>]*>/g, '').length ?? 0} chars
          </p>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="pf-grid-2">
        {/* Cover */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Cover image</label>
          <input key={p.coverKey} ref={p.coverRef} type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={p.onCoverChange} onClick={p.onCoverInputClick}
            style={{ fontSize: 13 }}
            {...(p.form.image ? {} : { required: true })} />
          {(p.coverPreview || p.form.image) && (
            <div style={{ marginTop: 10 }}>
              <img src={p.coverPreview || p.form.image} alt="cover"
                style={{ maxHeight: 180, borderRadius: 8, border: '1px solid #e5e7eb', objectFit: 'contain' }} />
              <button type="button" onClick={p.clearCover}
                style={{ marginTop: 8, padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#fff' }}>
                Clear cover
              </button>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Gallery (multiple)</label>
          <input key={p.galleryKey} ref={p.galleryRef} type="file"
            accept="image/jpeg,image/png,image/webp" multiple
            onChange={p.onGalleryChange} onClick={p.onGalleryInputClick}
            style={{ fontSize: 13 }} />
          {(p.galleryPreviews.length > 0 || (p.form.gallery || []).length > 0) && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {(p.galleryPreviews.length ? p.galleryPreviews : p.form.gallery).map((src, i) => (
                  <img key={i} src={src} style={{ height: 80, width: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                ))}
              </div>
              <button type="button" onClick={p.clearGallery}
                style={{ marginTop: 8, padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: '#fff' }}>
                Clear gallery
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── YouTube ── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>YouTube URLs</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.form.youtubeUrls.map((u, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input value={u} onChange={e => p.setYouTubeUrl(i, e.target.value)}
                placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                style={{ ...inputStyle, flex: 1 }} />
              {p.form.youtubeUrls.length > 1 && (
                <button type="button" onClick={() => p.removeVideoField(i)}
                  style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', background: '#fff', fontSize: 16, lineHeight: 1 }}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={p.addVideoField}
          style={{ marginTop: 6, alignSelf: 'flex-start', padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: '#fff' }}>
          + Add video
        </button>
      </div>

      {/* ── Featured ── */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={p.form.featured}
          onChange={e => p.setField('featured', e.target.checked)} />
        Featured
      </label>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="submit" disabled={p.uploading || !allComplete}
          title={!allComplete ? 'Fill in both languages before saving' : ''}
          style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: (p.uploading || !allComplete) ? '#86efac' : '#16a34a', color: '#fff', fontSize: 15, fontWeight: 600, cursor: (p.uploading || !allComplete) ? 'not-allowed' : 'pointer', opacity: !allComplete ? 0.6 : 1 }}>
          {p.uploading ? 'Saving…' : p.editingId ? 'Save changes' : 'Create project'}
        </button>

        <button type="button" onClick={openPreview}
          style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 14, cursor: 'pointer' }}>
          👁 Preview
        </button>

        {p.editingId && (
          <button type="button" onClick={p.resetForm}
            style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 14, cursor: 'pointer' }}>
            Cancel edit
          </button>
        )}

        {!p.editingId && (
          <button type="button"
            onClick={() => { p.resetForm(); localStorage.removeItem(DRAFT_KEY); }}
            style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 14, cursor: 'pointer', color: '#6b7280' }}>
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
