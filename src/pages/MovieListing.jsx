import { useState, useEffect } from 'react';
import { movieApi } from '../api/movieApi';
import { Link } from 'react-router-dom';
import { Play, Search } from 'lucide-react';

export default function MovieListing() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await movieApi.getAll({ search, category });
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </form>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Comedy">Comedy</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800 h-64 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="group relative overflow-hidden rounded-xl bg-gray-900 transition-transform hover:scale-105">
              <div className="aspect-video bg-gray-700">
                 {/* Placeholder for thumbnail */}
                 <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1 truncate">{movie.title}</h3>
                <span className="text-sm text-gray-400">{movie.category}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <Play className="text-white" size={48} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
