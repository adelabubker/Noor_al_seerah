// ProtectedRoute blocks unauthenticated visitors and sends them to the login page.
import { Navigate, useLocation } from 'react-router-dom'; // أدوات للتحويل بين الصفحات ومعرفة المسار الحالي
import { useAuth } from '../context/AuthContext'; // جلب حالة تسجيل الدخول
import PageLoader from './PageLoader'; // لودر أثناء التحقق من الحالة

// هذا الكومبوننت يمنع الوصول إذا المستخدم مش مسجل دخول
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // هل المستخدم مسجل؟ وهل البيانات لسا تتحمل؟
  const location = useLocation(); // معرفة الصفحة الحالية

  // إذا النظام لسا يتحقق من حالة المستخدم (مثلاً عند تحميل الصفحة)
  if (loading) return <PageLoader />; 
  // عرض لودر بدل ما يظهر محتوى أو يعمل redirect بسرعة

  // إذا المستخدم غير مسجل دخول
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login" // تحويل لصفحة تسجيل الدخول
        replace // استبدال المسار بدل إضافته في history
        state={{ from: location.pathname }} // حفظ الصفحة الأصلية عشان يرجع لها بعد تسجيل الدخول
      />
    );

  // إذا المستخدم مسجل دخول → عرض الصفحة المطلوبة
  return children;
}