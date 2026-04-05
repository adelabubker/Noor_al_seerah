// AdminDashboardPage is the control center for companion management, battle management, and simple user stats.
// AdminDashboardPage هي مركز التحكم لإدارة الصحابة، وإدارة الغزوات، وإحصائيات المستخدمين.

import { useEffect, useMemo, useState } from 'react'; // React hooks لإدارة الحالة والتأثيرات
import { Users, ShieldCheck, BookOpen, Pencil, Trash2, Plus, Sword } from 'lucide-react'; // أيقونات الواجهة
import { sahabaApi, usersApi } from '../api/services'; // API للصحابة والمستخدمين (يفضل إضافة الغزوات هنا لاحقًا)
import CompanionForm from '../components/CompanionForm'; // فورم إضافة/تعديل الصحابي
import BattleForm from '../components/BattleForm'; // فورم إضافة/تعديل الغزوة
import PageLoader from '../components/PageLoader'; // لودر أثناء التحميل
import { getBattles, addBattle, updateBattle, deleteBattle } from '../data/battlesData'; // إدارة الغزوات عبر localStorage

// Tabs navigation بين الأقسام
const TABS = [
  { key: 'companions', label: 'الصحابة', icon: BookOpen },
  { key: 'battles', label: 'الغزوات', icon: Sword },
  { key: 'users', label: 'المستخدمين', icon: Users },
];

// Toast بسيط لعرض رسائل النجاح أو الخطأ بدون مكتبة خارجية
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl font-bold text-sm shadow-xl text-white transition-all ${type === 'error' ? 'bg-red-600' : 'bg-primary'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000); // حذف التوست بعد 3 ثواني
}

