import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addProject } from '../data/projects'; 

const CreateProject = () => {
  const navigate = useNavigate();
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
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVideoChange = (index: number, value: string) => {
    const updatedUrls = [...form.youtubeUrls];
    updatedUrls[index] = value;
    setForm((prev) => ({
      ...prev,
      youtubeUrls: updatedUrls,
    }));
  };

  const addNewVideoField = () => {
    setForm((prev) => ({
      ...prev,
      youtubeUrls: [...prev.youtubeUrls, ''],
    }));
  };

  const removeVideoField = (index: number) => {
    const updatedUrls = form.youtubeUrls.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      youtubeUrls: updatedUrls,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      ...form,
    };
    addProject(newProject);
    navigate('/projects');
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md mt-10 rounded-2xl">
        <h2 className="text-3xl font-semibold mb-8 text-center">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-3 rounded"
            required
          />

          <div className="space-y-4">
            <label className="block font-semibold">YouTube Videos:</label>
            {form.youtubeUrls.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleVideoChange(index, e.target.value)}
                  placeholder="YouTube URL"
                  className="flex-1 border p-2 rounded"
                />
                {form.youtubeUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideoField(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNewVideoField}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add another video
            </button>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-700"
          >
            Create Project
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
