// CompanionsPage lists companions with search and category filters.
// CompanionsPage تعرض قائمة الصحابة مع إمكانية البحث والتصفية حسب التصنيف.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
import { sahabaApi } from '../api/services';
import PageLoader from '../components/PageLoader';

// قائمة التصنيفات المعروضة للمستخدم (فلترة جاهزة)
const CATEGORIES = [
  { value: '', label: 'الجميع', icon: '✦' },
  { value: 'rightly_guided', label: 'الخلفاء الراشدون', icon: '👑' },
  { value: 'muhajirun', label: 'المهاجرون', icon: '🌙' },
  { value: 'ansar', label: 'الأنصار', icon: '🌿' },
];

// تحويل القيم التقنية القادمة من الباك إلى أسماء عربية
const CAT_LABELS = {
  rightly_guided: 'الخلفاء الراشدون',
  muhajirun: 'المهاجرون',
  ansar: 'الأنصار',
  other: 'أخرى',
};

export default function CompanionsPage() {
  const [search, setSearch] = useState(''); // نص البحث
  const [category, setCategory] = useState(''); // التصنيف المختار
  const [companions, setCompanions] = useState([]); // قائمة الصحابة
  const [loading, setLoading] = useState(true); // حالة التحميل

  // هذا الـ effect يعمل debounce (تأخير) للبحث حتى لا يتم إرسال request مع كل حرف
  // ويتم إعادة جلب البيانات كلما تغير search أو category
  useEffect(() => {
    const controller = new AbortController(); // لإلغاء الطلب في حال تغير المدخلات بسرعة

    const timer = setTimeout(async () => {
      setLoading(true); // بدء التحميل

      try {
        // طلب البيانات من API مع إرسال الفلاتر
        const response = await sahabaApi.getAll({ search, category });

        // إذا لم يتم إلغاء الطلب → خزّن البيانات
        if (!controller.signal.aborted) {
          setCompanions(response.data);
        }
      } finally {
        // إيقاف التحميل فقط إذا لم يتم إلغاء الطلب
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250); // تأخير 250ms (debounce)

    // cleanup: إلغاء الطلب وإيقاف التايمر عند تغيير القيم
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [search, category]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d]">
      
      {/* ===== الهيدر ===== */}
      <div className="pattern-bg py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-gold/10" />
        </div>

        <div className="relative z-10">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">
            رضوان الله عليهم أجمعين
          </p>

          <h1 className="text-5xl font-black text-white mb-3">
            الصحابة الكرام
          </h1>

          <p className="text-green-200/60 max-w-lg mx-auto text-base">
            أصحاب النبي ﷺ الذين حملوا الأمانة ونشروا الإسلام في أرجاء الأرض
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* ===== الفلاتر ===== */}
        <div className="bg-white dark:bg-[#111d11] rounded-2xl p-5 border border-gray-100 dark:border-green-900/30 mb-6 flex flex-col sm:flex-row gap-4">
          
          {/* البحث */}
          <div className="relative flex-1">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                // إذا المستخدم بدأ يكتب → إلغاء التصنيف
                if (event.target.value) setCategory('');
              }}
              placeholder="ابحث باسم الصحابي..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-green-800/50 bg-stone-50 dark:bg-[#0d1a0d] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary dark:focus:border-green-500 transition-colors"
            />
          </div>

          {/* أزرار التصنيفات */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((categoryItem) => (
              <button
                key={categoryItem.value}
                onClick={() => {
                  setCategory(categoryItem.value); // تحديد التصنيف
                  setSearch(''); // مسح البحث
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  category === categoryItem.value && !search
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-stone-50 dark:bg-[#0d1a0d] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-green-900/40 hover:border-primary/50'
                }`}
              >
                <span>{categoryItem.icon}</span> {categoryItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== عرض البيانات ===== */}
        {loading ? (
          // أثناء التحميل
          <PageLoader fullScreen={false} />
        ) : companions.length === 0 ? (
          // لا توجد نتائج
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-lg">لا توجد نتائج</p>
          </div>
        ) : (
          // عرض الكروت
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companions.map((companion) => (
              
              // كل كارد هو رابط لصفحة التفاصيل
              <Link
                key={companion._id}
                to={`/companions/${companion.slug}`}
                className="group bg-white dark:bg-[#111d11] rounded-2xl overflow-hidden border border-gray-100 dark:border-green-900/30 lift flex flex-col"
              >
                {/* شريط علوي */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-green-400 to-gold" />

                <div className="p-5 flex flex-col gap-3 flex-1">
                  
                  {/* الصورة + الاسم */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 hex-avatar bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-white text-lg font-black flex-shrink-0 overflow-hidden">
                      {companion.image ? (
                        <img src={companion.image} alt={companion.nameAr} className="w-full h-full object-cover" />
                      ) : (
                        companion.nameAr?.charAt(0)
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight group-hover:text-primary dark:group-hover:text-green-400 transition-colors truncate">
                        {companion.nameAr}
                      </h3>

                      <p className="text-xs text-gold font-semibold truncate">
                        {companion.title}
                      </p>
                    </div>
                  </div>

                  {/* الوصف */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
                    {companion.description || companion.shortBio}
                  </p>

                  {/* الفوتر */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-green-900/20">
                    
                    {/* التصنيف */}
                    <span className="badge bg-primary/8 dark:bg-green-400/10 text-primary dark:text-green-400 border border-primary/20 dark:border-green-400/20">
                      {CAT_LABELS[companion.category] ?? companion.category}
                    </span>

                    {/* زر اقرأ المزيد */}
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">
                      اقرأ المزيد <ChevronLeft size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}