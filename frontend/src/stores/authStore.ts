import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPassword } from '../lib/hash';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: number;
}

interface AuthState {
  users: User[];
  currentUserId: string | null;
  register: (email: string, password: string, displayName: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      register: async (email, password, displayName) => {
        const { users } = get();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: 'An account with this email already exists' };
        }
        const passwordHash = await hashPassword(password);
        const user: User = {
          id: crypto.randomUUID(),
          email: email.toLowerCase(),
          passwordHash,
          displayName,
          createdAt: Date.now(),
        };
        set({ users: [...users, user], currentUserId: user.id });
        return { ok: true };
      },

      login: async (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email.toLowerCase());
        if (!user) return { ok: false, error: 'No account found with this email' };
        const hash = await hashPassword(password);
        if (hash !== user.passwordHash) return { ok: false, error: 'Incorrect password' };
        set({ currentUserId: user.id });
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),
    }),
    { name: 'vesselnav-auth' }
  )
);

export const useCurrentUser = () =>
  useAuthStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