// Main Component
export default function AdminDashboardPage() {

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('companions'); // التبويب الحالي
  const [stats, setStats] = useState(null); // إحصائيات (عدد المستخدمين، المدراء، الصحابة)
  const [users, setUsers] = useState([]); // قائمة المستخدمين
  const [companions, setCompanions] = useState([]); // قائمة الصحابة
  const [battles, setBattles] = useState([]); // قائمة الغزوات (محليًا)
  const [editingCompanion, setEditingCompanion] = useState(null); // الصحابي الذي يتم تعديله
  const [editingBattle, setEditingBattle] = useState(null); // الغزوة التي يتم تعديلها
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [saving, setSaving] = useState(false); // حالة الحفظ (CRUD)
  const [refreshKey, setRefreshKey] = useState(0); // مفتاح لإعادة تحميل البيانات

  // --- FETCH DATA ---
  const refreshData = async () => {
    setLoading(true);
    try {
      const [statsResponse, usersResponse, companionsResponse] = await Promise.all([
        usersApi.getStats(), // جلب الإحصائيات
        usersApi.getAll(), // جلب المستخدمين
        sahabaApi.getAll(), // جلب الصحابة
      ]);

      setStats(statsResponse); // تحديث الإحصائيات
      setUsers(usersResponse.data); // تحديث المستخدمين
      setCompanions(companionsResponse.data); // تحديث الصحابة

    } catch (error) {
      toast(error.response?.data?.message || 'تعذر تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }

    setBattles(getBattles()); // تحميل الغزوات من localStorage
  };

  // إعادة تحميل البيانات عند تغيير refreshKey
  useEffect(() => { refreshData(); }, [refreshKey]);

  // عرض آخر 6 مستخدمين فقط
  const latestUsers = useMemo(() => users.slice(0, 6), [users]);

  // --- COMPANIONS CRUD ---

  // إضافة أو تعديل صحابي
  const handleCompanionSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingCompanion) {
        await sahabaApi.update(editingCompanion._id, payload); // تحديث
        toast('تم تحديث بيانات الصحابي');
      } else {
        await sahabaApi.create(payload); // إضافة
        toast('تمت إضافة الصحابي بنجاح');
      }

      setEditingCompanion(null); // إعادة تعيين الفورم
      setRefreshKey(v => v + 1); // إعادة تحميل البيانات

    } catch (error) {
      toast(error.response?.data?.message || 'تعذر حفظ البيانات', 'error');
    } finally {
      setSaving(false);
    }
  };

  // حذف صحابي
  const handleCompanionDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الصحابي؟')) return;

    try {
      await sahabaApi.remove(id);
      toast('تم حذف الصحابي');

      if (editingCompanion?._id === id) setEditingCompanion(null); // إذا كان قيد التعديل

      setRefreshKey(v => v + 1); // إعادة تحميل البيانات

    } catch (error) {
      toast(error.response?.data?.message || 'تعذر حذف الصحابي', 'error');
    }
  };

  // --- BATTLES CRUD (LOCAL STORAGE) ---

  // إضافة أو تعديل غزوة
  const handleBattleSubmit = (payload) => {
    setSaving(true);
    try {
      let updated;

      if (editingBattle) {
        updated = updateBattle(editingBattle.id, payload); // تحديث
        toast('تم تحديث بيانات الغزوة');
      } else {
        updated = addBattle(payload); // إضافة
        toast('تمت إضافة الغزوة بنجاح');
      }

      setBattles(updated); // تحديث القائمة
      setEditingBattle(null); // إعادة تعيين
      window.dispatchEvent(new Event('battles_updated')); // إشعار التحديث

    } catch (e) {
      toast('تعذر حفظ البيانات', 'error');
    } finally {
      setSaving(false);
    }
  };

  // حذف غزوة
  const handleBattleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الغزوة؟')) return;

    const updated = deleteBattle(id);
    setBattles(updated);

    if (editingBattle?.id === id) setEditingBattle(null);

    window.dispatchEvent(new Event('battles_updated'));
    toast('تم حذف الغزوة');
  };

  // عرض load إذا أول تحميل
  if (loading && !stats) return <PageLoader />;

  // --- STAT CARDS ---
  const statCards = [
    { key: 'totalUsers', label: 'إجمالي المستخدمين', icon: Users },
    { key: 'adminCount', label: 'المدراء', icon: ShieldCheck },
    { key: 'totalSahaba', label: 'عدد الصحابة', icon: BookOpen },
  ];

  // --- UI ---
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d]">

      {/* HEADER */}
      <div className="pattern-bg py-16 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">Admin Dashboard</p>
          <h1 className="text-5xl font-black text-white mb-3">لوحة تحكم الإدارة</h1>
          <p className="text-green-200/60 max-w-2xl mx-auto text-base">
            إدارة المحتوى الكامل للموقع — الصحابة والغزوات والمستخدمين.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map(({ key, label, icon: Icon }) => (
            <div key={key} className="bg-white dark:bg-[#111d11] rounded-2xl p-6 border border-gray-100 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary dark:text-green-400 flex items-center justify-center">
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{stats?.[key] ?? 0}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="bg-white dark:bg-[#111d11] rounded-2xl border border-gray-100 dark:border-green-900/30 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-green-900/30">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${
                  activeTab === key
                    ? 'text-primary dark:text-green-400 border-b-2 border-primary dark:border-green-400 bg-primary/5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* === COMPANIONS TAB === */}
            {activeTab === 'companions' && (
              <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6 items-start">
                <CompanionForm
                  initialData={editingCompanion}
                  onSubmit={handleCompanionSubmit}
                  onCancel={() => setEditingCompanion(null)}
                  submitting={saving}
                />
                <div>
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <div>
                      <p className="text-xs text-gold font-bold tracking-widest uppercase mb-1">CRUD</p>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">قائمة الصحابة</h2>
                    </div>
                    <button
                      onClick={() => setEditingCompanion(null)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold hover:bg-primary-hover"
                    >
                      <Plus size={16} /> عنصر جديد
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {companions.map((companion) => (
                      <div key={companion._id} className="rounded-2xl border border-gray-100 dark:border-green-900/30 bg-stone-50 dark:bg-[#0d1a0d] p-5 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 hex-avatar bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-white text-lg font-black shrink-0 overflow-hidden">
                            {companion.image ? (
                              <img src={companion.image} alt={companion.nameAr} className="w-full h-full object-cover" />
                            ) : companion.nameAr?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-gray-900 dark:text-white truncate">{companion.nameAr}</h3>
                            <p className="text-xs text-gold font-semibold truncate">{companion.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{companion.description || companion.shortBio}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200/80 dark:border-green-900/20">
                          <button onClick={() => setEditingCompanion(companion)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-primary/10 text-primary dark:text-green-400">
                            <Pencil size={13} /> تعديل
                          </button>
                          <button onClick={() => handleCompanionDelete(companion._id)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-red-100 text-red-600">
                            <Trash2 size={13} /> حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === BATTLES TAB === */}
            {activeTab === 'battles' && (
              <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6 items-start">
                <BattleForm
                  initialData={editingBattle}
                  onSubmit={handleBattleSubmit}
                  onCancel={() => setEditingBattle(null)}
                  submitting={saving}
                />
                <div>
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <div>
                      <p className="text-xs text-gold font-bold tracking-widest uppercase mb-1">CRUD</p>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">قائمة الغزوات</h2>
                      <p className="text-xs text-gray-400 mt-0.5">{battles.length} غزوة مسجلة</p>
                    </div>
                    <button
                      onClick={() => setEditingBattle(null)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold hover:bg-primary-hover"
                    >
                      <Plus size={16} /> غزوة جديدة
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {battles.map((battle) => (
                      <div key={battle.id} className="rounded-2xl border border-gray-100 dark:border-green-900/30 bg-stone-50 dark:bg-[#0d1a0d] p-5 flex flex-col gap-3">
                        {battle.image_url && (
                          <div className="h-28 rounded-xl overflow-hidden">
                            <img src={battle.image_url} alt={battle.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sword size={18} className="text-primary dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-gray-900 dark:text-white truncate">{battle.name}</h3>
                            <p className="text-xs text-gold font-semibold">{battle.year}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              📍 {battle.location}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2 mt-1">{battle.summary}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full font-bold border ${battle.result === 'victory' ? 'bg-green-100 text-green-700 border-green-300' : battle.result === 'partial' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                            {battle.result === 'victory' ? 'انتصار' : battle.result === 'partial' ? 'نتيجة جزئية' : 'هزيمة'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200/80 dark:border-green-900/20">
                          <button onClick={() => setEditingBattle(battle)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-primary/10 text-primary dark:text-green-400">
                            <Pencil size={13} /> تعديل
                          </button>
                          <button onClick={() => handleBattleDelete(battle.id)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-red-100 text-red-600">
                            <Trash2 size={13} /> حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === USERS TAB === */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-5">المستخدمون</h2>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-right text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-green-900/30">
                        <th className="pb-3 font-semibold">الاسم</th>
                        <th className="pb-3 font-semibold">البريد</th>
                        <th className="pb-3 font-semibold">الدور</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestUsers.length === 0 ? (
                        <tr><td colSpan={3} className="py-10 text-center text-gray-400">لا توجد بيانات مستخدمين</td></tr>
                      ) : latestUsers.map((item) => (
                        <tr key={item._id} className="border-b last:border-0 border-gray-100 dark:border-green-900/20">
                          <td className="py-3 text-gray-900 dark:text-white font-semibold">{item.name}</td>
                          <td className="py-3 text-gray-500 dark:text-gray-400">{item.email}</td>
                          <td className="py-3">
                            <span className={`badge ${item.role === 'admin' ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                              {item.role === 'admin' ? 'مدير' : 'مستخدم'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
