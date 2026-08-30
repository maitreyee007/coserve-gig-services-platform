import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, CheckCircle, ShieldCheck, Star, Users, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { EMERGENCY_CATEGORIES } from '../data/mockData';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useWorkers, WorkerRecord } from '../context/WorkerContext';

type Step = 'category' | 'location' | 'workers' | 'tracking';

function safetyColor(id: string) {
  const map: Record<string, string> = {
    electrical: '#FEF3C7',
    water: '#DBEAFE',
    appliance: '#F3F4F6',
    lockout: '#FEF9C3',
    other: '#FEE2E2',
  };
  return map[id] || '#F3F4F6';
}

export default function Emergency() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workers } = useWorkers();
  const emergencyWorkers = workers.filter(w => w.verificationStatus === 'verified' && w.accountStatus === 'active' && w.availableNow);
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<typeof EMERGENCY_CATEGORIES[0] | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('42, 4th Street, Anna Nagar, Chennai');
  const [selectedWorker, setSelectedWorker] = useState<WorkerRecord | null>(null);
  const [trackingStage, setTrackingStage] = useState(2); // 0-indexed: 0=found,1=accepted,2=on-way

  const TRACKING_STAGES = [
    { label: 'Worker Found', done: true },
    { label: 'Worker Accepted', done: true },
    { label: 'Worker On The Way', done: trackingStage >= 2 },
    { label: 'Arrived · OTP', done: trackingStage >= 3 },
    { label: 'Service In Progress', done: trackingStage >= 4 },
    { label: 'Completed · OTP', done: trackingStage >= 5 },
  ];

  const handleSelectCategory = (cat: typeof EMERGENCY_CATEGORIES[0]) => {
    setSelectedCategory(cat);
    setStep('location');
  };

  const handleConfirmLocation = () => {
    setStep('workers');
  };

  const handleRequestWorker = (worker: WorkerRecord) => {
    setSelectedWorker(worker);
    setTrackingStage(2);
    setStep('tracking');
    toast('Emergency request sent! Worker is on the way.', 'success');
  };

  const simulateProgress = () => {
    if (trackingStage < 5) setTrackingStage(s => s + 1);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Red header */}
      <div style={{ background: '#D9534F' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            {step !== 'category' && (
              <button
                onClick={() => {
                  if (step === 'location') setStep('category');
                  else if (step === 'workers') setStep('location');
                  else if (step === 'tracking') setStep('workers');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} color="white" />
                <h1 className="font-bold text-white text-lg">Emergency Service</h1>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Get connected with a verified worker near you urgently
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            {(['category', 'location', 'workers', 'tracking'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: step === s ? 24 : 8,
                    background: step === s || ['category', 'location', 'workers'].indexOf(step) > ['category', 'location', 'workers'].indexOf(s as Step)
                      ? 'white' : 'rgba(255,255,255,0.35)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {/* STEP 1: Select emergency category */}
        {step === 'category' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>What's the emergency?</h2>
            <p className="text-sm mb-5" style={{ color: '#667477' }}>Select the type of issue so we can find the right verified worker.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {EMERGENCY_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="text-left p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 text-left"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{cat.label}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.examples.slice(0, 2).map(ex => (
                      <span key={ex} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg)', color: '#667477' }}>{ex}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Confirm location */}
        {step === 'location' && selectedCategory && (
          <div>
            <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: safetyColor(selectedCategory.id) }}>
              <span className="text-2xl">{selectedCategory.icon}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: '#172326' }}>{selectedCategory.label}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#667477' }}>{selectedCategory.safetyNote}</p>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Confirm your location</h2>

            <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={14} className="inline mr-1" /> Your Address
              </label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button
                className="mt-2 text-xs font-medium flex items-center gap-1"
                style={{ color: '#0F4C5C' }}
                onClick={() => setLocation('Using current location · Anna Nagar, Chennai')}
              >
                📍 Use my current location
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Describe the problem (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder={`e.g., ${selectedCategory.examples[0]}`}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D9534F]"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <Button onClick={handleConfirmLocation} style={{ background: '#D9534F' }} className="w-full" size="lg" icon={<ArrowRight size={16} />}>
              Find Available Workers Now
            </Button>
          </div>
        )}

        {/* STEP 3: Emergency worker results */}
        {step === 'workers' && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-white" style={{ background: '#D9534F' }}>
                <AlertTriangle size={11} /> Emergency Matching
              </div>
              <span className="text-sm" style={{ color: '#667477' }}>
                {emergencyWorkers.length} verified workers available near you
              </span>
            </div>

            <div className="space-y-4">
              {emergencyWorkers.map((w, i) => (
                <div
                  key={w.id}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: 'var(--surface)', borderColor: i === 0 ? '#D9534F' : 'var(--border)' }}
                >
                  {/* Header */}
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: i === 0 ? '#D9534F' : '#f5f5f5' }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: i === 0 ? 'white' : '#667477' }}>
                      ⚡ Emergency Available
                    </span>
                    <span className="text-xs font-semibold" style={{ color: i === 0 ? 'white' : '#667477' }}>
                      ETA: {w.eta}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0" style={{ background: '#0F4C5C' }}>
                        {w.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{w.name}</h3>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E8B70' }}>
                            <ShieldCheck size={11} /> Verified
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#667477' }}>{w.service}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: '#667477' }}>
                          <span className="flex items-center gap-1"><Star size={11} fill="#F4B942" color="#F4B942" /> {w.rating}</span>
                          <span className="flex items-center gap-1"><Users size={11} /> {w.completedJobs}+ customers</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {w.distance} km</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#2E8B70]" /> Available Now</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-bold" style={{ color: '#0F4C5C' }}>From {w.priceLabel.split('–')[0]}</div>
                        <div className="text-xs" style={{ color: '#667477' }}>per visit</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg)' }}>
                      <Users size={11} style={{ color: '#2E8B70' }} />
                      <span className="text-xs truncate" style={{ color: '#667477' }}>Member of: {w.cooperative}</span>
                    </div>

                    <button
                      onClick={() => handleRequestWorker(w)}
                      className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ background: i === 0 ? '#D9534F' : '#0F4C5C' }}
                    >
                      🚨 Request Emergency Help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Live tracking */}
        {step === 'tracking' && selectedWorker && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white mb-3" style={{ background: '#D9534F' }}>
                🚨 Emergency Request Active
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Worker On The Way</h2>
              <p className="text-sm mt-1" style={{ color: '#667477' }}>
                {selectedWorker.name} is heading to your location · ETA {selectedWorker.eta}
              </p>
            </div>

            {/* Worker info card */}
            <div className="rounded-2xl border p-4 mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold" style={{ background: '#0F4C5C' }}>
                  {selectedWorker.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedWorker.name}</p>
                    <span className="text-xs font-semibold" style={{ color: '#2E8B70' }}>✓ Verified</span>
                  </div>
                  <p className="text-sm" style={{ color: '#667477' }}>{selectedWorker.service}</p>
                  <div className="flex gap-3 mt-1 text-xs" style={{ color: '#667477' }}>
                    <span>📍 {selectedWorker.distance} km away</span>
                    <span>⏱ ETA {selectedWorker.eta}</span>
                    <span>From {selectedWorker.priceLabel.split('–')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifecycle tracker */}
            <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Live Status</h3>
              <div className="space-y-3">
                {TRACKING_STAGES.map((stage, i) => (
                  <div key={stage.label} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: stage.done ? '#2E8B70' : 'var(--border)' }}
                    >
                      {stage.done ? <CheckCircle size={13} color="white" /> : (
                        <span className="text-xs font-bold" style={{ color: '#667477' }}>{i + 1}</span>
                      )}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: stage.done ? 'var(--text-primary)' : '#667477', fontWeight: stage.done ? 600 : 400 }}
                    >
                      {stage.label}
                    </span>
                    {i === 2 && stage.done && trackingStage === 2 && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color: '#2E8B70' }}>
                        <Clock size={11} /> {selectedWorker.eta}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* OTP section */}
            {trackingStage >= 3 && trackingStage < 5 && (
              <div className="rounded-2xl border p-5 mb-4" style={{ background: '#f0f9fa', borderColor: '#b3d5df' }}>
                <h3 className="font-bold mb-2" style={{ color: '#0F4C5C' }}>
                  {trackingStage === 3 ? 'Arrival OTP Verification' : 'Completion OTP Verification'}
                </h3>
                <p className="text-sm mb-3" style={{ color: '#667477' }}>
                  {trackingStage === 3
                    ? 'Your worker has arrived. Share this OTP with them to confirm arrival.'
                    : 'Service is done. Share this OTP to confirm completion.'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {['4', '8', '2', '7'].map((d, i) => (
                      <div key={i} className="w-10 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold"
                        style={{ borderColor: '#0F4C5C', color: '#0F4C5C', background: 'white' }}>
                        {d}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: '#667477' }}>Share with {selectedWorker.name}</p>
                </div>
              </div>
            )}

            {/* Demo controls */}
            <div className="rounded-2xl border p-4 mb-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#667477' }}>Demo Controls (for presentation)</p>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="secondary" onClick={simulateProgress} disabled={trackingStage >= 5}>
                  Advance to Next Stage →
                </Button>
                {trackingStage >= 5 && (
                  <Button size="sm" onClick={() => navigate('/customer/bookings')}>
                    View Receipt & Rate
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
