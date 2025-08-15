import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProject } from '../data/projects';

const CreateProject = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: Date.now(),
    title: '',
    description: '',
    image: '',   
    date: '',
    location: '',
    youtubeUrls: [''],
    featured: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
  };

  const handleVideoChange = (index: number, value: string) => {
    const updated = [...form.youtubeUrls];
    updated[index] = value;
    setForm((prev) => ({ ...prev, youtubeUrls: updated }));
  };

  const addNewVideoField = () => setForm((p) => ({ ...p, youtubeUrls: [...p.youtubeUrls, ''] }));
  const removeVideoField = (i: number) =>
    setForm((p) => ({ ...p, youtubeUrls: p.youtubeUrls.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setUploading(true);

      let imageUrl = form.image;
      if (imageFile) {
        // путь в бакете
        const filePath = `projects/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newProject = {
        id: Date.now(),
        ...form,
        image: imageUrl, 
      };

      addProject(newProject);

      alert('Project created successfully');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md mt-10 rounded-2xl">
      <h2 className="text-3xl font-semibold mb-8 text-center">Create Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="title" placeholder="Project Title" value={form.title}
               onChange={handleChange} className="w-full border p-3 rounded" required />

        {/* Загрузка файла вместо URL */}
        <div>
          <label className="block mb-2 font-medium">Project Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" required />
        </div>

        <input name="date" type="date" value={form.date}
               onChange={handleChange} className="w-full border p-3 rounded" required />

        <input name="location" placeholder="Location" value={form.location}
               onChange={handleChange} className="w-full border p-3 rounded" />

        <textarea name="description" placeholder="Description" value={form.description}
                  onChange={handleChange} rows={4} className="w-full border p-3 rounded" required />


        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured
        </label>

        <button type="submit" disabled={uploading}
                className="bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-700 disabled:opacity-60">
          {uploading ? 'Uploading…' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
