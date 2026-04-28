import { useState } from 'react';
import { movieApi } from '../api/movieApi';
import { toast } from 'sonner';

export default function MovieUpload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Action',
    videoUrl: '',
    isExternal: false,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('isExternal', formData.isExternal);
    if (formData.isExternal) {
      data.append('videoUrl', formData.videoUrl);
    } else if (file) {
      data.append('video', file);
    }

    try {
      await movieApi.create(data);
      toast.success('Movie uploaded successfully!');
      setFormData({ title: '', description: '', category: 'Action', videoUrl: '', isExternal: false });
      setFile(null);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Upload New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 h-32 focus:border-primary outline-none"
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-primary outline-none"
            >
              <option>Action</option>
              <option>Drama</option>
              <option>Sci-Fi</option>
              <option>Comedy</option>
            </select>
          </div>
          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="isExternal"
              checked={formData.isExternal}
              onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isExternal" className="text-gray-400">External Link (YouTube)</label>
          </div>
        </div>
        {formData.isExternal ? (
          <div>
            <label className="block text-gray-400 mb-2">Video URL</label>
            <input
              type="url"
              required
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-primary outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-400 mb-2">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
            />
          </div>
        )}
        <button
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Uploading...' : 'Submit Movie'}
        </button>
      </form>
    </div>
  );
}
