// BattleForm هو فورم يستخدم في لوحة الأدمن لإضافة أو تعديل بيانات الغزوات
import { useState, useEffect } from 'react'; // Hooks لإدارة الحالة والدورة الحياتية
import { Sword, X, Plus, Trash2 } from 'lucide-react'; // أيقونات

// القيم الافتراضية لأي غزوة جديدة
const emptyBattle = {
  id: '',
  name: '',
  year: '',
  location: '',
  phase: 'early',
  result: 'victory',
  summary: '',
  cause: '',
  result_detail: '',
  muslims: '',
  enemies: '',
  key_events: [''], // مصفوفة أحداث
  youtube_id: '',
  image_url: '',
};

// مراحل الغزوات (تظهر في select)
const phases = [
  { value: 'early', label: 'الغزوات الأولى (1-4 هـ)' },
  { value: 'middle', label: 'مرحلة التمكين (5-7 هـ)' },
  { value: 'late', label: 'مرحلة الفتوحات (8-9 هـ)' },
];

// خيارات النتيجة
const resultOptions = [
  { value: 'victory', label: 'انتصار' },
  { value: 'partial', label: 'نتيجة جزئية' },
  { value: 'defeat', label: 'هزيمة' },
];

// الكومبوننت الرئيسي
export default function BattleForm({ initialData, onSubmit, onCancel, submitting }) {

  // حالة الفورم
  const [form, setForm] = useState(emptyBattle);

  // هذا effect يحمل بيانات الغزوة عند التعديل أو يعيد ضبط الفورم عند الإضافة
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyBattle, // نضمن وجود كل الحقول
        ...initialData, // نملأ البيانات القادمة
        muslims: initialData.muslims ?? '',
        enemies: initialData.enemies ?? '',
        key_events: initialData.key_events?.length ? initialData.key_events : [''],
      });
    } else {
      setForm(emptyBattle); // إعادة تعيين
    }
  }, [initialData]);

  // دالة مختصرة لتحديث أي حقل بسهولة
  const set = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  // تعديل حدث معين داخل key_events
  const setEvent = (i, val) => {
    const ev = [...form.key_events];
    ev[i] = val;
    setForm(f => ({ ...f, key_events: ev }));
  };

  // إضافة حدث جديد
  const addEvent = () =>
    setForm(f => ({ ...f, key_events: [...f.key_events, ''] }));

  // حذف حدث
  const removeEvent = (i) =>
    setForm(f => ({
      ...f,
      key_events: f.key_events.filter((_, idx) => idx !== i)
    }));

  // عند الإرسال (submit)
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,

      // تحويل الأرقام من string إلى number
      muslims: form.muslims !== '' ? Number(form.muslims) : null,
      enemies: form.enemies !== '' ? Number(form.enemies) : null,

      // حذف الأحداث الفارغة
      key_events: form.key_events.filter(e => e.trim()),
    };

    onSubmit(payload); // إرسال البيانات للأب
  };

  // كلاسات جاهزة
  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-[#0d1a0d] border border-gray-200 dark:border-green-900/40 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";
  const labelCls = "block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5";

  return (
    // الكارد الرئيسي
    <div className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30 sticky top-24">

      {/* الهيدر */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-gold font-bold tracking-widest uppercase mb-1">
            {initialData ? 'تعديل غزوة' : 'إضافة غزوة'}
          </p>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {initialData ? initialData.name : 'غزوة جديدة'}
          </h2>
        </div>

        {/* أيقونة */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sword size={20} className="text-primary dark:text-green-400" />
        </div>
      </div>

      {/* الفورم */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* المعلومات الأساسية */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>اسم الغزوة *</label>
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>السنة</label>
            <input
              className={inputCls}
              value={form.year}
              onChange={e => set('year', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>الموقع</label>
            <input
              className={inputCls}
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
          </div>
        </div>

        {/* المرحلة + النتيجة */}
        <div className="grid grid-cols-2 gap-3">
          <select
            className={inputCls}
            value={form.phase}
            onChange={e => set('phase', e.target.value)}
          >
            {phases.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select
            className={inputCls}
            value={form.result}
            onChange={e => set('result', e.target.value)}
          >
            {resultOptions.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* الأحداث */}
        <div>
          <div className="flex justify-between">
            <label>أبرز الأحداث</label>
            <button type="button" onClick={addEvent}>
              <Plus size={12} /> إضافة
            </button>
          </div>

          {form.key_events.map((ev, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={ev}
                onChange={e => setEvent(i, e.target.value)}
              />

              {/* زر حذف */}
              {form.key_events.length > 1 && (
                <button onClick={() => removeEvent(i)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}>
            {submitting ? 'جاري الحفظ...' : 'حفظ'}
          </button>

          {initialData && (
            <button type="button" onClick={onCancel}>
              <X size={16} />
            </button>
          )}
        </div>

      </form>
    </div>
  );
}