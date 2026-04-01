import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

type Tab = 'login' | 'signup';

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();

  const reset = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (!res.ok) { setError(res.error!); return; }
      } else {
        if (!displayName.trim()) { setError('Display name is required'); return; }
        const res = await register(email, password, displayName.trim());
        if (!res.ok) { setError(res.error!); return; }
      }
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-4 rounded-2xl glass-elevated overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-white/[0.07]">
              {(['login', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  className="flex-1 py-3 text-sm font-medium transition-colors relative"
                  style={{ color: tab === t ? '#f0f6fc' : '#484f58' }}
                >
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                  {tab === t && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ background: '#22d3ee' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {tab === 'signup' && (
                <div>
                  <label className="label-mono block mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-text-pri bg-white/[0.04] border border-white/[0.1] focus:border-path-accent/50 focus:outline-none transition-colors"
                    placeholder="Dr. Smith"
                    required
                  />
                </div>
              )}

              <div>
                <label className="label-mono block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-text-pri bg-white/[0.04] border border-white/[0.1] focus:border-path-accent/50 focus:outline-none transition-colors"
                  placeholder="you@med.edu"
                  required
                />
              </div>

              <div>
                <label className="label-mono block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-text-pri bg-white/[0.04] border border-white/[0.1] focus:border-path-accent/50 focus:outline-none transition-colors"
                  placeholder="********"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.08))',
                  border: '1px solid rgba(34,211,238,0.3)',
                  color: '#22d3ee',
                }}
              >
                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
