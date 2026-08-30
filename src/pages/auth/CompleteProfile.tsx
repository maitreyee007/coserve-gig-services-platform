import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { completeProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) return;
    setLoading(true);
    try {
      const completedUser = await completeProfile(form.name.trim(), form.phone.trim(), form.city.trim());
      toast('Profile completed successfully.', 'success');
      navigate(completedUser.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
    } catch (error: any) {
      toast(error.message || 'Unable to complete your profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Complete your CoServe profile</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Your account is authenticated, but your profile is incomplete.</p>
        </div>
        {(['name', 'phone', 'city'] as const).map(field => (
          <label key={field} className="block text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
            {field === 'name' ? 'Full Name' : field} *
            <input required value={form[field]} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </label>
        ))}
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Saving Profile...' : 'Complete Profile'}</Button>
      </form>
    </div>
  );
}