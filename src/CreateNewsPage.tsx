import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from './data/events';

const CreateNews = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    image: '',
    date: '',
    category: '',
    featured: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...form,
    };
    addEvent(newEvent);
    navigate('/events');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md mt-10 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Create News</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="excerpt"
          placeholder="Excerpt (HTML allowed)"
          value={form.excerpt}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
