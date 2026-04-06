// SeerahPage builds a responsive interactive timeline for major events in the Prophet's biography.
import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { seerahApi } from '../api/services';
import PageLoader from '../components/PageLoader';

const PHASES = [
  { value: '', label: 'الكل', color: 'bg-gray-500', dot: 'bg-gray-400' },
  { value: 'before_prophethood', label: 'قبل البعثة', color: 'bg-slate-600', dot: 'bg-slate-400' },
  { value: 'mecca', label: 'العهد المكي', color: 'bg-amber-600', dot: 'bg-amber-400' },
  { value: 'hijrah', label: 'الهجرة', color: 'bg-blue-600', dot: 'bg-blue-400' },
  { value: 'medina', label: 'العهد المدني', color: 'bg-primary', dot: 'bg-green-400' },
  { value: 'battles', label: 'الغزوات', color: 'bg-red-600', dot: 'bg-red-400' },
  { value: 'final', label: 'الفترة الأخيرة', color: 'bg-yellow-600', dot: 'bg-yellow-400' },
];

const ERA_META = {
  before: { label: 'قبل البعثة', className: 'before' },
  mecca: { label: 'بعد البعثة', className: 'mecca' },
  hijrah: { label: 'بعد الهجرة', className: 'hijrah' },
};

// Converts detailed phase names into broader timeline eras so related events can share a visual anchor.
function getEraKey(phase) {
  if (phase === 'before_prophethood') return 'before';
  if (phase === 'mecca') return 'mecca';
  return 'hijrah';
}

// Places events along the horizontal timeline and alternates them above and below the main rail.
function buildTimelineNodes(items) {
  if (!items.length) return [];

  const start = 8;
  const end = 92;

  return items.map((event, index) => ({
    ...event,
    direction: index % 2 === 0 ? 'top' : 'bottom',
    leftPercent: items.length === 1 ? 50 : start + (index * (end - start)) / (items.length - 1),
  }));
}

// Calculates centered label positions for each larger era based on the event positions inside it.
function buildEraAnchors(nodes) {
  if (!nodes.length) return [];

  const groups = [];

  nodes.forEach((node) => {
    const era = getEraKey(node.phase);
    const current = groups[groups.length - 1];

    if (!current || current.key !== era) {
      groups.push({ key: era, positions: [node.leftPercent] });
      return;
    }

    current.positions.push(node.leftPercent);
  });

  return groups.map((group) => ({
    ...ERA_META[group.key],
    leftPercent: group.positions.reduce((sum, value) => sum + value, 0) / group.positions.length,
  }));
}

