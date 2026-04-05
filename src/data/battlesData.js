// battlesData.js stores battle records in localStorage and exposes helpers used by the battles page and admin dashboard.
// Default battles - seed data
export const defaultBattles = [
  {
  }
];

const STORAGE_KEY = 'noor_battles';

// Reads saved battles from localStorage and falls back to the seeded list if nothing is stored yet.
export function getBattles() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultBattles;
}

// Persists the full battle list after any create, update, or delete operation.
export function saveBattles(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Creates a stable id when needed, appends the new battle, then saves the updated collection.
export function addBattle(battle) {
  const list = getBattles();
  const newBattle = { ...battle, id: battle.id || `battle_${Date.now()}` };
  const updated = [...list, newBattle];
  saveBattles(updated);
  return updated;
}

// Updates a single battle by id and keeps every other record unchanged.
export function updateBattle(id, data) {
  const list = getBattles();
  const updated = list.map(b => b.id === id ? { ...b, ...data } : b);
  saveBattles(updated);
  return updated;
}

// Removes the selected battle by id and returns the new list.
export function deleteBattle(id) {
  const list = getBattles();
  const updated = list.filter(b => b.id !== id);
  saveBattles(updated);
  return updated;
}

export const battles = defaultBattles;

export const phases = [
  { value: "", label: "جميع الغزوات", color: "bg-gray-500" },
  { value: "early", label: "الغزوات الأولى (1-4 هـ)", color: "bg-amber-600" },
  { value: "middle", label: "مرحلة التمكين (5-7 هـ)", color: "bg-blue-600" },
  { value: "late", label: "مرحلة الفتوحات (8-9 هـ)", color: "bg-primary" },
];

export const results = {
  victory: { label: "انتصار", color: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30" },
  partial: { label: "نتيجة جزئية", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" },
  defeat: { label: "هزيمة", color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
};
