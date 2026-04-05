// Footer هو الفوتر (أسفل الموقع) ويحتوي على الهوية + روابط + آية قرآنية
import { Link } from 'react-router-dom'; // Link للتنقل داخل الموقع بدون إعادة تحميل

export default function Footer() {
  return (
    // الحاوية الرئيسية للفوتر + ألوان الخلفية والنص
    <footer className="bg-[#0a1f0a] text-gray-400 pt-14 pb-8 px-6 mt-0">

      {/* تحديد عرض المحتوى في المنتصف */}
      <div className="max-w-6xl mx-auto">

        {/* تقسيم الفوتر إلى 3 أعمدة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* العمود الأول: الهوية */}
          <div>
            <div className="flex items-center gap-3 mb-4">

              {/* أيقونة الموقع */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center">
                <span className="text-white text-lg">☽</span>
              </div>

              {/* اسم الموقع */}
              <div>
                <p className="text-white font-black text-lg leading-none">
                  نور السيرة
                </p>
                <p className="text-gold text-xs">
                  Noor Al-Seerah
                </p>
              </div>
            </div>

            {/* وصف الموقع */}
            <p className="text-sm leading-relaxed text-gray-500">
              موقع إسلامي شامل يُعنى بسيرة النبي محمد ﷺ وسير صحابته الكرام رضوان الله عليهم أجمعين.
            </p>
          </div>

          {/* العمود الثاني: روابط التنقل */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">
              روابط سريعة
            </h4>

            {/* قائمة الروابط */}
            <ul className="flex flex-col gap-2 text-sm">

              {/* map لتوليد الروابط */}
              {[
                { to: '/', label: 'الصفحة الرئيسية' },
                { to: '/seerah', label: 'السيرة النبوية' },
                { to: '/companions', label: 'الصحابة الكرام' },
                { to: '/login', label: 'تسجيل الدخول' },
              ].map((link) => (

                // كل عنصر في القائمة
                <li key={link.to}>

                  {/* رابط داخلي */}
                  <Link
                    to={link.to}
                    className="hover:text-gold transition-colors flex items-center gap-2"
                  >
                    {/* أيقونة صغيرة */}
                    <span className="text-gold text-xs">◈</span>

                    {/* نص الرابط */}
                    {link.label}
                  </Link>

                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: آية قرآنية */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">
              آية كريمة
            </h4>

            {/* صندوق الآية */}
            <div className="verse-box p-4">

              {/* نص الآية */}
              <p className="text-gold text-base leading-loose text-center font-semibold">
                "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ"
              </p>

              {/* المرجع */}
              <p className="text-gray-500 text-xs text-center mt-2">
                سورة الأنبياء - آية 107
              </p>
            </div>
          </div>
        </div>

        {/* الخط السفلي + نص إضافي */}
        <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          <p>
            صلى الله على النبي محمد وعلى آله وصحبه أجمعين
          </p>
        </div>

      </div>
    </footer>
  );
}