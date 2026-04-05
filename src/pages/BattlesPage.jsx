// BattlesPage lists battles, opens detail/video modals, and filters battle data stored in localStorage.
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sword, Users, Shield, MapPin, Calendar, Play, X } from 'lucide-react';
import { getBattles, phases, results } from '../data/battlesData';

// صورة افتراضية حربية إسلامية
const DEFAULT_BATTLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d3320"/><stop offset="100%" stop-color="#1a4d2e"/></linearGradient><linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a84c" stop-opacity="0.3"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/></linearGradient></defs><rect width="400" height="180" fill="url(#bg)"/><circle cx="30" cy="20" r="1" fill="#c9a84c" opacity="0.5"/><circle cx="80" cy="40" r="1.5" fill="#c9a84c" opacity="0.4"/><circle cx="150" cy="15" r="1" fill="#c9a84c" opacity="0.6"/><circle cx="250" cy="30" r="1" fill="#c9a84c" opacity="0.4"/><circle cx="340" cy="20" r="1.5" fill="#c9a84c" opacity="0.5"/><circle cx="370" cy="50" r="1" fill="#c9a84c" opacity="0.3"/><circle cx="200" cy="75" r="38" fill="none" stroke="#c9a84c" stroke-width="2.5" opacity="0.25"/><circle cx="213" cy="68" r="30" fill="url(#bg)" opacity="0.95"/><g transform="translate(200,90) rotate(-35)"><rect x="-2" y="-55" width="4" height="70" rx="2" fill="#c9a84c" opacity="0.85"/><polygon points="0,-55 -6,-45 6,-45" fill="#c9a84c" opacity="0.85"/><rect x="-9" y="10" width="18" height="4" rx="2" fill="#8B6914" opacity="0.9"/></g><g transform="translate(200,90) rotate(35)"><rect x="-2" y="-55" width="4" height="70" rx="2" fill="#c9a84c" opacity="0.85"/><polygon points="0,-55 -6,-45 6,-45" fill="#c9a84c" opacity="0.85"/><rect x="-9" y="10" width="18" height="4" rx="2" fill="#8B6914" opacity="0.9"/></g><rect x="0" y="155" width="400" height="25" fill="url(#glow)"/><text x="200" y="173" text-anchor="middle" font-family="serif" font-size="11" fill="#c9a84c" opacity="0.6">الغزوات النبوية</text></svg>`)}`;

