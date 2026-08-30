import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAIL } from '../../config/firebase';

export default function AdminRegister() {
  const navigate = useNavigate();
  const { registerCustomer } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: ADMIN_EMAIL, phone: '', city: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      toast(`Use the configured admin email: ${ADMIN_EMAIL}`, 'error');
      return;
    }
    setLoading(true);
    try {
      await registerCustomer(form.name.trim(), form.email.trim(), form.phone.trim(), form.password, form.city.trim(), 'admin');
      toast('Admin profile created successfully.', 'success');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast(error.message || 'Unable to create the admin profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--bg)' }}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff', color: '#6B5B95' }}><ShieldCheck size={22} /></div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Admin Profile</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Set up platform administration access</p>
          </div>
        </div>
        {(['name', 'phone', 'city'] as const).map(field => (
          <label key={field} className="block text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
            {field === 'name' ? 'Full Name' : field} *
            <input required value={form[field]} onChange={event => set(field, event.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </label>
        ))}
        <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Admin Email *
          <input required type="email" value={form.email} onChange={event => set('email', event.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
        </label>
        <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Password *
          <span className="relative block mt-1">
            <input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={event => set('password', event.target.value)} className="w-full px-4 py-2.5 pr-11 rounded-xl border text-sm" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <button type="button" onClick={() => setShowPassword(current => !current)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </span>
        </label>
        <Button type="submit" loading={loading} className="w-full" style={{ background: '#6B5B95' }}>{loading ? 'Creating Profile...' : 'Create Admin Profile'}</Button>
        <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}><Link to="/admin/login" className="font-semibold" style={{ color: '#6B5B95' }}>Back to Admin Sign In</Link></p>
      </form>
    </div>
  );
}
