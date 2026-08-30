import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wallet, CheckCircle, Star, Shield, Clock, ArrowRight,
  Briefcase, TrendingUp, AlertCircle, Activity, Edit2, Save, X, ArrowLeft
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useWorkers } from '../../context/WorkerContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { EARNINGS_DATA, WORKER_WELFARE } from '../../data/mockData';

const AVAILABILITY_OPTIONS = [
  'Available Now', 'Available Tomorrow', 'Weekdays Only', 'Weekends Only', 'By Appointment',
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getWorker, updateWorker } = useWorkers();
  const { toast } = useToast();

  const workerId = user?.id ?? '';
  const workerRecord = getWorker(workerId);

  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>(location.pathname === '/worker/profile' ? 'profile' : 'overview');
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: workerRecord?.name ?? '',
    service: workerRecord?.service ?? '',
    priceMin: String(workerRecord?.priceMin ?? ''),
    availability: workerRecord?.availability ?? 'Available Now',
    bio: workerRecord?.bio ?? '',
    phone: workerRecord?.phone ?? '',
    email: workerRecord?.email ?? '',
    area: workerRecord?.area ?? '',
    city: workerRecord?.city ?? '',
    skills: workerRecord?.skills?.join(', ') ?? '',
    experience: String(workerRecord?.experience ?? ''),
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!workerRecord || editing) return;
    setProfileForm({
      name: workerRecord.name ?? '', service: workerRecord.service ?? '', priceMin: String(workerRecord.priceMin ?? ''),
      availability: workerRecord.availability ?? 'Available Now', bio: workerRecord.bio ?? '', phone: workerRecord.phone ?? '',
      email: workerRecord.email ?? '', area: workerRecord.area ?? '', city: workerRecord.city ?? '',
      skills: workerRecord.skills?.join(', ') ?? '', experience: String(workerRecord.experience ?? ''),
    });
  }, [workerRecord, editing]);

  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    return onSnapshot(query(collection(db, 'bookings'), where('workerId', '==', user.id)), snapshot => {
      setBookings(snapshot.docs.map(item => {
        const data = item.data();
        return {
          id: item.id,
          ...data,
          worker: user.name,
          service: data.service || data.serviceName || 'Home service',
          address: data.address || data.location || 'Address not provided',
        };
      }));
    }, () => toast('Unable to load bookings. Please try again.', 'error'));
  }, [user]);
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, string>>({});
  const pendingBookings = bookings.filter(b => (bookingStatuses[b.id] || b.status) === 'PENDING' || (bookingStatuses[b.id] || b.status) === 'CONFIRMED');

  const respondToBooking = async (id: string, accepted: boolean) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: accepted ? 'ACCEPTED' : 'REJECTED' });
      toast(accepted ? 'Booking request accepted. The customer has been notified.' : 'Booking request declined. The customer has been notified.', accepted ? 'success' : 'info');
    } catch {
      toast('Unable to update this booking. Please try again.', 'error');
    }
  };

  const startEdit = () => {
    setProfileForm({
      name: workerRecord?.name ?? '',
      service: workerRecord?.service ?? '',
      priceMin: String(workerRecord?.priceMin ?? ''),
      availability: workerRecord?.availability ?? 'Available Now',
      bio: workerRecord?.bio ?? '',
      phone: workerRecord?.phone ?? '',
      email: workerRecord?.email ?? '',
      area: workerRecord?.area ?? '',
      city: workerRecord?.city ?? '',
      skills: workerRecord?.skills?.join(', ') ?? '',
      experience: String(workerRecord?.experience ?? ''),
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveProfile = () => {
    if (!workerRecord) return;
    const skills = profileForm.skills.split(',').map(s => s.trim()).filter(Boolean);
    updateWorker(workerId, {
      name: profileForm.name,
      service: profileForm.service,
      priceMin: Number(profileForm.priceMin),
      availability: profileForm.availability,
      availableNow: profileForm.availability === 'Available Now',
      bio: profileForm.bio,
      phone: profileForm.phone,
      email: profileForm.email,
      area: profileForm.area,
      city: profileForm.city,
      skills,
      experience: Number(profileForm.experience),
    });
    setEditing(false);
    toast('Profile updated! Changes are live on the customer listing.', 'success');
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Good morning, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {pendingBookings.length > 0
              ? <><span className="font-semibold" style={{ color: 'var(--cs-teal)' }}>{pendingBookings.length} pending request{pendingBookings.length !== 1 ? 's' : ''}</span> awaiting your response.</>
              : 'No pending requests right now.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'primary' : 'secondary'}
            size="sm"
            icon={<Edit2 size={13} />}
            onClick={() => setActiveTab('profile')}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ───── PROFILE EDIT TAB ───── */}
      {activeTab === 'profile' && workerRecord && (
        <div className="space-y-5">
          {/* Verification status banner */}
          <div className="rounded-2xl p-4 flex items-center gap-4 border"
            style={{
              background: workerRecord.verificationStatus === 'verified' ? '#e8f5f0' : workerRecord.verificationStatus === 'pending' ? '#FEF3C7' : '#FEF2F2',
              borderColor: workerRecord.verificationStatus === 'verified' ? '#b3dcd0' : workerRecord.verificationStatus === 'pending' ? '#FDE68A' : '#FECACA',
            }}>
            <Shield size={20} style={{ color: workerRecord.verificationStatus === 'verified' ? '#2E8B70' : '#92400E', flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: workerRecord.verificationStatus === 'verified' ? '#065F46' : '#92400E' }}>
                {workerRecord.verificationStatus === 'verified' ? '✓ Verified Worker — Your profile is visible to customers'
                  : workerRecord.verificationStatus === 'pending' ? '⏳ Pending Verification — Admin is reviewing your profile'
                  : '✗ Verification Rejected — Contact support for more information'}
              </p>
              {workerRecord.verificationStatus === 'pending' && (
                <p className="text-xs mt-0.5" style={{ color: '#B45309' }}>You won't appear in customer listings until an admin verifies you.</p>
              )}
            </div>
          </div>

          {/* Profile card (live preview) */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: '#0F4C5C' }}>
                  {workerRecord.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{workerRecord.name}</h2>
                  <p className="text-sm" style={{ color: '#667477' }}>{workerRecord.service} · {workerRecord.experience} yrs</p>
                  <p className="text-sm font-semibold" style={{ color: '#0F4C5C' }}>From {workerRecord.priceLabel}</p>
                </div>
              </div>
              {!editing ? (
                <Button size="sm" icon={<Edit2 size={13} />} onClick={startEdit}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" icon={<X size={13} />} onClick={cancelEdit}>Cancel</Button>
                  <Button size="sm" icon={<Save size={13} />} onClick={saveProfile}>Save Changes</Button>
                </div>
              )}
            </div>

            {!editing ? (
              /* Read-only view */
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Phone', value: workerRecord.phone || '—' },
                    { label: 'Email', value: workerRecord.email || '—' },
                    { label: 'Availability', value: workerRecord.availability },
                    { label: 'Location', value: `${workerRecord.area}, ${workerRecord.city}` },
                    { label: 'Base Rate', value: workerRecord.priceLabel },
                    { label: 'Experience', value: `${workerRecord.experience} years` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: '#667477' }}>{label}</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#667477' }}>Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {workerRecord.skills.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-lg text-xs" style={{ background: '#e8f4f7', color: '#0F4C5C' }}>{s}</span>
                    ))}
                    {workerRecord.skills.length === 0 && <span className="text-xs" style={{ color: '#667477' }}>No skills added</span>}
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#667477' }}>Bio</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{workerRecord.bio || '—'}</p>
                </div>
              </div>
            ) : (
              /* Editable form */
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name' },
                    { key: 'service', label: 'Service' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'email', label: 'Email' },
                    { key: 'area', label: 'Area / Locality' },
                    { key: 'city', label: 'City' },
                    { key: 'experience', label: 'Experience (years)', type: 'number' },
                    { key: 'priceMin', label: 'Base Rate (₹)', type: 'number' },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</label>
                      <input
                        type={type || 'text'}
                        value={(profileForm as Record<string, string>)[key]}
                        onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Availability</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY_OPTIONS.map(a => (
                      <button key={a} type="button" onClick={() => setProfileForm(p => ({ ...p, availability: a }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                        style={{ background: profileForm.availability === a ? '#0F4C5C' : 'var(--bg)', borderColor: profileForm.availability === a ? '#0F4C5C' : 'var(--border)', color: profileForm.availability === a ? 'white' : '#667477' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Skills (comma-separated)</label>
                  <input
                    value={profileForm.skills}
                    onChange={e => setProfileForm(p => ({ ...p, skills: e.target.value }))}
                    placeholder="e.g. Wiring, Fan Installation, MCB Repair"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
                  <Button size="sm" icon={<Save size={13} />} onClick={saveProfile}>Save Changes</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl border" style={{ background: '#e8f4f7', borderColor: '#b3d5df' }}>
            <p className="text-xs" style={{ color: '#0F4C5C' }}>
              <strong>Live sync:</strong> Any changes you save here are immediately reflected on the customer worker listing and the admin management page — all three views share the same worker record.
            </p>
          </div>
        </div>
      )}

      {/* ───── OVERVIEW TAB ───── */}
      {activeTab === 'overview' && (
        <>
          {/* Verification banner */}
          <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 border" style={{ background: '#e8f5f0', borderColor: '#b3dcd0' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2E8B70' }}>
              <Shield size={20} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#065F46' }}>
                {workerRecord?.verificationStatus === 'verified' ? 'Identity & Skills Verified' : 'Verification Pending'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#059669' }}>
                {workerRecord?.cooperative ?? 'Cooperative member'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#2E8B70', color: 'white' }}>
              <CheckCircle size={12} /> {workerRecord?.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Today's Earnings" value="₹1,240" icon={<Wallet size={18} style={{ color: 'var(--cs-teal)' }} />} trend="+12% vs yesterday" trendUp />
            <StatCard label="Monthly Earnings" value="₹18,400" icon={<TrendingUp size={18} style={{ color: '#2E8B70' }} />} trend="+8% vs last month" trendUp />
            <StatCard label="Jobs Completed" value={String(workerRecord?.completedJobs ?? 124)} icon={<CheckCircle size={18} style={{ color: '#2E8B70' }} />} sub="All time" />
            <StatCard label="Avg Rating" value={`${workerRecord?.rating ?? '4.9'}★`} icon={<Star size={18} style={{ color: '#F4B942' }} />} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Earnings chart */}
            <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Earnings</h2>
                <Link to="/worker/earnings" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
                  Full report <ArrowRight size={12} />
                </Link>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={EARNINGS_DATA}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F4C5C" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0F4C5C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: unknown) => [`₹${(v as number).toLocaleString()}`, 'Earnings']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="earnings" stroke="#0F4C5C" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Trust Signals */}
            <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Trust Signals</h2>
              <div className="space-y-2">
                {[
                  { label: 'Identity Verified', ok: workerRecord?.verificationStatus === 'verified' },
                  { label: 'Skills Verified', ok: workerRecord?.verificationStatus === 'verified' },
                  { label: `${workerRecord?.completedJobs ?? 124} Jobs Completed`, ok: true },
                  { label: `${workerRecord?.rating ?? 4.9}★ Rating`, ok: (workerRecord?.rating ?? 5) >= 4.0 },
                  { label: `${workerRecord?.cancellationRate ?? 2}% Cancellation Rate`, ok: (workerRecord?.cancellationRate ?? 0) <= 10 },
                ].map(({ label, ok }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: ok ? '#2E8B70' : '#D9534F' }}>
                      <CheckCircle size={10} color="white" />
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <div className="rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Incoming Requests</h2>
                <Badge variant="amber">{pendingBookings.length} pending</Badge>
              </div>
              {pendingBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Briefcase size={28} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No pending requests</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {pendingBookings.map(b => (
                    <div key={b.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{b.service}</p>
                        {b.isUrgent && <Badge variant="amber" size="sm">Urgent</Badge>}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.date} at {b.time}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{b.address}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: 'var(--cs-teal)' }}>Est. ₹{b.estimatedPrice}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1" onClick={() => respondToBooking(b.id, true)}>Accept</Button>
                        <Button size="sm" variant="danger" className="flex-1" onClick={() => respondToBooking(b.id, false)}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Welfare */}
            <div className="rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <Activity size={16} style={{ color: 'var(--cs-teal)' }} />
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Worker Welfare</h2>
              </div>
              <div className="p-5">
                <div className="flex gap-3 p-3 rounded-xl mb-4" style={{ background: '#FEF3C7' }}>
                  <AlertCircle size={16} style={{ color: '#92400E' }} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#92400E' }}>High Workload This Week</p>
                    <p className="text-xs mt-0.5" style={{ color: '#B45309' }}>{WORKER_WELFARE.wellnessMessage}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Jobs This Week', value: WORKER_WELFARE.jobsThisWeek },
                    { label: 'Hours This Week', value: `${WORKER_WELFARE.hoursThisWeek}h` },
                    { label: 'Avg Income/Job', value: `₹${WORKER_WELFARE.averageIncome}` },
                    { label: 'Cancellation Rate', value: `${WORKER_WELFARE.cancellationRate}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transparent earnings breakdown */}
          <div className="mt-6 rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
              <Wallet size={16} style={{ color: 'var(--cs-teal)' }} />
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Last Service Earnings Breakdown</h2>
            </div>
            <div className="px-5 py-4">
              {[
                { label: 'Your Earnings', amount: 384, pct: 80, color: '#2E8B70' },
                { label: 'Cooperative Fund', amount: 48, pct: 10, color: '#F4B942' },
                { label: 'Platform Fee', amount: 48, pct: 10, color: '#667477' },
              ].map(({ label, amount, pct, color }) => (
                <div key={label} className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>₹{amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                  <span className="text-xs shrink-0 w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
