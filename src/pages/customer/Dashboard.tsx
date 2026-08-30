import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, CheckCircle, Star, Bell, ArrowRight, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useWorkers } from '../../context/WorkerContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

function BookingStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; variant: 'verified' | 'pending' | 'rejected' | 'neutral' | 'amber' | 'teal' }> = {
    COMPLETED: { label: 'Completed', variant: 'verified' },
    ACCEPTED: { label: 'Accepted', variant: 'teal' },
    PENDING: { label: 'Pending', variant: 'amber' },
    CANCELLED: { label: 'Cancelled', variant: 'neutral' },
    REJECTED: { label: 'Rejected', variant: 'rejected' },
  };
  const c = cfg[status] || { label: status, variant: 'neutral' };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { workers } = useWorkers();
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    return onSnapshot(query(collection(db, 'bookings'), where('customerId', '==', user.id)), snapshot => {
      setBookings(snapshot.docs.map(item => {
        const data = item.data();
        return {
          id: item.id,
          ...data,
          worker: data.worker || data.workerName || 'Assigned worker',
          service: data.service || data.serviceName || 'Home service',
        };
      }));
    });
  }, [user]);
  const activeBookings = bookings.filter(booking => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status));
  const completedBookings = bookings.filter(booking => booking.status === 'COMPLETED');

  return (
    <DashboardLayout>
      <div className="min-h-screen page-enter" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold mb-6 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Welcome */}
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--cs-emerald)' }}>Customer workspace</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Good morning, {user?.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>What service can we arrange for you today?</p>
            </div>
            <Link to="/notifications">
              <Button variant="secondary" size="sm" icon={<Bell size={14} />}>
                <span className="hidden sm:inline">Notifications</span><span className="sm:hidden">Alerts</span> <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs text-white" style={{ background: '#D9534F' }}>2</span>
              </Button>
            </Link>
          </div>

          {/* Search bar */}
          <Link to="/workers" className="group block mb-7">
            <div className="relative overflow-hidden rounded-2xl border p-4 transition-all group-hover:border-[var(--cs-teal)] group-hover:shadow-lg" style={{ background: 'linear-gradient(105deg, var(--surface), var(--surface-elevated))', borderColor: 'var(--border)' }}>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--cs-emerald)' }} />
              <span className="block pl-8 text-sm" style={{ color: 'var(--text-muted)' }}>Search for a service or worker...</span>
              <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs font-semibold sm:block" style={{ color: 'var(--cs-teal)' }}>Explore services <ArrowRight size={13} className="inline ml-1" /></span>
            </div>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <StatCard label="Active Bookings" value={String(activeBookings.length)} icon={<Clock size={18} style={{ color: 'var(--cs-teal)' }} />} />
        <StatCard label="Completed" value={String(completedBookings.length)} icon={<CheckCircle size={18} style={{ color: '#2E8B70' }} />} />
        <StatCard label="Avg Rating Given" value="—" icon={<Star size={18} style={{ color: '#F4B942' }} />} />
        <StatCard label="Favourite Workers" value="0" icon={<ShieldCheck size={18} style={{ color: 'var(--cs-teal)' }} />} />
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>My Bookings</h2>
            <Link to="/customer/bookings" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {bookings.slice(0, 4).map((b: any) => (
              <div key={b.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: 'var(--cs-teal)' }}>
                  {String(b.worker || 'Assigned worker').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{b.service}</p>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{b.worker} · {b.date}</p>
                  {b.isUrgent && <Badge variant="amber" size="sm" className="mt-1">Urgent</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended workers */}
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recommended</h2>
            <Link to="/workers" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
              See more <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {workers.filter(w => w.verificationStatus === 'verified' && w.accountStatus === 'active').slice(0, 3).map(w => (
              <Link key={w.id} to={`/workers/${w.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg)]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 relative"
                    style={{ background: 'var(--cs-teal)' }}>
                    {w.avatar}
                    {w.verificationStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#2E8B70' }}>
                        <ShieldCheck size={8} color="white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w.service}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs flex items-center gap-0.5" style={{ color: '#F4B942' }}>
                        <Star size={10} fill="#F4B942" /> {w.rating}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={10} className="inline" /> {w.distance}km
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

          {/* Recent notifications */}
          <div className="mt-5 lg:mt-6 rounded-2xl border overflow-hidden shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {[].map((n: any) => (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 ${!n.isRead ? 'bg-[#f0f9fa]' : ''}`}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.isRead ? 'var(--border)' : 'var(--cs-teal)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
