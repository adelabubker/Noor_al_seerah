// AuthContext manages the lightweight demo authentication flow used by protected routes and the dashboard.
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

// حساب افتراضي للمدير - يمكن تغييره
const DEFAULT_ADMIN = {
  email: 'admin@noor.com',
  password: 'admin123',
  user: { _id: 'admin_1', name: 'مدير النظام', email: 'admin@noor.com', role: 'admin' },
};

// The provider stores the current user and exposes login/logout helpers to the rest of the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const loading = false;

  const logout = () => setUser(null);

  // Login succeeds only when the default admin credentials match, which is enough for a local demo.
  const login = async ({ email, password }) => {
    // تحقق من الحساب الافتراضي
    if (
      email.trim().toLowerCase() === DEFAULT_ADMIN.email &&
      password === DEFAULT_ADMIN.password
    ) {
      setUser(DEFAULT_ADMIN.user);
      return { success: true };
    }
    // يمكن هنا لاحقاً إضافة طلب للـ backend
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register: async () => { throw new Error('غير متاح في الوقت الحالي'); },
      logout,
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth is a safe convenience hook that guarantees components are inside the provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
