import React from 'react';
import { useCreateNewsLogic, langs } from '../hooks/useCreateNews';
import { CreateNewsForm } from '../components/news/CreateNewsForm';
import { NewsTable } from '../components/NewsTable';
import { Lang } from '../hooks/useNews';

const CreateNewsPage: React.FC = () => {
  const l = useCreateNewsLogic();

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-white shadow-md mt-10 rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6">
        {l.editingId ? 'Edit News' : 'Create News'}
      </h2>

      <CreateNewsForm
        langs={langs}
        activeLang={l.activeLang}
        setActiveLang={l.setActiveLang}
        form={l.form as any}
        editingId={l.editingId}
        error={l.error}
        uploading={l.uploading}
        progress={l.progress}
        setTitle={l.setTitle}
        onQuillChange={l.onQuillChange}
        onSubmit={l.onSubmit}
        fileKey={l.fileKey}
        fileRef={l.fileRef}
        previewUrl={l.previewUrl}
        onImageInputClick={l.onImageInputClick}
        onImageChange={l.onImageChange}
        clearImage={l.clearImage}
        setForm={l.setForm}
        resetForm={l.resetForm}
      />

      <h3 className="text-2xl font-semibold mt-10 mb-4">Existing news</h3>
      <NewsTable
        rows={l.rows}
        lang={l.lang as Lang}
        loading={l.loading}
        onEdit={l.startEdit}
        onDelete={l.onDelete}
      />
    </div>
  );
};

export default CreateNewsPage;
