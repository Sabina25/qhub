// src/components/news/CreateNewsForm.tsx
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Lang } from '../../hooks/useNews';
import { quillFormats, buildQuillModules } from '../../utils/editor';

const modules = buildQuillModules();

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

  // inputs
  setTitle: (l: Lang, v: string) => void;

  /** IMPORTANT: bind by language to avoid cross-language overwrites */
  onQuillChange: (l: Lang, html: string) => void;
  onSubmit: (e: React.FormEvent) => void;

  // image
  fileKey: number;
  fileRef: React.RefObject<HTMLInputElement>;
  previewUrl: string;
  onImageInputClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;

  // other fields
  setForm: React.Dispatch<React.SetStateAction<any>>;
  resetForm: () => void;
};

export const CreateNewsForm: React.FC<CreateNewsFormProps> = (p) => {
  const lang = p.activeLang;

  return (
    <form onSubmit={p.onSubmit} className="space-y-6">
      {p.error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">
          {p.error}
        </div>
      )}

      {/* Lang tabs */}
      <div className="mb-4 flex gap-2">
        {p.langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => p.setActiveLang(l)}
            className={`px-3 py-1 rounded ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block mb-2 font-medium">Title ({lang.toUpperCase()})</label>
        <input
          key={`title-${lang}`}                  
          value={p.form.title[lang] || ''}
          onChange={(e) => p.setTitle(lang, e.target.value)}  
          className="w-full border p-2 rounded"
          placeholder={lang === 'ua' ? 'Title in Ukrainian' : 'Title'}
          minLength={3}
          required
        />
      </div>

      {/* Image */}
      <div>
        <label className="block mb-2 font-medium">Image</label>
        <input
          key={p.fileKey}
          ref={p.fileRef}
          type="file"
          accept="image/*"
          onClick={p.onImageInputClick}
          onChange={p.onImageChange}
          className="w-full"
          {...(p.editingId ? {} : { required: true })}
        />
        {(p.previewUrl || p.form.image) && (
          <div className="mt-3 space-y-3">
            <img
              src={p.previewUrl || p.form.image}
              alt="Preview"
              className="max-h-56 rounded-lg border object-contain"
            />
            <button
              type="button"
              onClick={p.clearImage}
              className="border px-3 py-1 rounded hover:bg-gray-50 text-sm"
            >
              Clear image
            </button>
          </div>
        )}
      </div>

      {/* Date & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Date</label>
          <input
            type="date"
            value={p.form.date}
            onChange={(e) => p.setForm((prev: any) => ({ ...prev, date: e.target.value }))}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Category key</label>
          <input
            value={p.form.categoryKey}
            onChange={(e) => p.setForm((prev: any) => ({ ...prev, categoryKey: e.target.value }))}
            className="w-full border p-2 rounded"
            placeholder="e.g. projects"
            required
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block mb-2 font-medium">Content ({lang.toUpperCase()})</label>
        <ReactQuill
          key={`excerpt-${lang}`}                 
          theme="snow"
          value={p.form.excerpt[lang] || ''}
          onChange={(html) => p.onQuillChange(lang, html)}  
          className="bg-white rounded"
          modules={modules}
          formats={quillFormats}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: select text → “link” button → paste URL (https://…).
        </p>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={p.form.featured}
          onChange={(e) => p.setForm((prev: any) => ({ ...prev, featured: e.target.checked }))}
        />
        Featured
      </label>

      {/* Progress */}
      {p.uploading && (
        <div className="w-full">
          <div className="mb-2 text-sm text-gray-600">Uploading: {p.progress}%</div>
          <div className="h-2 w-full rounded bg-gray-200">
            <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={p.uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {p.editingId ? 'Save' : 'Create'}
        </button>
        {p.editingId && (
          <button
            type="button"
            onClick={p.resetForm}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
};
