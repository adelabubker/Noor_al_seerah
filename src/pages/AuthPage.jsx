// AuthPage renders the login screen and uses the local AuthContext to sign in the demo admin account.
// AuthPage مسؤول عن صفحة تسجيل الدخول ويستخدم AuthContext للتحقق وتسجيل الدخول.

import { useState } from 'react'; // لإدارة الحالة داخل الكمبوننت
import { Navigate, useNavigate } from 'react-router-dom'; // للتنقل بين الصفحات (redirect)
import { useAuth } from '../context/AuthContext'; // context يحتوي على user + login logic

export default function AuthPage() {

  // --- AUTH CONTEXT ---
  const { isAuthenticated, user, login } = useAuth(); 
  // isAuthenticated → هل المستخدم مسجل دخول
  // user → بيانات المستخدم الحالي
  // login → function لتسجيل الدخول

  const navigate = useNavigate(); // يستخدم للتنقل برمجيًا بعد login

  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState(''); // input email
  const [password, setPassword] = useState(''); // input password
  const [showPassword, setShowPassword] = useState(false); // toggle إظهار/إخفاء الباسورد
  const [error, setError] = useState(''); // رسالة الخطأ
  const [loading, setLoading] = useState(false); // حالة تحميل أثناء تسجيل الدخول

  // --- PROTECTED ROUTE LOGIC ---
  // إذا المستخدم already مسجل دخول → ما نخليه يشوف صفحة login
  if (isAuthenticated) {
    return (
      <Navigate 
        to={user?.role === 'admin' ? '/dashboard' : '/'} 
        replace 
      />
    );
    // لو admin → dashboard
    // غير ذلك → الصفحة الرئيسية
    // replace → يمنع الرجوع لصفحة login بالـ back button
  }

  // --- SUBMIT HANDLER ---
  // المسؤول عن التحقق + إرسال البيانات + التعامل مع الأخطاء
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع reload للصفحة (default form behavior)
    setError(''); // تصفير الخطأ القديم

    // --- VALIDATION ---
    // تحقق بسيط قبل إرسال الطلب (أفضل UX بدل انتظار API)
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return; // stop execution
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true); // تشغيل loading state

    try {
      // --- LOGIN CALL ---
      await login({ email, password });
      // login هنا غالبًا:
      // - يضرب API أو
      // - يتحقق من local/demo account

      // --- REDIRECT AFTER SUCCESS ---
      navigate('/dashboard', { replace: true });
      // مباشرة ينقله للداشبورد (ممكن لاحقًا تخليها تعتمد على role)

    } catch (err) {
      // --- ERROR HANDLING ---
      setError(err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
      // fallback message إذا ما في error واضح من backend
    } finally {
      setLoading(false); // إيقاف loading مهما صار (نجاح أو فشل)
    }
  };

  // --- UI ---
  return (
    <div className="pattern-bg min-h-[calc(100vh-128px)] flex items-center justify-center px-6 py-16">
      
      {/* CONTAINER */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl border border-gold/20 bg-white dark:bg-[#111d11] shadow-2xl">
        
        {/* LEFT SIDE (DESKTOP ONLY) */}
        {/* hidden on mobile → يعطي UX أفضل */}
        <div className="hidden lg:flex flex-col justify-between p-10 pattern-bg text-white relative overflow-hidden">
          
          {/* HEADER */}
          <div>
            <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Noor Al-Seerah
            </p>
            <h1 className="text-4xl font-black leading-tight mb-4">
              بوابة الدخول إلى منصة نور السيرة
            </h1>
            <p className="text-green-200/70 leading-loose text-sm">
              سجّل الدخول للوصول إلى لوحة الإدارة وإدارة المحتوى.
            </p>
          </div>

          {/* VERSE BOX */}
          <div className="verse-box p-5">
            <p className="text-gold text-lg font-semibold leading-loose">
              "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ"
            </p>
            <p className="text-green-300/60 text-xs mt-2">
              سورة الأحزاب - آية 21
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="p-8 md:p-10 flex flex-col justify-center gap-6">

          {/* TITLE */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              تسجيل الدخول
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              أدخل بيانات حسابك للوصول إلى لوحة التحكم.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* EMAIL INPUT */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                // controlled input → state هو المصدر الوحيد للحقيقة
                placeholder="example@email.com"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e1a] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                كلمة المرور
              </label>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'} 
                  // toggle بين إظهار وإخفاء الباسورد
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e1a] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />

                {/* TOGGLE BUTTON */}
                <button
                  type="button" // مهم عشان ما يعمل submit
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl p-3">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  {error}
                </p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading} // يمنع الضغط أثناء التحميل
              className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                // --- LOADING STATE ---
                <span className="animate-spin text-xl">⏳</span>
              ) : (
                // --- NORMAL STATE ---
                <>
                  <span>🔑</span>
                  دخول
                </>
              )}
            </button>
          </form>

          {/* DEFAULT ACCOUNT INFO */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-4">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-1">
              💡 بيانات الدخول الافتراضية
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-300 leading-relaxed" dir="ltr">
              Email: admin@noor.com<br />
              Password: admin123
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}