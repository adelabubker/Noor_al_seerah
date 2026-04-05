// App.jsx: الملف الرئيسي للتطبيق (Root Component)
// مسؤول عن Layout العام + تعريف جميع Routes باستخدام React Router

import { Routes, Route } from 'react-router-dom'; // لإدارة التنقل بين الصفحات
import Navbar from './components/Navbar'; // شريط التنقل العلوي
import Footer from './components/Footer'; // الفوتر أسفل الصفحة
import ProtectedRoute from './components/ProtectedRoute'; // حماية الصفحات للمستخدمين المسجلين
import AdminRoute from './components/AdminRoute'; // حماية خاصة للأدمن فقط
import ScrollToTop from './components/ScrollToTop'; // إعادة الصفحة للأعلى عند تغيير المسار
import ScrollUpButton from './components/ScrollUpButton'; // زر للرجوع للأعلى
import PageTransition from './components/PageTransition'; // انيميشن الانتقال بين الصفحات
import HomePage from './pages/HomePage'; // الصفحة الرئيسية
import CompanionsPage from './pages/CompanionsPage'; // صفحة الصحابة
import CompanionDetailPage from './pages/CompanionDetailPage'; // تفاصيل الصحابي
import SeerahPage from './pages/SeerahPage'; // صفحة السيرة
import BattlesPage from './pages/BattlesPage'; // صفحة الغزوات
import AuthPage from './pages/AuthPage'; // تسجيل الدخول
import AdminDashboardPage from './pages/AdminDashboardPage'; // لوحة تحكم الأدمن
import NotFoundPage from './pages/NotFoundPage'; // صفحة 404

// هذا الكومبوننت يحدد الشكل العام للموقع ويحتوي على كل الصفحات (Routes)
export default function App() {
  return (
    // الحاوية الرئيسية للتطبيق
    // min-h-screen: تأخذ كامل ارتفاع الشاشة
    // bg: لون الخلفية (يدعم الوضع الداكن)
    // font-arabic: خط عربي مخصص
    // dir="rtl": اتجاه الكتابة من اليمين لليسار
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d] font-arabic" dir="rtl">

      {/* يعيد السكرول للأعلى عند تغيير الصفحة */}
      <ScrollToTop />

      {/* Navbar يظهر في جميع الصفحات */}
      <Navbar />

      {/* Wrapper للأنيميشن بين الصفحات */}
      <PageTransition>

        {/* تعريف جميع المسارات داخل التطبيق */}
        <Routes>

          {/* الصفحة الرئيسية */}
          <Route path="/" element={<HomePage />} />

          {/* صفحة قائمة الصحابة */}
          <Route path="/companions" element={<CompanionsPage />} />

          {/* صفحة تفاصيل صحابي (Dynamic Route باستخدام slug) */}
          <Route path="/companions/:slug" element={<CompanionDetailPage />} />

          {/* صفحة السيرة النبوية */}
          <Route path="/seerah" element={<SeerahPage />} />

          {/* صفحة الغزوات */}
          <Route path="/battles" element={<BattlesPage />} />

          {/* صفحة تسجيل الدخول */}
          <Route path="/login" element={<AuthPage />} />

          {/* لوحة التحكم - محمية */}
          <Route
            path="/dashboard"
            element={
              // أولاً: التأكد أن المستخدم مسجل دخول
              <ProtectedRoute>

                {/* ثانياً: التأكد أنه أدمن */}
                <AdminRoute>

                  {/* إذا تحقق الشرطين → عرض الداشبورد */}
                  <AdminDashboardPage />

                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* أي مسار غير معروف → صفحة 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </PageTransition>

      {/* الفوتر يظهر في كل الصفحات */}
      <Footer />

      {/* زر الرجوع للأعلى */}
      <ScrollUpButton />
    </div>
  );
}