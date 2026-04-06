// Navbar provides site navigation, theme switching, user actions, and a mobile menu.
import { useState, useEffect, useRef } from 'react'; // Hooks لإدارة الحالة والتأثيرات والمراجع
import { Link, NavLink, useLocation } from 'react-router-dom'; // أدوات التنقل بين الصفحات
import { Menu, X, Moon, Sun, Sunset, LayoutDashboard, LogOut, UserCircle, ChevronDown } from 'lucide-react'; // أيقونات
import { useAuth } from '../context/AuthContext'; // جلب حالة المستخدم (تسجيل دخول + صلاحيات)

// تعريف الثيمات المتاحة (فاتح وداكن)
const THEMES = [
  { key: 'light', label: 'فاتح',   icon: Sun,    cls: '' }, // ثيم فاتح
  { key: 'dark',  label: 'داكن',   icon: Moon,   cls: 'dark' }, // ثيم داكن
];

// دالة لتطبيق الثيم على الصفحة وتخزينه
function applyTheme(key) {
  const root = document.documentElement; // عنصر html
  root.classList.remove('dark', 'dim'); // إزالة أي ثيم سابق
  const theme = THEMES.find(t => t.key === key); // إيجاد الثيم المختار
  if (theme?.cls) root.classList.add(theme.cls); // إضافة الكلاس إذا موجود
  localStorage.setItem('noor-theme', key); // حفظ الثيم في localStorage
}

// دالة لاسترجاع الثيم عند فتح الموقع
function getInitialTheme() {
  const saved = localStorage.getItem('noor-theme'); // قراءة الثيم المحفوظ
  if (saved && THEMES.find(t => t.key === saved)) return saved; // إذا موجود يرجعه
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; // حسب نظام المستخدم
}

// الكومبوننت الرئيسي للنافبار
export default function Navbar() {
  const [open, setOpen] = useState(false); // حالة فتح القائمة (موبايل)
  const [theme, setTheme] = useState(getInitialTheme); // الثيم الحالي
  const [themeOpen, setThemeOpen] = useState(false); // هل قائمة الثيم مفتوحة
  const themeRef = useRef(null); // مرجع لقائمة الثيم
  const location = useLocation(); // لمعرفة الصفحة الحالية
  const { isAuthenticated, isAdmin, user, logout } = useAuth(); // بيانات المستخدم

  // تطبيق الثيم عند أول تحميل
  useEffect(() => { applyTheme(theme); }, []);

  // إغلاق قائمة الثيم عند الضغط خارجها
  useEffect(() => {
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeOpen(false); // إغلاق القائمة
      }
    };
    document.addEventListener('mousedown', handler); // إضافة event
    return () => document.removeEventListener('mousedown', handler); // تنظيف
  }, []);

  // تغيير الثيم
  const handleTheme = (key) => {
    setTheme(key); // تحديث الحالة
    applyTheme(key); // تطبيق الثيم
    setThemeOpen(false); // إغلاق القائمة
  };

  const currentTheme = THEMES.find(t => t.key === theme) || THEMES[0]; // الثيم الحالي
  const ThemeIcon = currentTheme.icon; // أيقونة الثيم

  // روابط الموقع
  const links = [
    { to: '/', label: 'الرئيسية' },
    { to: '/seerah', label: 'السيرة النبوية' },
    { to: '/companions', label: 'الصحابة الكرام' },
    { to: '/battles', label: 'الغزوات النبوية' },
  ];

  const closeMenu = () => setOpen(false); // إغلاق قائمة الموبايل

  return (
    // النافبار الرئيسي
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-gold/20 dark:border-gold/10 transition-colors"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 92%, transparent)' }}>
      
      {/* الحاوية */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* الشعار */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white text-base">☽</span> {/* أيقونة */}
          </div>
          <div className="leading-tight">
            <span className="block text-base font-black">نور السيرة</span>
            <span className="block text-[10px] text-gold font-semibold tracking-wide">Noor Al-Seerah</span>
          </div>
        </Link>

        {/* روابط الديسكتوب */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold rounded-lg ${
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'hover:text-primary hover:bg-black/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* أزرار المستخدم */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              {/* زر الداشبورد */}
              {isAdmin && (
                <Link to="/dashboard" className="px-3 py-2 text-sm bg-primary text-white rounded-lg">
                  <LayoutDashboard size={16} /> لوحة التحكم
                </Link>
              )}

              {/* اسم المستخدم */}
              <div className="px-3 py-2 text-sm">
                <UserCircle size={16} /> {user?.name}
              </div>

              {/* تسجيل خروج */}
              <button onClick={logout}>
                <LogOut size={16} /> خروج
              </button>
            </>
          ) : (
            // زر تسجيل الدخول
            <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-full">
              تسجيل الدخول
            </Link>
          )}

          {/* اختيار الثيم */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all duration-200
                ${theme === 'dark'
                  ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20'
                  : 'bg-primary/8 border-primary/20 text-primary hover:bg-primary/15'
                }`}
              title="تغيير المظهر"
            >
              <ThemeIcon size={16} />
              <ChevronDown size={12} className={`transition-transform duration-200 ${themeOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* قائمة الثيم */}
            {themeOpen && (
              <div className="absolute top-full left-0 mt-2 min-w-[110px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl overflow-hidden z-50">
                {THEMES.map(t => {
                  const Icon = t.icon;
                  const isActive = theme === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => handleTheme(t.key)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors
                        ${isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-[var(--text-base)] hover:bg-[var(--bg-subtle)]'
                        }`}
                    >
                      <Icon size={15} />
                      {t.label}
                      {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* أزرار الموبايل */}
        <div className="flex md:hidden items-center gap-1">
          {/* تغيير الثيم */}
          <button
            onClick={() => {
              const idx = THEMES.findIndex(t => t.key === theme);
              const next = THEMES[(idx + 1) % THEMES.length].key;
              handleTheme(next);
            }}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
              ${theme === 'dark'
                ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20'
                : 'bg-primary/8 border-primary/20 text-primary hover:bg-primary/15'
              }`}
            title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'}
          >
            <ThemeIcon size={17} />
          </button>

          {/* زر القائمة */}
          <button onClick={() => setOpen(v => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {open && (
        <div className="md:hidden">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}

          {/* حالة المستخدم */}
          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/dashboard">لوحة التحكم</Link>}
              <div>مرحباً، {user?.name}</div>
              <button onClick={() => { logout(); closeMenu(); }}>
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link to="/login">تسجيل الدخول</Link>
          )}
        </div>
      )}
    </nav>
  );
}