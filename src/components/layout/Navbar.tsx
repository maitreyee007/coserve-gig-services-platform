import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, Menu, X, ChevronDown,
  User, LogOut, LayoutDashboard, AlertTriangle, Briefcase, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Find Workers', to: '/workers' },
  { label: 'Cooperatives', to: '/cooperatives' },
  { label: 'How It Works', to: '/how-it-works' },
];

const DASHBOARD_LINKS: Record<string, string> = {
  customer: '/customer/dashboard',
  worker: '/worker/dashboard',
  cooperative: '/cooperative/dashboard',
  admin: '/admin/dashboard',
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = 0;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors"
        style={{ color: '#667477' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        aria-label={`Notifications — ${unread} unread`}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white leading-none"
            style={{ background: '#D9534F' }}
          >
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-11 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs font-medium" style={{ color: '#0F4C5C' }}>
              View all
            </Link>
          </div>
          <p className="px-4 py-6 text-center text-xs" style={{ color: '#667477' }}>No notifications yet</p>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!user) return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <button
          className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
          style={{ color: '#0F4C5C' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8f4f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Log in
        </button>
      </Link>
    </div>
  );

  const dashLink = DASHBOARD_LINKS[user.role];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors"
        style={{ borderColor: 'var(--border)', background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style={{ background: '#0F4C5C' }}
        >
          {user.avatar}
        </div>
        <span className="text-sm font-semibold hidden sm:block" style={{ color: '#172326' }}>
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown size={13} style={{ color: '#667477' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 w-64 rounded-2xl border shadow-xl z-50 overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
            <p className="text-xs capitalize mt-0.5" style={{ color: '#667477' }}>{user.role}</p>
          </div>
          <div className="py-1">
            <Link
              to={dashLink}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <User size={15} /> Profile
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <ShieldCheck size={15} /> Login as Admin
            </Link>
          </div>
          <div className="border-t py-1" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => { logout(); setOpen(false); navigate('/'); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
              style={{ color: '#D9534F', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: '#FFFFFF', borderColor: 'var(--border)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#0F4C5C' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white" opacity="0.9" />
              <line x1="10" y1="2" x2="10" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="13" x2="10" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="6" x2="6.5" y2="8.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="13.5" y1="11.5" x2="18" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="14" x2="6.5" y2="11.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="13.5" y1="8.5" x2="18" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ color: '#0F4C5C' }}>CoServe</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: isActive(to) ? '#0F4C5C' : '#172326',
                background: isActive(to) ? '#e8f4f7' : 'transparent',
                fontWeight: isActive(to) ? 600 : 500,
              }}
              onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = '#f5f5f5'; }}
              onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = 'transparent'; }}
            >
              {label}
            </Link>
          ))}
          {user && (
            <Link
              to={DASHBOARD_LINKS[user.role]}
              className="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: location.pathname.includes('dashboard') ? '#0F4C5C' : '#172326',
                background: location.pathname.includes('dashboard') ? '#e8f4f7' : 'transparent',
                fontWeight: location.pathname.includes('dashboard') ? 600 : 500,
              }}
              onMouseEnter={e => { if (!location.pathname.includes('dashboard')) e.currentTarget.style.background = '#f5f5f5'; }}
              onMouseLeave={e => { if (!location.pathname.includes('dashboard')) e.currentTarget.style.background = 'transparent'; }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Emergency button */}
        <Link to="/emergency" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#D9534F', color: 'white' }}>
          <AlertTriangle size={14} />
          Emergency
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {user && <NotificationBell />}
          {user && (
            <Link
              to="/worker/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#2E8B70' }}
            >
              <Briefcase size={14} /> Worker
            </Link>
          )}
          <UserMenu />
          <button
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: '#172326' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ background: '#FFFFFF', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive(to) ? '#0F4C5C' : '#172326',
                  background: isActive(to) ? '#e8f4f7' : 'transparent',
                  fontWeight: isActive(to) ? 600 : 500,
                }}
              >
                {label}
              </Link>
            ))}
            {user && (
              <Link
                to={DASHBOARD_LINKS[user.role]}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold"
                style={{ color: '#0F4C5C', background: '#e8f4f7' }}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/emergency"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: '#D9534F', color: 'white' }}
            >
              <AlertTriangle size={14} /> Emergency Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