// ===== مودال يوتيوب =====
// This modal renders an embedded YouTube player in a portal so it can overlay the whole page.
function YouTubeModal({ videoId, title, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-[#0d3320] px-5 py-3">
          <p className="text-white font-bold text-sm truncate">{title}</p>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"><X size={20} /></button>
        </div>
        <div className="aspect-video bg-black">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ===== مودال تفاصيل الغزوة =====
// This modal shows the full battle details, including numbers, causes, outcomes, and optional video launch.
function BattleModal({ battle, onClose, onWatchVideo }) {
  const phase = phases.find(p => p.value === battle.phase) ?? phases[0];
  const result = results[battle.result];
  const imageUrl = battle.image_url || DEFAULT_BATTLE_IMAGE;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111d11] rounded-3xl shadow-2xl border border-gray-100 dark:border-green-900/30"
        onClick={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X size={16} />
        </button>

        {/* الصورة */}
        <div className="h-52 overflow-hidden rounded-t-3xl relative flex-shrink-0">
          <img src={imageUrl} alt={battle.name} className="w-full h-full object-cover" onError={e => { e.target.src = DEFAULT_BATTLE_IMAGE; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${result.color}`}>{result.label}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${phase.color}`}>{phase.label}</span>
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{battle.name}</h2>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
              {battle.year && <span className="flex items-center gap-1"><Calendar size={12} className="text-gold" />{battle.year}</span>}
              {battle.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-gold" />{battle.location}</span>}
            </div>
          </div>

          {(battle.muslims || battle.enemies) && (
            <div className="grid grid-cols-2 gap-3">
              {battle.muslims && (
                <div className="bg-stone-50 dark:bg-[#0d1a0d] rounded-xl p-3 text-center">
                  <Users size={16} className="text-primary dark:text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-black text-primary dark:text-green-400">{battle.muslims.toLocaleString('ar-EG')}</p>
                  <p className="text-[10px] text-gray-400">المسلمون</p>
                </div>
              )}
              {battle.enemies && (
                <div className="bg-stone-50 dark:bg-[#0d1a0d] rounded-xl p-3 text-center">
                  <Shield size={16} className="text-red-500 mx-auto mb-1" />
                  <p className="text-lg font-black text-red-500">{battle.enemies.toLocaleString('ar-EG')}</p>
                  <p className="text-[10px] text-gray-400">الأعداء</p>
                </div>
              )}
            </div>
          )}

          {battle.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{battle.summary}</p>
          )}

          {battle.cause && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/20 rounded-xl p-4">
              <p className="text-xs font-black text-amber-700 dark:text-amber-400 mb-1.5">السبب</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{battle.cause}</p>
            </div>
          )}

          {battle.result_detail && (
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200/60 dark:border-green-700/20 rounded-xl p-4">
              <p className="text-xs font-black text-green-700 dark:text-green-400 mb-1.5">النتيجة</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{battle.result_detail}</p>
            </div>
          )}

          {battle.enemy_commander && (
            <div className="bg-stone-50 dark:bg-[#0d1a0d] rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-400 mb-1">قائد الأعداء</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{battle.enemy_commander}</p>
            </div>
          )}

          {battle.key_events?.filter(e => e.trim()).length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-700 dark:text-gray-200 mb-2.5">أبرز الأحداث</p>
              <ul className="flex flex-col gap-2">
                {battle.key_events.filter(e => e.trim()).map((event, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-primary/10 dark:bg-green-400/10 text-primary dark:text-green-400 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                    {event}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {battle.youtube_id && (
            <button
              onClick={() => { onClose(); onWatchVideo(battle.youtube_id, battle.name); }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
            >
              <Play size={15} fill="white" />
              شاهد الفيديو التعليمي
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

//كارد الغزوة 
// Each card summarizes one battle and offers quick access to details or the related video.
function BattleCard({ battle, onClick, onWatchVideo }) {
  const phase = phases.find(p => p.value === battle.phase) ?? phases[0];
  const result = results[battle.result];
  const imageUrl = battle.image_url || DEFAULT_BATTLE_IMAGE;

  return (
    <div
      className="bg-white dark:bg-[#111d11] rounded-2xl border border-gray-100 dark:border-green-900/30 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 dark:hover:border-green-600/40"
      onClick={onClick}
    >
      {/* شريط النتيجة */}
      <div className={`h-1 flex-shrink-0 ${battle.result === 'victory' ? 'bg-gradient-to-r from-primary via-green-400 to-gold' : battle.result === 'partial' ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`} />

      {/* الصورة - ثابتة دايماً */}
      <div className="h-36 overflow-hidden flex-shrink-0 relative">
        <img
          src={imageUrl}
          alt={battle.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = DEFAULT_BATTLE_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* المحتوى */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${result.color}`}>{result.label}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${phase.color}`}>{phase.label}</span>
        </div>

        <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-2">{battle.name}</h3>

        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
          {battle.year && <span className="flex items-center gap-1"><Calendar size={10} className="text-gold" />{battle.year}</span>}
          {battle.location && <span className="flex items-center gap-1"><MapPin size={10} className="text-gold" />{battle.location}</span>}
        </div>

        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">{battle.summary}</p>

        {/* الأزرار - دايماً بالأسفل بمسافة ثابتة */}
        <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100 dark:border-green-900/30">
          {battle.youtube_id && (
            <button
              onClick={e => { e.stopPropagation(); onWatchVideo(battle.youtube_id, battle.name); }}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg text-[11px] transition-colors flex-shrink-0"
            >
              <Play size={11} fill="white" />
              فيديو
            </button>
          )}
          <div className="flex-1 flex items-center justify-center gap-1 bg-primary/10 dark:bg-green-900/30 text-primary dark:text-green-400 font-bold py-2 rounded-lg text-[11px]">
            <Sword size={11} />
            عرض التفاصيل
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== الصفحة =====
// The page keeps filter state, listens for local battle updates, and derives the filtered list shown to the user.
export default function BattlesPage() {
  const [allBattles, setAllBattles] = useState([]);
  const [activePhase, setActivePhase] = useState('');
  const [activeResult, setActiveResult] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    setAllBattles(getBattles());
    const handler = () => setAllBattles(getBattles());
    window.addEventListener('battles_updated', handler);
    return () => window.removeEventListener('battles_updated', handler);
  }, []);

  const filtered = allBattles.filter(b => {
    if (activePhase && b.phase !== activePhase) return false;
    if (activeResult && b.result !== activeResult) return false;
    if (search.trim() && !b.name?.includes(search.trim()) && !b.location?.includes(search.trim()) && !b.summary?.includes(search.trim())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d]">
      {/* Hero */}
      <div className="pattern-bg py-14 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-gold/10" />
          <div className="w-[600px] h-[600px] rounded-full border border-gold/5 absolute" />
        </div>
        <div className="relative z-10">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">في سبيل الله</p>
          <h1 className="text-5xl font-black text-white mb-3">الغزوات النبوية</h1>
          <p className="text-green-200/60 max-w-lg mx-auto text-base">
            مواقف النبي ﷺ وصحابته الكرام في الدفاع عن الإسلام ونشر دعوة الحق
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* فلاتر + بحث */}
        <div className="bg-white dark:bg-[#111d11] rounded-2xl p-5 border border-gray-100 dark:border-green-900/30 mb-8 flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن غزوة بالاسم أو الموقع..."
              className="w-full px-4 py-3 pr-10 rounded-xl bg-stone-50 dark:bg-[#0d1a0d] border border-gray-200 dark:border-green-900/40 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 mb-2">المرحلة الزمنية</p>
              <div className="flex flex-wrap gap-2">
                {phases.map(phase => (
                  <button key={phase.value} onClick={() => setActivePhase(activePhase === phase.value ? '' : phase.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${activePhase === phase.value ? 'bg-primary text-white border-primary' : 'bg-stone-50 dark:bg-[#0d1a0d] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-green-900/40'}`}
                  >{phase.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">النتيجة</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveResult('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${!activeResult ? 'bg-primary text-white border-primary' : 'bg-stone-50 dark:bg-[#0d1a0d] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-green-900/40'}`}
                >الكل</button>
                {Object.entries(results).map(([key, val]) => (
                  <button key={key} onClick={() => setActiveResult(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${activeResult === key ? `${val.color} border-transparent` : 'bg-stone-50 dark:bg-[#0d1a0d] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-green-900/40'}`}
                  >{val.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* الكروت */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">⚔️</p>
            <p className="text-lg">لا توجد نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map(battle => (
              <BattleCard
                key={battle.id}
                battle={battle}
                onClick={() => setSelectedBattle(battle)}
                onWatchVideo={(id, title) => setVideoModal({ id, title })}
              />
            ))}
          </div>
        )}
      </div>

      {/* مودال التفاصيل */}
      {selectedBattle && (
        <BattleModal
          battle={selectedBattle}
          onClose={() => setSelectedBattle(null)}
          onWatchVideo={(id, title) => { setSelectedBattle(null); setVideoModal({ id, title }); }}
        />
      )}

      {/* مودال يوتيوب */}
      {videoModal && (
        <YouTubeModal videoId={videoModal.id} title={videoModal.title} onClose={() => setVideoModal(null)} />
      )}
    </div>
  );
}
