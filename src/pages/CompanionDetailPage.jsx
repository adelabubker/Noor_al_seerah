// CompanionDetailPage fetches one companion by slug and shows biography, achievements, and hadiths.
// CompanionDetailPage تقوم بجلب بيانات صحابي واحد باستخدام الـ slug من الرابط ثم تعرض السيرة، الإنجازات، والأحاديث.
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Calendar, Award, BookOpen, Quote } from 'lucide-react';
import { sahabaApi } from '../api/services';
import PageLoader from '../components/PageLoader';

// CAT_LABELS تستخدم لتحويل القيم التقنية (category) إلى أسماء عربية مفهومة للمستخدم
const CAT_LABELS = {
  rightly_guided: 'الخلفاء الراشدون',
  muhajirun: 'المهاجرون',
  ansar: 'الأنصار',
  other: 'أخرى',
};

export default function CompanionDetailPage() {
  const { slug } = useParams(); // جلب slug من الرابط (مثلاً: /companions/abu-bakr)
  
  const [companion, setCompanion] = useState(null); // بيانات الصحابي
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(''); // رسالة الخطأ

  // عند تغير slug (يعني المستخدم دخل على صحابي جديد)، يتم إعادة جلب البيانات
  useEffect(() => {
    const loadCompanion = async () => {
      setLoading(true); // تشغيل اللودينغ
      setError(''); // تصفير أي خطأ سابق

      try {
        // طلب البيانات من API بناءً على slug
        const response = await sahabaApi.getBySlug(slug);

        // تخزين بيانات الصحابي في state
        setCompanion(response.data);
      } catch (loadError) {
        // في حال فشل الطلب (مثلاً slug غير موجود)
        setError(loadError.response?.data?.message || 'الصحابي غير موجود');
      } finally {
        setLoading(false); // إيقاف اللودينغ سواء نجح أو فشل
      }
    };

    loadCompanion();
  }, [slug]);

  // أثناء التحميل يتم عرض Loader
  if (loading) return <PageLoader />;

  // في حال لم يتم العثور على الصحابي
  if (!companion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl text-gray-400">{error}</p>

        {/* رابط الرجوع */}
        <Link to="/companions" className="text-primary font-semibold hover:underline">
          العودة للصحابة
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d]">
      
      {/* ===== الهيدر (Hero Section) ===== */}
      <div className="pattern-bg py-14 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* زر الرجوع */}
          <Link to="/companions" className="inline-flex items-center gap-1.5 text-green-300/70 hover:text-gold text-sm font-semibold mb-8 transition-colors">
            <ArrowRight size={15} />
            العودة للصحابة
          </Link>

          {/* معلومات الصحابي الأساسية */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* صورة أو أول حرف */}
            <div className="w-24 h-24 hex-avatar bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-white text-4xl font-black flex-shrink-0 shadow-xl overflow-hidden">
              {companion.image ? (
                <img src={companion.image} alt={companion.nameAr} className="w-full h-full object-cover" />
              ) : (
                companion.nameAr?.charAt(0) // أول حرف إذا ما في صورة
              )}
            </div>

            <div>
              {/* التصنيف + تاريخ الميلاد/الوفاة */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                
                {/* تصنيف الصحابي */}
                <span className="badge bg-gold/15 text-gold border border-gold/30 text-xs">
                  {CAT_LABELS[companion.category] ?? companion.category}
                </span>

                {/* تاريخ الميلاد والوفاة */}
                {(companion.birthYear || companion.deathYear) && (
                  <span className="badge bg-white/10 text-green-200 border border-white/10 text-xs flex items-center gap-1">
                    <Calendar size={10} />
                    {companion.birthYear || '—'} — {companion.deathYear || '—'}
                  </span>
                )}
              </div>

              {/* الاسم */}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-1">
                {companion.nameAr}
              </h1>

              {/* اللقب */}
              <p className="text-gold font-bold text-lg">{companion.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== المحتوى ===== */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ===== العمود الرئيسي ===== */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* نبذة مختصرة */}
          <div className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30">
            <h2 className="flex items-center gap-2 text-base font-black text-gray-900 dark:text-white mb-3">
              <BookOpen size={17} className="text-primary" /> نبذة مختصرة
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-loose text-sm">
              {companion.description || companion.shortBio}
            </p>
          </div>

          {/* السيرة الكاملة */}
          <div className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30">
            <h2 className="text-base font-black text-gray-900 dark:text-white mb-4">
              السيرة الكاملة
            </h2>

            <div className="text-gray-600 dark:text-gray-300 leading-loose text-sm whitespace-pre-line">
              {companion.details || companion.fullBio}
            </div>
          </div>

          {/* الأحاديث */}
          {companion.hadiths?.length > 0 && (
            <div className="bg-[#0d3320] rounded-2xl p-6 border border-gold/20">
              
              <h2 className="flex items-center gap-2 text-base font-black text-white mb-5">
                <Quote size={17} className="text-gold" /> أحاديث شريفة
              </h2>

              <div className="flex flex-col gap-4">
                {companion.hadiths.map((hadith, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-gold text-2xl leading-none mt-1 flex-shrink-0">❝</span>
                    <p className="text-green-100/80 text-sm leading-loose">{hadith}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== العمود الجانبي ===== */}
        <div className="flex flex-col gap-5">
          
          {/* الإنجازات */}
          <div className="bg-white dark:bg-[#111d11] rounded-2xl p-5 border border-gray-100 dark:border-green-900/30">
            <h2 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white mb-4">
              <Award size={16} className="text-gold" /> أبرز الإنجازات
            </h2>

            <ul className="flex flex-col gap-2.5">
              {(companion.achievements || []).map((achievement, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  
                  {/* رقم الإنجاز */}
                  <span className="w-5 h-5 rounded-full bg-primary/10 dark:bg-green-400/10 text-primary dark:text-green-400 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>

                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات سريعة */}
          <div className="bg-gradient-to-br from-primary/5 to-gold/5 dark:from-primary/10 dark:to-gold/10 rounded-2xl p-5 border border-primary/15 dark:border-green-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold">
              معلومات سريعة
            </p>

            <div className="flex flex-col gap-2">
              
              {/* الميلاد */}
              {companion.birthYear && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">الميلاد</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {companion.birthYear}
                  </span>
                </div>
              )}

              {/* الوفاة */}
              {companion.deathYear && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">الوفاة</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {companion.deathYear}
                  </span>
                </div>
              )}

              {/* التصنيف */}
              <div className="flex justify-between text-xs gap-3">
                <span className="text-gray-400">التصنيف</span>
                <span className="font-bold text-primary dark:text-green-400">
                  {CAT_LABELS[companion.category]}
                </span>
              </div>
            </div>
          </div>

          {/* زر الرجوع */}
          <Link to="/companions" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl text-sm transition-colors">
            <ArrowRight size={15} />
            العودة للصحابة
          </Link>
        </div>
      </div>
    </div>
  );
}