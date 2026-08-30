import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Building2, Briefcase, Star, AlertCircle,
  CheckCircle, X, BarChart2, ArrowRight, ArrowLeft, ShieldCheck, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useWorkers } from '../../context/WorkerContext';
import { ADMIN_STATS, DEMAND_DATA, EARNINGS_DATA } from '../../data/mockData';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workers, verifyWorker, rejectWorker, suspendWorker, activateWorker, updateWorker } = useWorkers();
  const { toast } = useToast();

  const pendingWorkers = workers.filter(w => w.verificationStatus === 'pending');
  const verifiedWorkers = workers.filter(w => w.verificationStatus === 'verified');
  const suspendedWorkers = workers.filter(w => w.accountStatus === 'suspended');

  const [activeWorkerTab, setActiveWorkerTab] = useState<'all' | 'pending' | 'suspended'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [registeredWorkers, setRegisteredWorkers] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snapshot => {
      const profiles = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      setCustomers(profiles.filter(profile => profile.role === 'customer'));
      setRegisteredWorkers(profiles.filter(profile => profile.role === 'worker'));
    }, () => toast('Unable to load customer and worker profiles.', 'error'));
  }, [toast]);

  useEffect(() => {
    if (location.pathname !== '/admin/verification') return;
    setActiveWorkerTab('pending');
    window.requestAnimationFrame(() => {
      document.getElementById('pending-worker-verifications')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [location.pathname]);

  const openVerificationQueue = () => {
    setActiveWorkerTab('pending');
    navigate('/admin/verification');
    window.requestAnimationFrame(() => {
      document.getElementById('pending-worker-verifications')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await verifyWorker(id);
      toast(`${name} has been verified and is now visible to customers.`, 'success');
    } catch {
      toast(`Unable to verify ${name}. Please check Firebase permissions and try again.`, 'error');
    }
  };
  const handleReject = async (id: string, name: string) => {
    try {
      await rejectWorker(id);
      toast(`${name}'s verification has been rejected.`, 'error');
    } catch {
      toast(`Unable to reject ${name}. Please try again.`, 'error');
    }
  };
  const handleSuspend = (id: string, name: string) => {
    suspendWorker(id);
    toast(`${name}'s account has been suspended.`, 'error');
  };
  const handleActivate = (id: string, name: string) => {
    activateWorker(id);
    toast(`${name}'s account is now active.`, 'success');
  };
  const startEditRate = (id: string, currentRate: number) => {
    setEditingId(id);
    setEditRate(String(currentRate));
  };
  const saveRate = (id: string, name: string) => {
    updateWorker(id, { priceMin: Number(editRate) });
    setEditingId(null);
    toast(`${name}'s rate updated to ₹${editRate}.`, 'success');
  };

  return (
    <DashboardLayout>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold mb-6 transition-colors hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={15} /> Back
      </button>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Platform overview and management</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-center sm:justify-start" style={{ background: '#FEF3C7' }}>
            <AlertCircle size={13} style={{ color: '#92400E' }} />
            <span className="text-xs font-medium" style={{ color: '#92400E' }}>{pendingWorkers.length} workers pending verification</span>
          </div>
          <Button className="w-full sm:w-auto justify-center" icon={<UserCheck size={14} />} onClick={openVerificationQueue}>
            Verify Workers
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Customers" value={customers.length || ADMIN_STATS.totalCustomers.toLocaleString()} icon={<Users size={18} style={{ color: 'var(--cs-teal)' }} />} />
        <StatCard label="Total Workers" value={workers.length} icon={<UserCheck size={18} style={{ color: '#2E8B70' }} />} sub={`${verifiedWorkers.length} verified`} />
        <StatCard label="Pending Verification" value={pendingWorkers.length} icon={<Clock size={18} style={{ color: '#F4B942' }} />} accent="#F4B942" />
        <StatCard label="Cooperatives" value={ADMIN_STATS.totalCooperatives} icon={<Building2 size={18} style={{ color: 'var(--cs-teal)' }} />} />
        <StatCard label="Open Disputes" value={ADMIN_STATS.openDisputes} icon={<AlertCircle size={18} style={{ color: '#D9534F' }} />} accent="#D9534F" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Bookings" value={ADMIN_STATS.totalBookings.toLocaleString()} icon={<Briefcase size={18} style={{ color: 'var(--cs-teal)' }} />} />
        <StatCard label="Completed" value={ADMIN_STATS.completedBookings.toLocaleString()} icon={<CheckCircle size={18} style={{ color: '#2E8B70' }} />} />
        <StatCard label="Active" value={ADMIN_STATS.activeBookings} icon={<BarChart2 size={18} style={{ color: '#F4B942' }} />} />
        <StatCard label="Avg Rating" value={`${ADMIN_STATS.averageRating}★`} icon={<Star size={18} style={{ color: '#F4B942' }} />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Customers</h2>
            <Badge variant="emerald">{customers.length} registered</Badge>
          </div>
          <div className="space-y-3">
            {customers.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No customer profiles found yet.</p>}
            {customers.slice(0, 6).map(customer => (
              <div key={customer.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--cs-teal)' }}>{customer.name?.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0"><p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{customer.name}</p><p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{customer.email} · {customer.city || 'No city'}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Registered Workers</h2>
            <Badge variant="amber">{registeredWorkers.length} profiles</Badge>
          </div>
          <div className="space-y-3">
            {registeredWorkers.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No registered worker profiles found yet.</p>}
            {registeredWorkers.slice(0, 6).map(worker => (
              <div key={worker.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: '#2E8B70' }}>{worker.name?.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0"><p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{worker.name}</p><p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{worker.email} · {worker.city || 'No city'}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Service demand chart */}
        <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Service Demand (Platform-wide)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEMAND_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="service" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }} />
              <Bar dataKey="requests" radius={[5, 5, 0, 0]} fill="#0F4C5C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings trend */}
        <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Jobs Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={EARNINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="jobs" stroke="#2E8B70" strokeWidth={2.5} dot={{ fill: '#2E8B70', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending verifications */}
      <div id="pending-worker-verifications" className="scroll-mt-24 rounded-2xl border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Pending Worker Verifications</h2>
            <Badge variant="amber">{pendingWorkers.length} pending</Badge>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {pendingWorkers.length === 0 && (
            <div className="px-5 py-8 text-center">
              <CheckCircle size={24} className="mx-auto mb-2" style={{ color: '#2E8B70' }} />
              <p className="text-sm" style={{ color: '#667477' }}>All caught up — no pending verifications</p>
            </div>
          )}
          {pendingWorkers.map(w => (
            <div key={w.id} className="px-5 py-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'var(--cs-teal)' }}>
                {w.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                  <Badge variant="amber" size="sm">Pending</Badge>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{w.service} · {w.area}, {w.city}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{w.experience} yrs exp · {w.priceLabel} · {w.phone || 'No phone'}</p>
                {w.bio && <p className="text-xs mt-0.5 truncate" style={{ color: '#667477' }}>{w.bio}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" icon={<CheckCircle size={13} />} onClick={() => handleVerify(w.id, w.name)}>Verify</Button>
                <Button size="sm" variant="danger" icon={<X size={13} />} onClick={() => handleReject(w.id, w.name)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers management table */}
      <div className="rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Manage Workers</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#e8f4f7', color: '#0F4C5C' }}>
              {workers.length} total
            </span>
          </div>
          <div className="flex gap-1.5">
            {(['all', 'pending', 'suspended'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveWorkerTab(tab)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize"
                style={{ background: activeWorkerTab === tab ? '#0F4C5C' : 'var(--bg)', color: activeWorkerTab === tab ? 'white' : '#667477' }}>
                {tab === 'all' ? `All (${workers.length})` : tab === 'pending' ? `Pending (${pendingWorkers.length})` : `Suspended (${suspendedWorkers.length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Worker', 'Service', 'Rate', 'Rating', 'Jobs', 'Verification', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {workers
                .filter(w => {
                  if (activeWorkerTab === 'pending') return w.verificationStatus === 'pending';
                  if (activeWorkerTab === 'suspended') return w.accountStatus === 'suspended';
                  return true;
                })
                .map(w => (
                  <tr key={w.id} className="hover:bg-[var(--bg)] transition-colors" style={{ opacity: w.accountStatus === 'suspended' ? 0.6 : 1 }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'var(--cs-teal)' }}>
                          {w.avatar}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.area}, {w.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{w.service}</td>
                    <td className="px-4 py-3.5">
                      {editingId === w.id ? (
                        <div className="flex items-center gap-1">
                          <input value={editRate} onChange={e => setEditRate(e.target.value)} type="number"
                            className="w-16 px-2 py-1 rounded-lg border text-xs focus:outline-none"
                            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                          <button onClick={() => saveRate(w.id, w.name)} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#2E8B70', color: 'white' }}>✓</button>
                          <button onClick={() => setEditingId(null)} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#D9534F', color: 'white' }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => startEditRate(w.id, w.priceMin)} className="text-xs font-semibold hover:underline" style={{ color: '#0F4C5C' }}>
                          {w.priceLabel} ✎
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-xs" style={{ color: w.rating >= 4.5 ? '#2E8B70' : w.rating >= 4.0 ? '#F4B942' : '#667477' }}>
                        {w.rating > 0 ? `${w.rating}★` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{w.completedJobs}</td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={w.accountStatus === 'suspended' ? 'rejected' : w.verificationStatus === 'verified' ? 'emerald' : w.verificationStatus === 'rejected' ? 'rejected' : 'pending'}
                        size="sm"
                        icon={<ShieldCheck size={10} />}
                      >
                        {w.accountStatus === 'suspended' ? 'Suspended' : w.verificationStatus === 'verified' ? 'Verified' : w.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {w.verificationStatus === 'pending' && (
                          <>
                            <button onClick={() => handleVerify(w.id, w.name)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#e8f9f4', color: '#2E8B70' }}>Verify</button>
                            <button onClick={() => handleReject(w.id, w.name)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#FEF2F2', color: '#D9534F' }}>Reject</button>
                          </>
                        )}
                        {w.accountStatus === 'active' && w.verificationStatus === 'verified' && (
                          <button onClick={() => handleSuspend(w.id, w.name)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#FEF2F2', color: '#D9534F' }}>Suspend</button>
                        )}
                        {w.accountStatus === 'suspended' && (
                          <button onClick={() => handleActivate(w.id, w.name)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#e8f9f4', color: '#2E8B70' }}>Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
