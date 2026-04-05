// ScrollUpButton displays a floating button with reading progress once the user scrolls down the page.
import { useEffect, useState } from 'react'; // Hooks لإدارة الحالة والتأثيرات
import { ChevronUp } from 'lucide-react'; // أيقونة السهم للأعلى

export default function ScrollUpButton() {
  const [visible, setVisible] = useState(false); // هل الزر ظاهر أو لا
  const [scrollPercent, setScrollPercent] = useState(0); // نسبة التمرير (progress)

  // هذا الـ effect يراقب حركة السكرول
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY; // مقدار التمرير الحالي
      const docH = document.documentElement.scrollHeight - window.innerHeight; // ارتفاع الصفحة القابل للتمرير

      const pct = docH > 0 ? (scrollY / docH) * 100 : 0; // حساب النسبة المئوية
      setScrollPercent(pct); // تحديث النسبة

      setVisible(scrollY > 300); // إظهار الزر فقط بعد النزول 300px
    };

    window.addEventListener('scroll', onScroll, { passive: true }); // إضافة listener
    return () => window.removeEventListener('scroll', onScroll); // تنظيف عند unmount
  }, []);

  // دالة للرجوع لأعلى الصفحة
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  // إعدادات دائرة التقدم (SVG)
  const radius = 20; // نصف القطر
  const circumference = 2 * Math.PI * radius; // محيط الدائرة
  const dashOffset = circumference - (scrollPercent / 100) * circumference;
  // تحديد الجزء الظاهر من الدائرة حسب نسبة التمرير

  return (
    <button
      onClick={scrollToTop} // عند الضغط → يرجع للأعلى
      aria-label="العودة للأعلى"
      className={`fixed bottom-8 left-6 z-50 group transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto' // ظاهر
          : 'opacity-0 translate-y-6 pointer-events-none' // مخفي
      }`}
    >
      {/* الحاوية الرئيسية */}
      <div className="relative w-12 h-12">

        {/* SVG دائرة التقدم */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90" // تدوير لتبدأ من الأعلى
          viewBox="0 0 48 48"
        >
          {/* الدائرة الخلفية (خلفية خفيفة) */}
          <circle
            cx="24" cy="24" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-primary/20 dark:text-green-900"
          />

          {/* الدائرة المتحركة (progress) */}
          <circle
            cx="24" cy="24" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference} // طول الخط الكامل
            strokeDashoffset={dashOffset} // الجزء المخفي (يتغير مع السكرول)
            className="text-primary dark:text-green-400 transition-all duration-150"
          />
        </svg>

        {/* الزر الداخلي */}
        <div className="absolute inset-1 rounded-full bg-white dark:bg-[#0d1a0d] shadow-lg border border-primary/20 dark:border-green-800/50 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-green-700 transition-colors duration-200">
          
          {/* أيقونة السهم */}
          <ChevronUp
            size={18}
            className="text-primary dark:text-green-400 group-hover:text-white transition-colors duration-200 group-hover:-translate-y-0.5 transition-transform"
          />
        </div>
      </div>
    </button>
  );
}