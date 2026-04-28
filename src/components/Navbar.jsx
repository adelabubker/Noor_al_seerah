import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, LayoutDashboard, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const THEMES = [
  { key: 'light', label: 'Light',   icon: Sun,    cls: '' },
  { key: 'dark',  label: 'Dark',   icon: Moon,   cls: 'dark' },
];

function applyTheme(key) {
  const root = document.documentElement;
  root.classList.remove('dark');
  const theme = THEMES.find(t => t.key === key);
  if (theme?.cls) root.classList.add(theme.cls);
  localStorage.setItem('noor-theme', key);
}

function getInitialTheme() {
  const saved = localStorage.getItem('noor-theme');
  if (saved && THEMES.find(t => t.key === saved)) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef(null);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => { applyTheme(theme); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleTheme = (key) => {
    setTheme(key);
    applyTheme(key);
    setThemeOpen(false);
  };

  const currentTheme = THEMES.find(t => t.key === theme) || THEMES[0];
  const ThemeIcon = currentTheme.icon;

  const links = [
    { to: '/', label: 'Home' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-800 transition-colors bg-gray-950/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white text-base">🎬</span>
          </div>
          <div className="leading-tight">
            <span className="block text-base font-black text-white">Noor Movie</span>
            <span className="block text-[10px] text-gold font-semibold tracking-wide">Premium Cinema</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-lg ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/dashboard" className="px-3 py-2 text-sm bg-primary text-white rounded-lg flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2 text-white text-sm">
                <UserCircle size={18} /> {user?.name}
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-full font-bold">
              Login
            </Link>
          )}

          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-700 text-gray-400"
            >
              <ThemeIcon size={16} />
              <ChevronDown size={12} className={themeOpen ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
