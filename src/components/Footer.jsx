import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0d1a0d] border-t border-gray-800 pt-16 pb-8 px-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-center md:text-left">

          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white text-lg">🎬</span>
              </div>
              <div className="leading-tight">
                <span className="block text-xl font-black text-gray-900 dark:text-white">Noor Movie</span>
                <span className="block text-xs text-gold font-semibold tracking-wider">Premium Cinema</span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs text-left">
              The best platform to watch and manage your favorite movies and educational videos.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-black mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/login', label: 'Login' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[10px] text-gold">◆</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-2">
            © {currentYear} Noor Movie Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
