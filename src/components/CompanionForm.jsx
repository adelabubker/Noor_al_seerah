// CompanionForm هو فورم يُستخدم في لوحة الأدمن لإضافة أو تعديل بيانات الصحابي
import { useEffect, useState } from 'react';

// القيم الافتراضية للفورم عند إضافة صحابي جديد
const emptyForm = {
  name: '',          // الاسم بالإنجليزية
  nameAr: '',        // الاسم بالعربية
  title: '',         // اللقب
  category: 'other', // التصنيف
  birthYear: '',     // سنة الميلاد
  deathYear: '',     // سنة الوفاة
  image: '',         // رابط الصورة
  description: '',   // نبذة مختصرة
  details: '',       // السيرة الكاملة
  achievements: '',  // الإنجازات (كنص متعدد الأسطر)
  hadiths: '',       // الأحاديث (كنص متعدد الأسطر)
};

// الكومبوننت الرئيسي
export default function CompanionForm({ initialData, onSubmit, onCancel, submitting }) {

  // حالة الفورم
  const [form, setForm] = useState(emptyForm);

  // هذا effect يُستخدم عند التعديل:
  // يقوم بتحويل البيانات القادمة من الداتابيس إلى شكل مناسب للفورم
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        nameAr: initialData.nameAr || '',
        title: initialData.title || '',
        category: initialData.category || 'other',
        birthYear: initialData.birthYear || '',
        deathYear: initialData.deathYear || '',
        image: initialData.image || '',

        // إذا لم يوجد description نستخدم shortBio كبديل
        description: initialData.description || initialData.shortBio || '',

        // نفس الفكرة للتفاصيل
        details: initialData.details || initialData.fullBio || '',

        // تحويل المصفوفات إلى نص (كل عنصر بسطر)
        achievements: Array.isArray(initialData.achievements)
          ? initialData.achievements.join('\n')
          : '',

        hadiths: Array.isArray(initialData.hadiths)
          ? initialData.hadiths.join('\n')
          : '',
      });
    } else {
      // إذا ما في بيانات → إعادة تعيين الفورم
      setForm(emptyForm);
    }
  }, [initialData]);

  // دالة عامة لتحديث أي input بناءً على name
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // تحديث الحقل المناسب
    }));
  };

  // كلاس موحد لكل inputs
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-green-900/40 bg-stone-50 dark:bg-[#0d1a0d] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary';

  return (
    // الفورم الرئيسي
    <form
      onSubmit={(event) => {
        event.preventDefault(); // منع إعادة تحميل الصفحة
        onSubmit(form); // إرسال البيانات للأب
      }}
      className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30 flex flex-col gap-4"
    >

      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gold font-bold tracking-widest uppercase mb-1">
            لوحة التحكم
          </p>

          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            {initialData ? 'تعديل بيانات الصحابي' : 'إضافة صحابي جديد'}
          </h3>
        </div>

        {/* زر إلغاء التعديل يظهر فقط عند edit */}
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-400 hover:text-primary"
          >
            إلغاء التعديل
          </button>
        )}
      </div>

      {/* الحقول الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* الاسم بالعربية */}
        <input
          name="nameAr"
          value={form.nameAr}
          onChange={handleChange}
          placeholder="الاسم بالعربية"
          className={inputClass}
          required
        />

        {/* الاسم بالإنجليزية */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name (English)"
          className={inputClass}
          required
        />

        {/* اللقب */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="اللقب / الصفة"
          className={inputClass}
          required
        />

        {/* التصنيف */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="rightly_guided">الخلفاء الراشدون</option>
          <option value="muhajirun">المهاجرون</option>
          <option value="ansar">الأنصار</option>
          <option value="other">أخرى</option>
        </select>

        {/* سنة الميلاد */}
        <input
          name="birthYear"
          value={form.birthYear}
          onChange={handleChange}
          placeholder="سنة الميلاد"
          className={inputClass}
        />

        {/* سنة الوفاة */}
        <input
          name="deathYear"
          value={form.deathYear}
          onChange={handleChange}
          placeholder="سنة الوفاة"
          className={inputClass}
        />
      </div>

      {/* رابط الصورة */}
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="رابط الصورة (اختياري)"
        className={inputClass}
      />

      {/* نبذة مختصرة */}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="نبذة مختصرة"
        rows="3"
        className={inputClass}
        required
      />

      {/* التفاصيل الكاملة */}
      <textarea
        name="details"
        value={form.details}
        onChange={handleChange}
        placeholder="السيرة الكاملة / التفاصيل"
        rows="6"
        className={inputClass}
        required
      />

      {/* الإنجازات */}
      <textarea
        name="achievements"
        value={form.achievements}
        onChange={handleChange}
        placeholder="الإنجازات - كل سطر إنجاز"
        rows="4"
        className={inputClass}
      />

      {/* الأحاديث */}
      <textarea
        name="hadiths"
        value={form.hadiths}
        onChange={handleChange}
        placeholder="الأحاديث - كل سطر حديث"
        rows="4"
        className={inputClass}
      />

      {/* زر الحفظ */}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        {submitting
          ? 'جارٍ الحفظ...'
          : initialData
          ? 'حفظ التعديلات'
          : 'إضافة الصحابي'}
      </button>

    </form>
  );
}