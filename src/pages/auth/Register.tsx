import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

type Role = 'customer';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { registerCustomer } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountExists, setAccountExists] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', city: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!/^[+]?[0-9 ()-]{10,15}$/.test(form.phone)) nextErrors.phone = 'Please enter a valid phone number.';
    if (!form.city.trim()) nextErrors.city = 'City is required.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    setErrors(nextErrors);
    setAccountExists(false);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);

    try {
      await registerCustomer(form.name.trim(), form.email.trim(), form.phone.trim(), form.password, form.city.trim(), 'customer');

      toast('Account created successfully!', 'success');

      const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;
      navigate(redirectTo || '/customer/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') setAccountExists(true);
      toast(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(current => ({ ...current, [k]: '' }));
    setAccountExists(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--cs-teal)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" fill="white" opacity="0.9" />
                <line x1="10" y1="2" x2="10" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="13" x2="10" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-xl" style={{ color: 'var(--cs-teal)' }}>CoServe</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create your account</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--cs-teal)' }}>Sign in</Link>
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name *</label>
              <input
                type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)] transition"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email *</label>
              <input
                type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)] transition"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone *</label>
              <input
                type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)] transition"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>City *</label>
              <input
                type="text" required value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)] transition"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="Chennai"
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => set('password', e.target.value)} minLength={8}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)] transition"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {accountExists && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <p>An account with this email already exists. Please log in instead.</p>
                <button type="button" onClick={() => navigate('/login')} className="mt-2 font-semibold underline">Go to Login</button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<ChevronRight size={16} />}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
