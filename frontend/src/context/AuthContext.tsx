import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Role = 'ADMIN' | 'MODERATOR' | 'USER' | 'SHELTER' | null;

interface AuthState {
  token: string | null;
  role: Role;
  username: string | null;
}

interface AuthContextType extends AuthState {
  loggedIn: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isShelter: boolean;
  login: (token: string, role: Role, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') as Role,
    username: localStorage.getItem('username'),
  }));

  const login = useCallback((token: string, role: Role, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role ?? '');
    localStorage.setItem('username', username);
    setAuth({ token, role, username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setAuth({ token: null, role: null, username: null });
  }, []);

  return (
    <AuthContext.Provider value={{
      ...auth,
      loggedIn: !!auth.token,
      isAdmin: auth.role === 'ADMIN',
      isModerator: auth.role === 'MODERATOR' || auth.role === 'ADMIN',
      isShelter: auth.role === 'SHELTER' || auth.role === 'ADMIN',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};