import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';
  const { login } = useAuth();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showReset, setShowReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Please enter a valid email address.';
    if (!password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const authenticatedUser = await login(email.trim(), password);
      toast('Welcome back!', 'success');
      const destination = authenticatedUser.role === 'admin'
        ? '/admin/dashboard'
        : redirectTo || '/';
      navigate(destination);
    } catch (error: any) {
      if (error.code === 'auth/profile-incomplete') navigate('/complete-profile');
      else toast(error.message || 'Unable to sign in right now. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email.trim());
      toast('Password reset email sent. Please check your inbox.', 'success');
      setShowReset(false);
    } catch (error: any) {
      toast(error.message || 'Unable to send the password reset email.', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: '#0F4C5C' }}>
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#F4B942', color: '#0F4C5C' }}>C</div>
            <span className="font-bold text-xl text-white">CoServe</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Trusted Services.<br />
            <span style={{ color: '#F4B942' }}>Empowered Workers.</span><br />
            Stronger Communities.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            CoServe connects households with verified, cooperative-backed skilled workers — electricians, plumbers, cleaners, and more.
          </p>
        </div>
        <div className="space-y-3">
          {[
            'Every worker identity & skill verified',
            'Cooperative model — fair earnings for workers',
            'Transparent pricing, no hidden charges',
            'Two-stage OTP for safety & trust',
          ].map(text => (
            <div key={text} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#2E8B70', color: 'white' }}>✓</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#0F4C5C', color: '#F4B942' }}>C</div>
            <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>CoServe</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#e8f4f7', color: '#0F4C5C' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{isAdminLogin ? 'Login as Admin' : 'Sign in to CoServe'}</h2>
              <p className="text-xs" style={{ color: '#667477' }}>{isAdminLogin ? 'Manage workers and platform operations' : 'Use your account to continue'}</p>
            </div>
          </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                      aria-invalid={Boolean(errors.password)}
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 pr-10"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#667477' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" size="lg" loading={loading} style={{ background: '#0F4C5C' }}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <button type="button" onClick={() => setShowReset(!showReset)} className="w-full text-center text-xs font-semibold" style={{ color: '#0F4C5C' }}>
                  Forgot Password?
                </button>
                {showReset && (
                  <div className="rounded-xl border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                    <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a password reset link.</p>
                    <Button type="button" onClick={handleReset} loading={resetLoading} size="sm" className="w-full" style={{ background: '#0F4C5C' }}>
                      Send Reset Email
                    </Button>
                  </div>
                )}
              </form>

              <div className="mt-5 space-y-2 text-center text-xs" style={{ color: '#667477' }}>
                <p>
                  New customer?{' '}
                  <Link to="/register" state={location.state} className="font-semibold" style={{ color: '#0F4C5C' }}>Create an account</Link>
                </p>
              </div>
        </div>
      </div>
    </div>
  );
}
