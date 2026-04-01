import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrentUser } from '../../stores/authStore';
import { UserMenu } from '../auth/UserMenu';
import { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';

const NAV_LINKS = [
  { to: '/', label: 'Map' },
  { to: '/flashcards', label: 'Flashcards' },
];

export function NavBar() {
  const user = useCurrentUser();
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-shrink-0 flex items-center justify-between px-5 py-3 glass border-b border-white/[0.07] z-20"
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 no-underline">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(34,211,238,0.12)',
              border: '1px solid rgba(34,211,238,0.3)',
              boxShadow: '0 0 16px rgba(34,211,238,0.15)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-path-accent">
              <circle cx="8" cy="8" r="2.5" fill="currentColor" />
              <path
                d="M2 8c0-2 1.5-4 4-5M14 8c0 2-1.5 4-4 5M8 2c2 0 4 1.5 5 4M8 14c-2 0-4-1.5-5-4"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-pri tracking-wide">VesselNav</h1>
            <p className="text-[10px] font-mono text-text-dim tracking-wider">VASCULAR DISCOVERY PLATFORM</p>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = link.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: active ? '#f0f6fc' : '#8b949e' }}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: '#22d3ee' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-path-accent transition-all hover:bg-white/[0.06]"
              style={{ border: '1px solid rgba(34,211,238,0.3)' }}
            >
              Sign In
            </button>
          )}
        </div>
      </motion.header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
