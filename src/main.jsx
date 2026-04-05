// main.jsx: نقطة البداية للتطبيق (Entry Point)
// هنا يتم ربط React مع DOM + إضافة Routing + Auth + Notifications

import React from 'react'; // استيراد React
import ReactDOM from 'react-dom/client'; // لإنشاء root للتطبيق (React 18+)
import { BrowserRouter } from 'react-router-dom'; // لتفعيل التنقل بين الصفحات (Routing)
import { Toaster } from 'sonner'; // مكتبة Toast لعرض الإشعارات
import App from './App'; // الكومبوننت الرئيسي للتطبيق
import './index.css'; // ملف الستايل العام (global styles)
import { AuthProvider } from './context/AuthContext'; // Context لإدارة حالة المستخدم (Login / Logout)

// إنشاء root وربط التطبيق داخل عنصر HTML id="root"
ReactDOM.createRoot(document.getElementById('root')).render(

  // StrictMode يساعد في اكتشاف المشاكل أثناء التطوير
  <React.StrictMode>

    {/* BrowserRouter يسمح باستخدام Routes في كامل التطبيق */}
    <BrowserRouter>

      {/* AuthProvider يلف التطبيق ليعطي كل الصفحات access على auth state */}
      <AuthProvider>

        {/* التطبيق الأساسي */}
        <App />

        {/* Toast Notifications */}
        {/* richColors: ألوان جاهزة جميلة */}
        {/* position: مكان ظهور الإشعار */}
        <Toaster richColors position="top-center" />

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);