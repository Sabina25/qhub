import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectDoc } from '../data/projects';
import { sanitizeAndEnhance, extractLinks } from '../utils/html';
import { uploadFile, uploadFiles } from '../services/storage';
import { ProjectForm, useProjectForm } from '../hooks/useProjectForm';
import { ProjectFormUI } from '../components/ProjectForm';
import { ProjectsTable } from '../components/ProjectsTable';

const PREFIX = 'projects';

const CreateProjectPage: React.FC = () => {
  const { rows, loading, loadRows, addOrUpdate, remove } = useProjects();
  const f = useProjectForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    f.setError(null);

    const anyTitle = (f.form.title.ua || f.form.title.en).trim();
    if (!anyTitle) { f.setError('Введите заголовок (UA или EN)'); return; }

    // взаимоисключающие даты
    const hasSingle = !!f.form.dateYMD;
    const hasRange = !!(f.form.dateStartYMD || f.form.dateEndYMD);
    if (hasSingle && hasRange) {
      f.setError('Укажи либо одну дату, либо период — не оба сразу.');
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

      // sanitize + extract links по обеим локалям
      const descUA = sanitizeAndEnhance(f.form.descriptionHtml.ua || '');
      const descEN = sanitizeAndEnhance(f.form.descriptionHtml.en || '');
      const linksUA = extractLinks(descUA);
      const linksEN = extractLinks(descEN);

      // нормализуем видео (убираем пустые строки)
      const youtubeUrls = (f.form.youtubeUrls || []).map(s => s.trim()).filter(Boolean);

      // собираем payload без client-side id/timestamps (пусть их добавляет сервис в useProjects)
      const payload: Omit<ProjectDoc, 'id'> & Record<string, any> = {
        ...f.form,
        image: imageUrl,
        gallery: galleryUrls,
        descriptionHtml: { ua: descUA, en: descEN },
        descriptionLinks: { ua: linksUA, en: linksEN },
        youtubeUrls,
      };

      // на всякий случай выкидываем возможный id из формы
      const { id: _omit, ...clean } = payload;

      await addOrUpdate(clean, f.editingId ? { editingId: f.editingId } : undefined);

      await loadRows();
      f.resetForm();
    } catch (err: any) {
      console.error(err);
      f.setError(err?.message || 'Failed to save');
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

        // новые удобные сеттеры дат из хука
        setDateSingle={f.setDateSingle}
        setDateStart={f.setDateStart}
        setDateEnd={f.setDateEnd}

        // images
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

        // videos
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
          if (!confirm('Удалить проект?')) return;
          await remove(id);
          await loadRows();
          if (f.editingId === id) f.resetForm();
        }}
      />
    </div>
  );
};

export default CreateProjectPage;
