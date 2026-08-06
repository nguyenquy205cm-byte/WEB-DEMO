import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: Omit<AuthUser, 'password'> | null;
  login: (email: string, password: string) => string | null;
  register: (data: AuthUser) => string | null;
  logout: () => void;
}

const USERS_KEY = 'mock_users';
const SESSION_KEY = 'mock_session';

const seedUsers: AuthUser[] = [
  { name: 'Admin', email: 'admin@example.com', phone: '', password: 'adminpass' },
  { name: 'User 1', email: 'user1@example.com', phone: '', password: 'password1' },
  { name: 'User 2', email: 'user2@example.com', phone: '', password: 'password2' },
  { name: 'User 3', email: 'user3@example.com', phone: '', password: 'password3' },
  { name: 'User 4', email: 'user4@example.com', phone: '', password: 'password4' },
  { name: 'User 5', email: 'user5@example.com', phone: '', password: 'password5' },
];

function loadUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const stored = raw ? (JSON.parse(raw) as AuthUser[]) : [];
    return [...seedUsers, ...stored];
  } catch {
    return seedUsers;
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [users, setUsers] = useState<AuthUser[]>(() => loadUsers());
  const [user, setUser] = useState<Omit<AuthUser, 'password'> | null>(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const found = loadUsers().find(u => u.email === email);
    return found ? { name: found.name, email: found.email, phone: found.phone } : null;
  });

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return 'Email hoặc mật khẩu không đúng.';
    localStorage.setItem(SESSION_KEY, found.email);
    setUser({ name: found.name, email: found.email, phone: found.phone });
    return null;
  };

  const register = (data: AuthUser) => {
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return 'Email này đã được đăng ký.';
    }
    if (data.password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    const updated = [...users, data];
    setUsers(updated);
    const stored = updated.filter(u => !seedUsers.some(s => s.email === u.email));
    localStorage.setItem(USERS_KEY, JSON.stringify(stored));
    localStorage.setItem(SESSION_KEY, data.email);
    setUser({ name: data.name, email: data.email, phone: data.phone });
    return null;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
