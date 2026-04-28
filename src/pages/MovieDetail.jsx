import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { movieApi } from '../api/movieApi';
import PageLoader from '../components/PageLoader';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieApi.getById(id);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!movie) return <div className="text-white text-center mt-20">Movie not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl">
          {movie.isExternal ? (
            <iframe
              src={movie.videoUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
              title={movie.title}
            ></iframe>
          ) : (
            <video
              src={`http://localhost:5000${movie.videoPath}`}
              controls
              className="w-full h-full"
            ></video>
          )}
        </div>
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-black text-white">{movie.title}</h1>
            <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-bold border border-primary/30">
              {movie.category}
            </span>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
}
