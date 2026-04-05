// HomePage builds the landing experience, featured verses, and a preview grid of companions.
// الصفحة الرئيسية تبني تجربة البداية (Landing)، تعرض آيات مختارة، وقسم معاينة للصحابة بشكل جذاب.
import { useEffect, useState } from 'react'; // hooks لإدارة الحالة وتنفيذ كود عند تحميل الصفحة
import { Link } from 'react-router-dom'; // للتنقل بين الصفحات بدون إعادة تحميل
import { ArrowLeft, BookOpen, Users, ChevronLeft } from 'lucide-react'; // أيقونات UI
import { sahabaApi } from '../api/services'; // API لجلب بيانات الصحابة
import PageLoader from '../components/PageLoader'; // لودر أثناء تحميل البيانات

// آيات ثابتة يتم عرضها في الصفحة (Section القرآن)
const QUOTES = [
  { text: 'إِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', source: 'سورة القلم - آية 4' },
  { text: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', source: 'سورة الأنبياء - آية 107' },
  { text: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ', source: 'سورة الأحزاب - آية 21' },
];

export default function HomePage() {
  const [companions, setCompanions] = useState([]); // قائمة الصحابة المختارين للعرض في الصفحة الرئيسية
  const [loading, setLoading] = useState(true); // حالة تحميل البيانات

  // عند أول تحميل للصفحة يتم جلب عدد محدود من الصحابة (featured)
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        // جلب 6 صحابة مميزين فقط (optimized للـ UI)
        const response = await sahabaApi.getAll({ featured: true, limit: 6 });
        setCompanions(response.data); // تخزين البيانات في state
      } finally {
        setLoading(false); // إيقاف التحميل مهما حصل
      }
    };

    loadFeatured(); // تنفيذ الدالة
  }, []); // [] = يعمل مرة واحدة فقط عند mount

  return (
    <div>
      {/* ===== Hero Section ===== */}
      {/* هذا القسم هو أول شيء يظهر للمستخدم (Landing + Branding) */}
      <section className="pattern-bg min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        
        {/* دوائر خلفية ديكورية */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-gold/5 absolute" />
          <div className="w-[800px] h-[800px] rounded-full border border-gold/5 absolute" />
          <div className="w-[1000px] h-[1000px] rounded-full border border-gold/5 absolute" />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 max-w-3xl mx-auto">
          
          {/* بسم الله */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-5 py-2 text-gold text-sm font-semibold mb-8 fade-up">
            <span>﷽</span>
            <span>بسم الله الرحمن الرحيم</span>
          </div>

          {/* عنوان الموقع */}
          <h1 className="text-6xl md:text-7xl font-black text-white mb-5 leading-tight fade-up fade-up-1">
            <span className="gold-shimmer">نور السيرة</span>
          </h1>

          {/* وصف */}
          <p className="text-green-200/80 text-xl mb-4 fade-up fade-up-2 leading-relaxed">
            رحلة في سيرة النبي محمد ﷺ وسير صحابته الكرام
          </p>

          {/* آية مميزة */}
          <div className="verse-box max-w-lg mx-auto px-6 py-4 mb-10 fade-up fade-up-3">
            <p className="text-gold text-lg font-semibold leading-loose">
              "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ"
            </p>
            <p className="text-green-400/60 text-xs mt-1">سورة الأحزاب - آية 21</p>
          </div>

          {/* أزرار التنقل */}
          <div className="flex flex-wrap justify-center gap-4 fade-up fade-up-4">
            <Link
              to="/seerah"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-[#0a1f0a] font-black px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/20"
            >
              <BookOpen size={18} />
              السيرة النبوية
            </Link>
            <Link
              to="/companions"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-3.5 rounded-full border border-white/20 transition-all hover:scale-105"
            >
              <Users size={18} />
              الصحابة الكرام
            </Link>
          </div>
        </div>

        {/* سهم للأسفل (UX hint) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs animate-bounce">
          <span>↓</span>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      {/* عرض أرقام سريعة تعطي إحساس بالقيمة */}
      <section className="bg-white dark:bg-[#111d11] border-y border-gray-100 dark:border-green-900/30 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: '١٢+', label: 'صحابياً كريماً', icon: '👥' },
            { num: '٦', label: 'مراحل السيرة', icon: '📖' },
            { num: '١٤٠٠+', label: 'سنة من النور', icon: '✨' },
          ].map((item) => (
            <div key={item.label} className="py-4">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-3xl font-black text-primary dark:text-green-400 mb-0.5">{item.num}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Quran Quotes Section ===== */}
      {/* عرض آيات عن النبي ﷺ */}
      <section className="py-16 px-6 bg-stone-50 dark:bg-[#0d1a0d]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-gold font-bold tracking-widest uppercase mb-2">القرآن الكريم</p>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">آيات في النبي ﷺ</h2>
          </div>

          {/* كروت الآيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUOTES.map((quote, index) => (
              <div key={index} className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30 text-center lift">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold font-black text-lg">❝</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 text-base font-semibold leading-loose mb-3">{quote.text}</p>
                <p className="text-xs text-gold font-bold">{quote.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Companions Preview Section ===== */}
      {/* عرض مجموعة مختارة من الصحابة */}
      <section className="py-16 px-6 bg-white dark:bg-[#111d11]">
        <div className="max-w-6xl mx-auto">
          
          {/* العنوان + زر عرض الكل */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-gold font-bold tracking-widest uppercase mb-2">رضوان الله عليهم</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">الصحابة الكرام</h2>
            </div>
            <Link to="/companions" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-primary dark:text-green-400 hover:underline">
              عرض الكل <ChevronLeft size={16} />
            </Link>
          </div>

          {/* لودر أو عرض البيانات */}
          {loading ? (
            <PageLoader fullScreen={false} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {companions.map((companion) => (
                <Link
                  key={companion._id}
                  to={`/companions/${companion.slug}`}
                  className="group bg-stone-50 dark:bg-[#0d1a0d] rounded-2xl p-5 border border-gray-100 dark:border-green-900/30 flex gap-4 items-start lift"
                >
                  {/* صورة أو حرف */}
                  <div className="w-14 h-14 hex-avatar bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-white text-xl font-black flex-shrink-0 overflow-hidden">
                    {companion.image ? (
                      <img src={companion.image} alt={companion.nameAr} className="w-full h-full object-cover" />
                    ) : (
                      companion.nameAr?.charAt(0)
                    )}
                  </div>

                  {/* معلومات */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight mb-0.5 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">
                      {companion.nameAr}
                    </h3>
                    <p className="text-xs text-gold font-semibold mb-2 truncate">{companion.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {companion.description || companion.shortBio}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* زر موبايل */}
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/companions"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-green-400 border border-primary/30 px-6 py-2.5 rounded-full hover:bg-primary/5 transition-colors"
            >
              عرض جميع الصحابة <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      {/* دعوة المستخدم لاستكشاف السيرة */}
      <section className="py-20 px-6 pattern-bg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-96 h-96 rounded-full border border-gold/30" />
          <div className="w-[600px] h-[600px] rounded-full border border-gold/20 absolute" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={28} className="text-gold" />
          </div>

          <h2 className="text-4xl font-black text-white mb-4">السيرة النبوية الشريفة</h2>

          <p className="text-green-200/70 text-lg mb-8 leading-relaxed">
            تعرّف على أهم أحداث حياة النبي محمد ﷺ من المولد حتى الوفاة عبر خط زمني تفاعلي
          </p>

          <Link
            to="/seerah"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-[#0a1f0a] font-black px-10 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-gold/20 text-base"
          >
            استكشف السيرة
            <ArrowLeft size={18} className="rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}