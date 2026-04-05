// AdminRoute: كومبوننت لحماية صفحات الأدمن فقط
// يمنع أي مستخدم غير أدمن من الوصول ويحوّله للصفحة الرئيسية

import { Navigate } from 'react-router-dom'; // لإعادة التوجيه (Redirect)
import { useAuth } from '../context/AuthContext'; // للحصول على بيانات المستخدم من الـ Context

// هذا الكومبوننت يلف الصفحات التي تحتاج صلاحية الأدمن
export default function AdminRoute({ children }) {

  // جلب حالة الأدمن من AuthContext
  const { isAdmin } = useAuth();

  // إذا المستخدم ليس أدمن → إعادة توجيه للرئيسية
  if (!isAdmin) return <Navigate to="/" replace />;

  // إذا المستخدم أدمن → عرض الصفحة المطلوبة
  return children;
}