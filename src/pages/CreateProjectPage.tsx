import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectDoc } from '../data/projects';
import { sanitizeAndEnhance, extractLinks } from '../utils/html';
import { uploadFile, uploadFiles } from '../services/storage';
import { ProjectForm, useProjectForm } from '../hooks/useProjectForm';
import { ProjectFormUI } from '../components/admin/ProjectForm';
import { ProjectsTable } from '../components/admin/ProjectsTable';

const PREFIX = 'projects';

const CreateProjectPage: React.FC = () => {
  const { rows, loading, loadRows, addOrUpdate, remove } = useProjects();
  const f = useProjectForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    f.setError(null);

    const anyTitle = (f.form.title.ua || f.form.title.en).trim();
    if (!anyTitle) { f.setError('Please enter a title (UA or EN).'); return; }

    const hasSingle = !!f.form.dateYMD;
    const hasRange = !!(f.form.dateStartYMD || f.form.dateEndYMD);
    if (hasSingle && hasRange) {
      f.setError('Specify either a single date or a period — not both.');
      return;
    }

    try {
      f.setUploading(true);

      // cover
      let imageUrl = f.form.image;
      if (f.coverRef.current?.files?.[0]) {
        imageUrl = await uploadFile(PREFIX, f.coverRef.current.files[0]);
      }

      // gallery
      let galleryUrls = f.form.gallery || [];
      if (f.galleryRef.current?.files?.length) {
        galleryUrls = await uploadFiles(PREFIX, Array.from(f.galleryRef.current.files));
      }

      const descUA = sanitizeAndEnhance(f.form.descriptionHtml.ua || '');
      const descEN = sanitizeAndEnhance(f.form.descriptionHtml.en || '');
      const linksUA = extractLinks(descUA);
      const linksEN = extractLinks(descEN);

      const youtubeUrls = (f.form.youtubeUrls || []).map(s => s.trim()).filter(Boolean);

      const payload: Omit<ProjectDoc, 'id'> & Record<string, any> = {
        ...f.form,
        image: imageUrl,
        gallery: galleryUrls,
        descriptionHtml: { ua: descUA, en: descEN },
        descriptionLinks: { ua: linksUA, en: linksEN },
        youtubeUrls,
      };

      const { id: _omit, ...clean } = payload;

      await addOrUpdate(clean, f.editingId ? { editingId: f.editingId } : undefined);

      await loadRows();
      f.resetForm();
    } catch (err: any) {
      console.error(err);
      f.setError(err?.message || 'Failed to save.');
    } finally {
      f.setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 bg-white shadow-md mt-10 rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6">
        {f.editingId ? 'Edit Project' : 'Create Project'}
      </h2>

      <ProjectFormUI
        activeLang={f.activeLang}
        setActiveLang={f.setActiveLang}
        form={f.form}
        editingId={f.editingId}
        error={f.error}
        uploading={f.uploading}
        onSubmit={onSubmit}
        setTitle={f.setTitle}
        setLocation={f.setLocation}
        setDesc={f.setDesc}
        setField={f.setField}
        setDateSingle={f.setDateSingle}
        setDateStart={f.setDateStart}
        setDateEnd={f.setDateEnd}
        coverPreview={f.coverPreview}
        galleryPreviews={f.galleryPreviews}
        coverKey={f.coverKey}
        galleryKey={f.galleryKey}
        coverRef={f.coverRef}
        galleryRef={f.galleryRef}
        onCoverChange={f.onCoverChange}
        onGalleryChange={f.onGalleryChange}
        onCoverInputClick={f.onCoverInputClick}
        onGalleryInputClick={f.onGalleryInputClick}
        clearCover={f.clearCover}
        clearGallery={f.clearGallery}
        setYouTubeUrl={f.setYouTubeUrl}
        addVideoField={f.addVideoField}
        removeVideoField={f.removeVideoField}
        resetForm={f.resetForm}
      />

      <ProjectsTable
        rows={rows}
        loading={loading}
        onEdit={(row) => {
          f.startEdit(row);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={async (id) => {
          if (!confirm('Delete this project?')) return;
          await remove(id);
          await loadRows();
          if (f.editingId === id) f.resetForm();
        }}
      />
    </div>
  );
};

export default CreateProjectPage;
