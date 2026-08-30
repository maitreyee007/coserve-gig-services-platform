import { MapPin, Clock, Briefcase, Star, ShieldCheck, Users, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

interface Worker {
  id: string;
  name: string;
  avatar: string;
  service: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  matchScore?: number;
  experience: number;
  distance: number;
  priceLabel: string;
  priceMin: number;
  availability: string;
  availableNow?: boolean;
  cooperative: string;
  verificationStatus: string;
  area?: string;
  eta?: string;
  isEmergency?: boolean;
}

interface Props {
  worker: Worker;
  showMatch?: boolean;
  matchReasons?: string[];
  onBook?: () => void;
  emergency?: boolean;
}

export default function WorkerCard({ worker, showMatch, matchReasons, onBook, emergency }: Props) {
  const navigate = useNavigate();
  const isVerified = worker.verificationStatus === 'verified';
  const trustCount = worker.completedJobs >= 100 ? '100+' : `${worker.completedJobs}`;

  const handleBook = () => {
    if (onBook) onBook();
    navigate(`/booking/${worker.id}`);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Emergency / Match header strip */}
      {emergency && (
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#D9534F' }}>
          <span className="text-xs font-bold text-white uppercase tracking-wider">⚡ Emergency Available</span>
          {worker.eta && (
            <span className="ml-auto text-xs text-white font-medium">ETA: {worker.eta}</span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold"
              style={{ background: '#0F4C5C' }}
            >
              {worker.avatar}
            </div>
            {isVerified && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#2E8B70' }}
              >
                <ShieldCheck size={10} color="white" strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* Name, service, rating */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{worker.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#667477' }}>{worker.service}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E8B70' }}>
                  <CheckCircle size={11} /> Verified Worker
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Trust signals */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#172326' }}>
            <Star size={12} fill="#F4B942" color="#F4B942" />
            {worker.rating} <span className="font-normal" style={{ color: '#667477' }}>({worker.reviews})</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#667477' }}>
            <Users size={11} />
            Trusted by {trustCount} customers
          </span>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs" style={{ color: '#667477' }}>
          <span className="flex items-center gap-1">
            <Briefcase size={11} /> {worker.experience} yrs exp
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {worker.distance} km away
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${worker.availableNow ? 'bg-[#2E8B70]' : 'bg-[#F4B942]'}`} />
            {worker.availability}
          </span>
          {emergency && worker.eta && (
            <span className="flex items-center gap-1 font-semibold" style={{ color: '#D9534F' }}>
              ⏱ {worker.eta}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <span className="text-base font-bold" style={{ color: '#0F4C5C' }}>{worker.priceLabel}</span>
            <span className="text-xs ml-1" style={{ color: '#667477' }}>per visit</span>
          </div>
        </div>

        {/* Cooperative */}
        <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg)' }}>
          <Users size={11} style={{ color: '#2E8B70' }} />
          <span className="text-xs truncate" style={{ color: '#667477' }}>
            Member of: {worker.cooperative}
          </span>
        </div>

        {/* Match reasons */}
        {showMatch && matchReasons && matchReasons.length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg" style={{ background: 'var(--bg)' }}>
            <p className="text-xs font-semibold mb-1.5" style={{ color: '#667477' }}>Why matched:</p>
            <div className="space-y-1">
              {matchReasons.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#2E8B70' }}>
                  <CheckCircle size={10} className="shrink-0" /> {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link to={`/workers/${worker.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">View Profile</Button>
          </Link>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleBook}
            style={emergency ? { background: '#D9534F' } : undefined}
          >
            {emergency ? 'Request Help' : 'Book Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
