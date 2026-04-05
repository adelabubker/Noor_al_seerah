// services.js mimics backend API calls by reading from local static data and returning promise-based responses.
// Static data services - no backend required
import { getCompanions, getCompanionBySlug, getSeerahEvents } from '../data/staticData';

// Companion endpoints expose list and detail operations while create/update/delete intentionally fail in the static version.
export const sahabaApi = {
  getAll: async (params = {}) => {
    await new Promise(r => setTimeout(r, 0));
    const data = getCompanions(params);
    return { data };
  },
  getBySlug: async (slug) => {
    await new Promise(r => setTimeout(r, 0));
    const data = getCompanionBySlug(slug);
    if (!data) throw { response: { data: { message: 'الصحابي غير موجود' } } };
    return { data };
  },
  create: async () => { throw { response: { data: { message: 'غير متاح في النسخة الثابتة' } } }; },
  update: async () => { throw { response: { data: { message: 'غير متاح في النسخة الثابتة' } } }; },
  remove: async () => { throw { response: { data: { message: 'غير متاح في النسخة الثابتة' } } }; },
};

// Seerah endpoints return the timeline events used by the dedicated seerah page.
export const seerahApi = {
  getAll: async (params = {}) => {
    await new Promise(r => setTimeout(r, 0));
    const data = getSeerahEvents(params);
    return { data };
  },
};

// Authentication is disabled here because the demo uses a local context-based login flow instead of a real server.
export const authApi = {
  login: async () => { throw { response: { data: { message: 'تسجيل الدخول غير متاح في النسخة الثابتة' } } }; },
  register: async () => { throw { response: { data: { message: 'التسجيل غير متاح في النسخة الثابتة' } } }; },
  me: async () => { throw new Error('no auth'); },
};

// Users endpoints return empty dashboard-friendly values so the admin page can still render safely.
export const usersApi = {
  getAll: async () => ({ data: [] }),
  getStats: async () => ({ totalUsers: 0, adminCount: 0, totalSahaba: 0 }),
};
