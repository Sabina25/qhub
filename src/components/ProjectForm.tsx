import React from 'react';
import ReactQuill from 'react-quill';
import { Lang } from '../types/l10n';
import { ProjectForm } from '../hooks/useProjectForm';

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
  'header','bold','italic','underline','strike','blockquote',
  'list','bullet','indent','align','color','background','link',
];

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

  // даты (удобные)
  setDateSingle: (ymd: string) => void;
  setDateStart: (ymd: string) => void;
  setDateEnd: (ymd: string) => void;

  // images
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

  // videos
  setYouTubeUrl: (i: number, v: string) => void;
  addVideoField: () => void;
  removeVideoField: (i: number) => void;
  resetForm: () => void;
};

const langs: Lang[] = ['ua', 'en'];

export const ProjectFormUI: React.FC<ProjectFormUIProps> = (p) => {
  const hasSingle = !!p.form.dateYMD;
  const hasRange = !!(p.form.dateStartYMD || p.form.dateEndYMD);

  return (
    <form onSubmit={p.onSubmit} className="space-y-6">
      {p.error && (
        <div className="mb-2 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">{p.error}</div>
      )}

      {/* tabs */}
      <div className="mb-2 flex gap-2">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => p.setActiveLang(l)}
            className={`px-3 py-1 rounded ${p.activeLang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block mb-2 font-medium">Title ({p.activeLang.toUpperCase()})</label>
        <input
          value={p.form.title[p.activeLang]}
          onChange={(e) => p.setTitle(p.activeLang, e.target.value)}
          className="w-full border p-2 rounded"
          placeholder={p.activeLang === 'ua' ? 'Заголовок' : 'Title'}
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block mb-2 font-medium">Location ({p.activeLang.toUpperCase()})</label>
        <input
          value={p.form.location?.[p.activeLang] || ''}
          onChange={(e) => p.setLocation(p.activeLang, e.target.value)}
          className="w-full border p-2 rounded"
          placeholder={p.activeLang === 'ua' ? 'Київ, Україна' : 'Kyiv, Ukraine'}
        />
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 font-medium">Date (single)</label>
          <input
            type="date"
            value={p.form.dateYMD || ''}
            onChange={(e) => p.setDateSingle(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={hasRange}
          />
          <p className="text-xs text-gray-500 mt-1">или используй период ниже</p>
        </div>
        <div>
          <label className="block mb-2 font-medium">Period start</label>
          <input
            type="date"
            value={p.form.dateStartYMD || ''}
            onChange={(e) => p.setDateStart(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={hasSingle}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Period end</label>
          <input
            type="date"
            value={p.form.dateEndYMD || ''}
            onChange={(e) => p.setDateEnd(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={hasSingle}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium">Description ({p.activeLang.toUpperCase()})</label>
        <ReactQuill
          theme="snow"
          value={p.form.descriptionHtml[p.activeLang]}
          onChange={(html) => p.setDesc(p.activeLang, html)}
          modules={quillModules as any}
          formats={quillFormats}
          className="bg-white rounded"
        />
        <p className="text-xs text-gray-500 mt-1">Ссылки сохранятся и будут кликабельны.</p>
      </div>

      {/* Images */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Cover image</label>
          <input
            key={p.coverKey}
            ref={p.coverRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={p.onCoverChange}
            onClick={p.onCoverInputClick}
            className="w-full"
            {...(p.form.image ? {} : { required: true })}
          />
          {(p.coverPreview || p.form.image) && (
            <div className="mt-3">
              <img
                src={p.coverPreview || p.form.image}
                alt="cover"
                className="max-h-56 rounded border object-contain"
              />
              <div className="mt-2 flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={p.clearCover}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Clear cover
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Gallery (multiple)</label>
          <input
            key={p.galleryKey}
            ref={p.galleryRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={p.onGalleryChange}
            onClick={p.onGalleryInputClick}
            className="w-full"
          />
          {(p.galleryPreviews.length > 0 || (p.form.gallery || []).length > 0) && (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(p.galleryPreviews.length ? p.galleryPreviews : p.form.gallery).map((src, i) => (
                  <img key={i} src={src} className="h-24 w-full object-cover rounded border" />
                ))}
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={p.clearGallery}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Clear gallery
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* YouTube */}
      <div>
        <label className="block mb-2 font-medium">YouTube URLs</label>
        <div className="space-y-2">
          {p.form.youtubeUrls.map((u, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={u}
                onChange={(e) => p.setYouTubeUrl(i, e.target.value)}
                placeholder="https://youtu.be/... или https://www.youtube.com/watch?v=..."
                className="flex-1 border rounded px-3 py-2"
              />
              {p.form.youtubeUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => p.removeVideoField(i)}
                  className="px-3 py-2 border rounded hover:bg-gray-50"
                  aria-label="Remove video URL"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={p.addVideoField}
          className="mt-2 text-sm px-3 py-1 rounded border hover:bg-gray-50"
        >
          + Add video
        </button>
      </div>

      {/* Featured & actions */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={p.form.featured}
          onChange={(e) => p.setField('featured', e.target.checked)}
        />
        Featured
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={p.uploading}
          className="bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-700 disabled:opacity-60"
        >
          {p.uploading ? 'Saving…' : p.editingId ? 'Save changes' : 'Create Project'}
        </button>
        {p.editingId && (
          <button
            type="button"
            className="border px-6 py-3 rounded hover:bg-gray-50"
            onClick={p.resetForm}
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
};