// The page loads the timeline data, tracks the selected event, and renders desktop/mobile timeline layouts.
export default function SeerahPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the timeline records once when the page opens.
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const response = await seerahApi.getAll();
        setEvents(response.data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getPhase = (phase) => PHASES.find((item) => item.value === phase) ?? PHASES[0];

  const filtered = events;

  const timelineNodes = useMemo(() => buildTimelineNodes(filtered), [filtered]);
  const eraAnchors = useMemo(() => buildEraAnchors(timelineNodes), [timelineNodes]);

  useEffect(() => {
    if (!filtered.some((event) => event._id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selectedIndex = filtered.findIndex((event) => event._id === selectedId);
  const selectedEvent = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const modalRef = useRef(null);
  const timelineRef = useRef(null);

  // Closes the detail panel and scrolls the viewport back to the timeline.
  const closePanel = () => {
    setSelectedId(null);
    setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // Moves the open details panel backward or forward through the ordered timeline.
  const goToEvent = (step) => {
    if (selectedIndex < 0) return;
    const nextEvent = filtered[selectedIndex + step];
    if (nextEvent) setSelectedId(nextEvent._id);
  };

  // Scroll modal panel into view whenever a new event is selected
  useEffect(() => {
    if (selectedEvent && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedEvent?._id]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d1a0d] overflow-hidden">
      <div className="pattern-bg py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-gold/10" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">صلى الله عليه وسلم</p>
          <h1 className="text-5xl font-black text-white mb-3">السيرة النبوية</h1>
          <p className="text-green-200/70 text-base md:text-lg leading-8">
            تصميم زمني مستوحى من الملصقات التعليمية الكلاسيكية، لكن بصياغة رقمية حديثة تناسب هوية الموقع وتجربة التصفح التفاعلية.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {loading ? (
          <PageLoader fullScreen={false} />
        ) : !filtered.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">لا توجد أحداث في هذه المرحلة</p>
          </div>
        ) : (
          <div ref={timelineRef}>
            <section className="hidden xl:block">
              <div className="sirah-reference-shell rounded-[34px] border border-[#d8ccb2] dark:border-green-900/30 overflow-hidden relative px-7 py-8">
                <div className="border-[#e4dac7] dark:border-green-900/20 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">الخط الزمني للسيرة</h2>
                  </div>

                  <div className="sirah-reference-tip">
                    انقر على أي محطة لعرض التفاصيل الكاملة والتنقل بين الحقب.
                  </div>
                </div>
                <div className="sirah-reference-stage">
                  <div className="sirah-main-rail" />
                  
                  {timelineNodes.map((event) => {
                    const phase = getPhase(event.phase);
                    const isFeatured = Boolean(event.isFeatured);
                    const isSelected = selectedId === event._id;

                    return (
                      <button
                        key={event._id}
                        type="button"
                        onClick={() => setSelectedId(event._id)}
                        className={`sirah-reference-event ${event.direction === 'top' ? 'sirah-reference-event-top' : 'sirah-reference-event-bottom'} ${isSelected ? 'is-selected' : ''} ${isFeatured ? 'is-featured' : ''}`}
                        style={{ left: `${event.leftPercent}%` }}
                      >
                        <div className={`sirah-reference-card ${event.direction === 'top' ? 'sirah-reference-card-top' : 'sirah-reference-card-bottom'}`}>
                          <div className="sirah-reference-year">{event.year}</div>
                          <h3 className="sirah-reference-title">{event.title}</h3>
                          <p className="sirah-reference-description">{event.description}</p>
                        </div>

                        <span className="sirah-reference-stem" />
                        <span className="sirah-reference-dot">
                          <span>{event.order}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="xl:hidden">
              <div className="sirah-mobile-shell rounded-[28px] border border-[#d8ccb2] dark:border-green-900/30 p-4 sm:p-5 relative overflow-hidden">
                <div className="mb-5">
                  <p className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-2">Responsive Timeline</p>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">الخط الزمني العمودي</h2>
                </div>

                <div className="relative pr-5">
                  <div className="absolute right-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#b59a57] via-[#6f8a43] to-[#cf4c43]" />
                  <div className="space-y-5">
                    {filtered.map((event) => {
                      const phase = getPhase(event.phase);
                      const isFeatured = Boolean(event.isFeatured);
                      return (
                        <button
                          key={event._id}
                          type="button"
                          onClick={() => setSelectedId(event._id)}
                          className="w-full text-right relative pr-11"
                        >
                          <span className={`absolute right-0 top-7 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg ${isFeatured ? 'bg-red-600' : 'bg-primary'}`}>
                            {event.order}
                          </span>
                          <div className="sirah-mobile-card rounded-[22px] border border-[#e2d7c2] dark:border-green-900/30 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="badge bg-gold/10 text-gold border border-gold/25 text-[10px]">{event.year}</span>
                            </div>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{event.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-6">{event.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div ref={modalRef} className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 md:pb-14 -mt-4">
          <div className="seerah-modal-panel w-full rounded-[30px] border border-white/10 bg-white dark:bg-[#101d12] shadow-2xl overflow-hidden">
            <div className="pattern-bg relative px-5 sm:px-8 md:px-10 py-8 md:py-10">
              <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-black/10" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`badge text-white text-[11px] ${selectedEvent.isFeatured ? 'bg-red-600' : getPhase(selectedEvent.phase).color}`}>
                      {selectedEvent.isFeatured ? 'محطة مفصلية' : getPhase(selectedEvent.phase).label}
                    </span>
                    <span className="badge bg-white/10 text-gold border border-gold/30 text-[11px]">{selectedEvent.year}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{selectedEvent.title}</h2>
                  <p className="text-green-50/85 text-sm md:text-base leading-8 max-w-2xl">{selectedEvent.description}</p>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <button
                    type="button"
                    onClick={() => closePanel()}
                    className="w-12 h-12 rounded-full border border-white/15 bg-white/10 text-white flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:bg-white/15"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-8 md:px-10 py-6 md:py-8 bg-white dark:bg-[#101d12]">
              <div className="grid xl:grid-cols-[1.2fr_340px] gap-6 items-start">
                <div className="rounded-[28px] border border-gray-200 dark:border-green-900/30 bg-stone-50/80 dark:bg-[#0d1a0d] p-5 md:p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <CalendarDays size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-1">Era Details</p>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">تفاصيل الحقبة</h3>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-8 whitespace-pre-line">{selectedEvent.details || selectedEvent.description}</p>
                </div>

                <div className="space-y-4">
                  {selectedEvent.image && (
                    <div className="rounded-[28px] overflow-hidden border border-gray-200 dark:border-green-900/30 bg-white dark:bg-[#111d11] shadow-sm">
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.imageAlt || selectedEvent.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="rounded-[28px] border border-gray-200 dark:border-green-900/30 bg-white dark:bg-[#111d11] p-5 shadow-sm">
                    <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-4">Timeline Range</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500 dark:text-gray-400">تاريخ البداية</span>
                        <span className="font-black text-gray-900 dark:text-white">{selectedEvent.startDate || selectedEvent.year}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500 dark:text-gray-400">تاريخ النهاية</span>
                        <span className="font-black text-gray-900 dark:text-white">{selectedEvent.endDate || selectedEvent.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-gray-200 dark:border-green-900/30 bg-white dark:bg-[#111d11] p-4 shadow-sm">
                    <div className="flex items-center gap-2 justify-between">
                      <button
                        type="button"
                        onClick={() => goToEvent(-1)}
                        disabled={selectedIndex <= 0}
                        className="flex-1 rounded-2xl border border-gray-200 dark:border-green-900/30 px-4 py-3 text-sm font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={18} />
                        السابقة
                      </button>
                      <button
                        type="button"
                        onClick={() => goToEvent(1)}
                        disabled={selectedIndex === -1 || selectedIndex >= filtered.length - 1}
                        className="flex-1 rounded-2xl border border-gray-200 dark:border-green-900/30 px-4 py-3 text-sm font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        التالية
                        <ChevronLeft size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}