// ScrollToTop resets the scroll position when the user navigates to a different route.
import { useEffect } from 'react'; // Hook لتنفيذ كود عند حدوث تغييرات
import { useLocation } from 'react-router-dom'; // لمعرفة المسار الحالي (route)

export default function ScrollToTop() {
  const { pathname } = useLocation(); // استخراج اسم المسار الحالي (مثلاً /seerah)

  useEffect(() => {
    // عند تغيير الصفحة → يرجع السكرول للأعلى
    window.scrollTo({ 
      top: 0, // أعلى الصفحة
      behavior: 'smooth' // حركة ناعمة (بدون قفزة)
    });
  }, [pathname]); // يشتغل كل مرة يتغير فيها المسار

  return null; // هذا الكومبوننت ما بيرندر أي UI
}