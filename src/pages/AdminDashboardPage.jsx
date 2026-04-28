import MovieUpload from '../components/MovieUpload';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MovieUpload />
        </div>
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-400">
                <span>Total Movies</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Total Users</span>
                <span className="text-white font-bold">48</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
