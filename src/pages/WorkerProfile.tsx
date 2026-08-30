import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, ShieldCheck, MapPin, Clock, Briefcase, Award, Users,
  CheckCircle, ArrowLeft, MessageCircle
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useWorkers } from '../context/WorkerContext';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getWorker, error } = useWorkers();
  const worker = id ? getWorker(id) : undefined;
  if (error) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>Something went wrong. Please try again.</div>;
  if (!worker) return <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}><p>Worker profile not found.</p><Button onClick={() => navigate('/workers')}>Back to Workers</Button></div>;
  const reasons: string[] = [];

  const handleBook = () => {
    navigate(`/booking/${worker.id}`);
  };

  const trustCount = worker.completedJobs >= 100 ? '100+' : `${worker.completedJobs}`;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Workers
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'var(--cs-teal)' }}>
                    {worker.avatar}
                  </div>
                  {worker.verificationStatus === 'verified' && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#2E8B70' }}>
                      <ShieldCheck size={16} color="white" />
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{worker.name}</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{worker.service}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Star size={14} fill="#F4B942" color="#F4B942" />
                  <span className="font-semibold">{worker.rating}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({worker.reviews} reviews)</span>
                </div>
                {worker.verificationStatus === 'verified' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge variant="emerald" size="sm" icon={<CheckCircle size={10} />}>Verified Worker</Badge>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--cs-teal)' }} />
                  {worker.area}, {worker.city} · {worker.distance} km away
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={14} style={{ color: 'var(--cs-teal)' }} />
                  {worker.availability}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Briefcase size={14} style={{ color: 'var(--cs-teal)' }} />
                  {worker.experience} years experience
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Users size={14} style={{ color: '#2E8B70' }} />
                  Trusted by {trustCount} customers
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'var(--bg)' }}>
                <Users size={13} style={{ color: 'var(--cs-emerald)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Member of: {worker.cooperative}</span>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full" size="lg" onClick={handleBook}>Book Now</Button>
                <Button variant="secondary" className="w-full" icon={<MessageCircle size={15} />} onClick={() => toast('Messaging feature coming soon', 'info')}>Message</Button>
              </div>
            </div>

            {/* Trust signals */}
            <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Trust Signals</h3>

              <div className="space-y-2.5">
                {[
                  { label: 'Identity Verified', ok: true },
                  { label: 'Skills Verified', ok: true },
                  { label: 'Certification Verified', ok: worker.certifications.length > 0 },
                  { label: `${worker.completedJobs} Jobs Completed`, ok: true },
                  { label: `${worker.rating}★ Customer Rating`, ok: worker.rating >= 4.5 },
                  { label: `${worker.cancellationRate}% Cancellation Rate`, ok: worker.cancellationRate <= 5 },
                ].map(({ label, ok }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: ok ? '#2E8B70' : '#D9534F' }}>
                      <CheckCircle size={10} color="white" />
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Match reasons */}
            {reasons.length > 0 && (
              <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 14 }}>⚡</span>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Why Recommended</p>
                </div>
                {reasons.map(r => (
                  <div key={r} className="flex items-center gap-2 text-xs py-1">
                    <CheckCircle size={12} style={{ color: '#2E8B70' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>About</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{worker.bio}</p>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Service Pricing</h2>
              <div className="space-y-2">
                {worker.servicePricing && worker.servicePricing.map((sp: { service: string; min: number; max: number }) => (
                  <div key={sp.service} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{sp.service}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold" style={{ color: '#0F4C5C' }}>₹{sp.min}–₹{sp.max}</span>
                      <span className="text-xs ml-1" style={{ color: '#667477' }}>/visit</span>
                    </div>
                  </div>
                ))}
                {(!worker.servicePricing || worker.servicePricing.length === 0) && (
                  <p className="text-sm text-center py-4" style={{ color: '#667477' }}>
                    Base rate: {worker.priceLabel} per visit
                  </p>
                )}
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: '#667477' }}>
                Final price agreed between you and {worker.name} before service begins. 10% cooperative fund + 10% platform fee added at checkout.
              </p>
            </div>

            {/* Skill Passport */}
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#e8f4f7' }}>
                  <Award size={16} style={{ color: 'var(--cs-teal)' }} />
                </div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Skill Passport</h2>
                <Badge variant="emerald" size="sm" icon={<ShieldCheck size={10} />}>Cooperative Verified</Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {worker.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Certifications</h4>
                  <div className="space-y-2">
                    {worker.certifications.map(cert => (
                      <div key={cert} className="flex items-center gap-2">
                        <ShieldCheck size={13} style={{ color: '#2E8B70' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="text-center py-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--cs-teal)' }}>{worker.experience}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Years Exp</p>
                </div>
                <div className="text-center py-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--cs-teal)' }}>{worker.completedJobs}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Jobs Done</p>
                </div>
                <div className="text-center py-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                  <p className="text-xl font-bold" style={{ color: '#2E8B70' }}>{worker.rating}★</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Rating</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Customer Reviews</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
