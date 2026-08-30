import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const STATUS_BADGE: Record<string, 'verified' | 'amber' | 'teal' | 'rejected' | 'neutral'> = {
  COMPLETED: 'verified',
  ACCEPTED: 'teal',
  CONFIRMED: 'amber',
  PENDING: 'amber',
  CANCELLED: 'neutral',
  REJECTED: 'rejected',
};

export default function CustomerBookings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, string>>({});
  const [ratedBookingIds, setRatedBookingIds] = useState<string[]>([]);
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const localBookings = Object.keys(localStorage)
      .filter(key => key.startsWith('coserve-booking-'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          return null;
        }
      })
      .filter(booking => booking?.customerId === user.id)
      .map(booking => ({
        ...booking,
        service: booking.service || booking.serviceName || 'Home service',
        workerName: booking.workerName || booking.worker || booking.workerId || 'Assigned worker',
        address: booking.address || booking.location || 'Address not provided',
      }));

    return onSnapshot(query(collection(db, 'bookings'), where('customerId', '==', user.id)), snapshot => {
      const firestoreBookings = snapshot.docs.map(item => {
        const data = item.data();
        return {
          id: item.id,
          ...data,
          service: data.service || data.serviceName || 'Home service',
          workerName: data.workerName || data.worker || data.workerId || 'Assigned worker',
          address: data.address || data.location || 'Address not provided',
        };
      });
      const firestoreIds = new Set(firestoreBookings.map(booking => booking.id));
      setBookings([...firestoreBookings, ...localBookings.filter(booking => !firestoreIds.has(booking.id))]);
    }, () => toast('Unable to load bookings. Please try again.', 'error'));
  }, [user, toast]);

  const visibleBookings = bookings.map(b => ({ ...b, status: bookingStatuses[b.id] || b.status, rating: ratedBookingIds.includes(b.id) ? 5 : b.rating }));
  const filtered = filter === 'ALL' ? visibleBookings : visibleBookings.filter(b => b.status === filter);

  return (
    <DashboardLayout title="My Bookings" subtitle="Track and manage your service requests">
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'CONFIRMED', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors`}
            style={filter === s
              ? { background: 'var(--cs-teal)', color: 'white' }
              : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
            }
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No Bookings</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>You don't have any bookings yet.</p>
          <Button size="sm" onClick={() => navigate('/workers')}>Find a Service</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{b.service}</h3>
                    <Badge variant={STATUS_BADGE[b.status] || 'neutral'}>{String(b.status || 'CONFIRMED').charAt(0) + String(b.status || 'CONFIRMED').slice(1).toLowerCase()}</Badge>
                    {b.isUrgent && <Badge variant="amber" size="sm">Urgent</Badge>}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {b.workerName || b.workerId} · {b.date} at {b.time}
                  </p>
                  <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{b.address}</p>
                  {b.description && (
                    <p className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Booking ID</p>
                  <p className="font-mono text-sm font-bold" style={{ color: 'var(--cs-teal)' }}>{b.id}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    ₹{b.finalPrice || b.estimatedPrice}
                  </p>
                </div>
              </div>

              {b.status === 'COMPLETED' && b.finalPrice && (
                <div className="mt-4 p-4 rounded-xl border" style={{ background: '#f0f9fa', borderColor: '#b3d5df' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--cs-teal)' }}>Digital Receipt</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Customer Paid</p>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>₹{b.customerPaid}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Worker Earnings</p>
                      <p className="font-bold" style={{ color: '#2E8B70' }}>₹{b.workerEarnings}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Cooperative Fund</p>
                      <p className="font-bold" style={{ color: '#F4B942' }}>₹{b.cooperativeContribution}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Platform Fee</p>
                      <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>₹{b.platformFee}</p>
                    </div>
                  </div>
                  {b.rating && (
                    <div className="flex items-center gap-1 mt-3">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Your rating:</span>
                      {Array(b.rating).fill(0).map((_, i) => (
                        <Star key={i} size={12} fill="#F4B942" color="#F4B942" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <Button size="sm" variant="danger" onClick={async () => { try { await updateDoc(doc(db, 'bookings', b.id), { status: 'CANCELLED', cancellationReason: 'Cancelled by customer' }); toast('Booking cancelled', 'info'); } catch { toast('Unable to cancel booking. Please try again.', 'error'); } }}>
                    Cancel Booking
                  </Button>
                )}
                {b.status === 'COMPLETED' && !b.rating && (
                  <Button size="sm" onClick={() => { setRatedBookingIds(prev => [...prev, b.id]); toast('Thank you for your 5-star rating!', 'success'); }}>
                    Leave a Review
                  </Button>
                )}
                {b.status === 'COMPLETED' && (
                  <Button size="sm" variant="secondary" onClick={() => toast('Dispute raised. We will review shortly.', 'info')}>
                    Raise Dispute
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
