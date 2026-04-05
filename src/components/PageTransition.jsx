// PageTransition adds a brief fade/slide animation whenever the current route changes.
import { useLocation } from 'react-router-dom'; // لمعرفة المسار الحالي (route)
import { useEffect, useRef, useState } from 'react'; // Hooks لإدارة الحالة والتأثيرات

export default function PageTransition({ children }) { // كومبوننت يلف الصفحات ويضيف انيميشن
  const location = useLocation(); // جلب المسار الحالي
  const [show, setShow] = useState(true); // حالة لإظهار أو إخفاء الصفحة (للأنيميشن)
  const prevPath = useRef(location.pathname); // حفظ المسار السابق بدون إعادة رندر

  // هذا الـ effect يشتغل عند تغيير الصفحة
  useEffect(() => {
    if (prevPath.current !== location.pathname) { // إذا تغير المسار
      setShow(false); // إخفاء الصفحة (بداية الأنيميشن)

      const t = setTimeout(() => {
        setShow(true); // إظهار الصفحة من جديد (نهاية الأنيميشن)
        prevPath.current = location.pathname; // تحديث المسار السابق
      }, 60); // مدة صغيرة لخلق تأثير الانتقال

      return () => clearTimeout(t); // تنظيف التايمر عند تغيير سريع
    }
  }, [location.pathname]); // يشتغل كل مرة يتغير فيها المسار

  return (
    <div
      className="transition-all duration-500" // تفعيل الأنيميشن (نصف ثانية)
      style={{
        opacity: show ? 1 : 0, // شفافية (fade in/out)
        transform: show ? 'translateY(0)' : 'translateY(10px)', // حركة خفيفة للأعلى/الأسفل
      }}
    >
      {children} {/* عرض محتوى الصفحة */}
    </div>
  );
}