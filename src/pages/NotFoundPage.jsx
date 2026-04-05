// NotFoundPage is the fallback route shown when the user visits an unknown URL.
// صفحة 404 تظهر عندما المستخدم يدخل رابط غير موجود داخل الموقع (Fallback Route).
import { Link } from 'react-router-dom'; // Link للتنقل بدون إعادة تحميل الصفحة

export default function NotFoundPage() {
  return (
    // الخلفية العامة + توسيط المحتوى عمودياً وأفقياً
    <div className="pattern-bg min-h-[calc(100vh-128px)] flex items-center justify-center px-6 py-20">
      
      {/* الحاوية الرئيسية للنص */}
      <div className="text-center max-w-xl">
        
        {/* رقم الخطأ */}
        <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">
          404
        </p>

        {/* العنوان */}
        <h1 className="text-5xl font-black text-white mb-4">
          الصفحة غير موجودة
        </h1>

        {/* وصف الخطأ */}
        <p className="text-green-200/70 leading-loose mb-8">
          ربما تم نقل الصفحة أو حذفها. يمكنك العودة إلى الصفحة الرئيسية واستكمال التصفح.
        </p>

        {/* زر الرجوع للرئيسية */}
        <Link
          to="/" // يرجع المستخدم للصفحة الرئيسية
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-[#0a1f0a] font-black px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/20"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}