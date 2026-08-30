import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, CheckCircle, CreditCard, Smartphone,
  Building2, Banknote, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useWorkers } from '../context/WorkerContext';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cash';
type Step = 'schedule' | 'location' | 'summary' | 'payment' | 'confirmed';

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, BHIM', icon: <Smartphone size={18} /> },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: <CreditCard size={18} /> },
  { id: 'netbanking', label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis…', icon: <Building2 size={18} /> },
  { id: 'cash', label: 'Cash on Service', desc: 'Pay the worker directly', icon: <Banknote size={18} /> },
];

const STEPS: { key: Step; label: string }[] = [
  { key: 'schedule', label: 'Schedule' },
  { key: 'location', label: 'Location' },
  { key: 'summary', label: 'Summary' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmed', label: 'Confirmed' },
];

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                background: i <= idx ? '#0F4C5C' : 'var(--border)',
                color: i <= idx ? 'white' : '#667477',
              }}
            >
              {i < idx ? <CheckCircle size={13} color="white" /> : i + 1}
            </div>
            <span className="text-xs mt-1 font-medium hidden sm:block" style={{ color: i <= idx ? '#0F4C5C' : '#667477' }}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-8 sm:w-12 h-0.5 mx-1 -mt-5 sm:-mt-4 shrink-0 transition-colors"
              style={{ background: i < idx ? '#0F4C5C' : 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Booking() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getWorker } = useWorkers();
  const worker = workerId ? getWorker(workerId) : undefined;

  const [step, setStep] = useState<Step>('schedule');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('42, 4th Street, Anna Nagar, Chennai 600040');
  const [landmark, setLandmark] = useState('Near Anna Nagar Tower');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [arrivalOtp, setArrivalOtp] = useState('');
  const [completionOtp, setCompletionOtp] = useState('');

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  if (!user) return null;
  if (!worker) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>Worker profile not found.</div>;

  const basePrice = worker.priceMin;
  const cooperativeFund = Math.round(basePrice * 0.1);
  const platformFee = Math.round(basePrice * 0.1);
  const total = basePrice + cooperativeFund + platformFee;

  const today = new Date().toISOString().split('T')[0];

  const goBack = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
    else navigate(-1);
  };

  const goNext = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast('Please enter your UPI ID', 'error');
      return;
    }
    setProcessing(true);
    try {
      const generateOtp = () => String(1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000));
      const generatedArrivalOtp = generateOtp();
      const generatedCompletionOtp = generateOtp();
      const result = await addDoc(collection(db, 'bookings'), {
        customerId: user.id,
        workerId: worker.id,
        workerName: worker.name,
        serviceName: worker.service,
        date,
        time: timeSlot,
        location: `${address}${landmark ? `, ${landmark}` : ''}`,
        price: total,
        estimatedPrice: total,
        status: 'CONFIRMED',
        arrivalOtp: generatedArrivalOtp,
        completionOtp: generatedCompletionOtp,
        createdAt: serverTimestamp(),
      });
      setBookingId(result.id);
      setArrivalOtp(generatedArrivalOtp);
      setCompletionOtp(generatedCompletionOtp);
      setStep('confirmed');
      toast('Booking confirmed.', 'success');
    } catch {
      // Demo workers are local profiles, so keep the front-end flow usable without a matching Firestore document.
      const demoBookingId = `demo-${Date.now()}`;
      localStorage.setItem(`coserve-booking-${demoBookingId}`, JSON.stringify({
        id: demoBookingId,
        customerId: user.id,
        workerId: worker.id,
        workerName: worker.name,
        serviceName: worker.service,
        date,
        time: timeSlot,
        location: `${address}${landmark ? `, ${landmark}` : ''}`,
        price: total,
        status: 'CONFIRMED',
      }));
      setBookingId(demoBookingId);
      setArrivalOtp('4821');
      setCompletionOtp('7394');
      setStep('confirmed');
      toast('Demo booking confirmed.', 'success');
    }
    finally { setProcessing(false); }
  };

  const workerName = worker.name;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-16 z-20 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            {step !== 'confirmed' && (
              <button onClick={goBack} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg)]">
                <ArrowLeft size={16} style={{ color: 'var(--text-primary)' }} />
              </button>
            )}
            <div>
              <h1 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Book a Service</h1>
              <p className="text-xs" style={{ color: '#667477' }}>with {workerName}</p>
            </div>
          </div>
          <StepBar current={step} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        {/* STEP 1: Schedule */}
        {step === 'schedule' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>When do you need service?</h2>
            <p className="text-sm mb-5" style={{ color: '#667477' }}>Select a date and time that works for you.</p>

            <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <Calendar size={14} className="inline mr-1" /> Select Date
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                <Clock size={14} className="inline mr-1" /> Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className="py-2.5 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      background: timeSlot === slot ? '#0F4C5C' : 'var(--bg)',
                      borderColor: timeSlot === slot ? '#0F4C5C' : 'var(--border)',
                      color: timeSlot === slot ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              icon={<ArrowRight size={16} />}
              disabled={!date || !timeSlot}
              onClick={goNext}
            >
              Continue
            </Button>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 'location' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Confirm service location</h2>
            <p className="text-sm mb-5" style={{ color: '#667477' }}>Where should {workerName} come?</p>

            <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={14} className="inline mr-1" /> Full Address
              </label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button
                className="mt-2 text-xs font-medium" style={{ color: '#0F4C5C' }}
                onClick={() => setAddress('Using current location · Anna Nagar, Chennai 600040')}
              >
                📍 Use my current location
              </button>
            </div>

            <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Landmark (optional)</label>
              <input
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="Near metro station, park, etc."
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <Button className="w-full" size="lg" icon={<ArrowRight size={16} />} onClick={goNext}>
              Continue
            </Button>
          </div>
        )}

        {/* STEP 3: Price Summary */}
        {step === 'summary' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Price Summary</h2>
            <p className="text-sm mb-5" style={{ color: '#667477' }}>Transparent breakdown — no hidden charges.</p>

            {/* Worker row */}
            <div className="rounded-2xl border p-4 mb-4 flex items-center gap-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: '#0F4C5C' }}>
                {worker.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{workerName}</p>
                <p className="text-xs" style={{ color: '#667477' }}>{worker.service}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E8B70' }}>
                <ShieldCheck size={11} /> Verified
              </span>
            </div>

            {/* Booking details */}
            <div className="rounded-2xl border p-4 mb-4 grid grid-cols-2 gap-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#667477' }}>Date</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#667477' }}>Time</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{timeSlot}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#667477' }}>Location</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{address}</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Pricing Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#667477' }}>Base Service Charge</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span style={{ color: '#667477' }}>Cooperative Fund </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#e8f9f4', color: '#2E8B70' }}>10%</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{cooperativeFund}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span style={{ color: '#667477' }}>Platform Fee </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f0f4ff', color: '#4F6EF7' }}>10%</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{platformFee}</span>
                </div>
                <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="text-lg font-bold" style={{ color: '#0F4C5C' }}>₹{total}</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl text-xs leading-relaxed" style={{ background: '#f0f9fa', color: '#667477' }}>
                10% goes to the cooperative fund — supporting workers with insurance, training, and welfare benefits.
              </div>
            </div>

            <Button className="w-full" size="lg" icon={<ArrowRight size={16} />} onClick={goNext}>
              Proceed to Payment
            </Button>
          </div>
        )}

        {/* STEP 4: Payment */}
        {step === 'payment' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Choose Payment Method</h2>
            <p className="text-sm mb-5" style={{ color: '#667477' }}>All online payments are simulated — no real transaction is processed.</p>

            {/* Simulated notice */}
            <div className="flex gap-2 p-3 rounded-xl mb-5" style={{ background: '#FEF3C7' }}>
              <AlertCircle size={14} style={{ color: '#92400E', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                This is a demo environment. No real payment is charged. Selecting a payment method completes a simulated booking.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
                  style={{
                    background: paymentMethod === pm.id ? '#e8f4f7' : 'var(--surface)',
                    borderColor: paymentMethod === pm.id ? '#0F4C5C' : 'var(--border)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: paymentMethod === pm.id ? '#0F4C5C' : 'var(--bg)', color: paymentMethod === pm.id ? 'white' : '#667477' }}>
                    {pm.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{pm.label}</p>
                    <p className="text-xs" style={{ color: '#667477' }}>{pm.desc}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: paymentMethod === pm.id ? '#0F4C5C' : 'var(--border)' }}>
                    {paymentMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0F4C5C' }} />}
                  </div>
                </button>
              ))}
            </div>

            {/* UPI ID input */}
            {paymentMethod === 'upi' && (
              <div className="mb-5 rounded-2xl border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Enter UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            )}

            {/* Total recap */}
            <div className="flex items-center justify-between p-4 rounded-2xl mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Total to pay</span>
              <span className="text-xl font-bold" style={{ color: '#0F4C5C' }}>₹{total}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              loading={processing}
              onClick={handlePayment}
            >
              {processing ? 'Processing…' : paymentMethod === 'cash' ? 'Confirm Booking' : `Pay ₹${total} (Simulated)`}
            </Button>
          </div>
        )}

        {/* STEP 5: Confirmed */}
        {step === 'confirmed' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#e8f9f4' }}>
                <CheckCircle size={36} style={{ color: '#2E8B70' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Booking Confirmed!</h2>
              <p className="text-sm" style={{ color: '#667477' }}>Your service is scheduled. {workerName} will arrive on time.</p>
            </div>

            <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Booking Details</h3>
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: '#e8f9f4', color: '#2E8B70' }}>
                  #{bookingId}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <ShieldCheck size={14} style={{ color: '#2E8B70', marginTop: 2 }} />
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{workerName}</span>
                    <span className="ml-2 text-xs" style={{ color: '#2E8B70' }}>✓ Verified</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Calendar size={14} style={{ color: '#667477', marginTop: 2 }} />
                  <span style={{ color: '#667477' }}>
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {timeSlot}
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <MapPin size={14} style={{ color: '#667477', marginTop: 2 }} />
                  <span style={{ color: '#667477' }}>{address}</span>
                </div>
                <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: '#667477' }}>Total Paid</span>
                  <span className="font-bold" style={{ color: '#0F4C5C' }}>
                    ₹{total} {paymentMethod === 'cash' ? '(Cash on service)' : '(Simulated)'}
                  </span>
                </div>
              </div>
            </div>

            {/* OTP preview */}
            <div className="rounded-2xl border p-5 mb-4" style={{ background: '#f0f9fa', borderColor: '#b3d5df' }}>
              <h3 className="font-bold text-sm mb-1" style={{ color: '#0F4C5C' }}>Your OTPs</h3>
              <p className="text-xs mb-3" style={{ color: '#667477' }}>Two OTPs will be used — one on arrival, one on completion. Keep these safe.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'white', border: '1px solid #b3d5df' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#667477' }}>Arrival OTP</p>
                  <p className="text-xl font-bold" style={{ color: '#0F4C5C' }}>{arrivalOtp}</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'white', border: '1px solid #b3d5df' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#667477' }}>Completion OTP</p>
                  <p className="text-xl font-bold" style={{ color: '#2E8B70' }}>{completionOtp}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => navigate('/customer/bookings')}>
                View My Bookings
              </Button>
              <Button className="flex-1" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
