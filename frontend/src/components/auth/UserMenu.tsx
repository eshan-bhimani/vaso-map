import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, type User } from '../../stores/authStore';

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:ring-2 hover:ring-path-accent/40"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(124,58,237,0.25))',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-elevated overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <p className="text-sm font-medium text-text-pri">{user.displayName}</p>
              <p className="text-xs text-text-dim mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/[0.04] transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
