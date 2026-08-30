import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkers } from '../context/WorkerContext';
import WorkerCard from '../components/ui/WorkerCard';
import { SkeletonWorkerCard } from '../components/ui/SkeletonLoader';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const SORT_OPTIONS = [
  { value: 'match', label: 'Recommended' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'available', label: 'Available Now' },
];

const PRICE_TIERS = [
  { value: '', label: 'Any Budget' },
  { value: 'affordable', label: '💚 Affordable (under ₹400)' },
  { value: 'standard', label: '🔵 Standard (₹400–₹599)' },
  { value: 'premium', label: '⭐ Premium (₹600+)' },
];

const SERVICE_OPTIONS = ['All Services', 'Electrician', 'Plumber', 'House Cleaner', 'Carpenter', 'Painter', 'Appliance Technician'];

export default function Workers() {
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { workers: allWorkers, error: workerError } = useWorkers();
  const [query, setQuery] = useState(params.get('q') || '');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [service, setService] = useState(params.get('service') || 'All Services');
  const [sortBy, setSortBy] = useState('match');
  const [priceTier, setPriceTier] = useState('');
  const [priceRange, setPriceRange] = useState([200, 1000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  // Only show verified, active workers on customer page
  const publicWorkers = allWorkers.filter(w => w.verificationStatus === 'verified' && w.accountStatus !== 'suspended');
  const [workers, setWorkers] = useState(publicWorkers);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters: string[] = [];
  if (verifiedOnly) activeFilters.push('Verified Only');
  if (availableNow) activeFilters.push('Available Now');
  if (priceTier) activeFilters.push(PRICE_TIERS.find(p => p.value === priceTier)?.label || priceTier);
  if (service !== 'All Services') activeFilters.push(service);

  const triggerSearch = () => {
    setLoading(false);
    setSearched(true);
    let result = [...publicWorkers];

      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(w =>
          w.name.toLowerCase().includes(q) ||
          w.service.toLowerCase().includes(q) ||
          w.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      if (service !== 'All Services') {
        const serviceAliases: Record<string, string[]> = {
          'Electrical Repair': ['Electrician'],
          'Plumbing': ['Plumber'],
          'House Cleaning': ['House Cleaner'],
          'Carpentry': ['Carpenter'],
          'Painting': ['Painter'],
          'Appliance Repair': ['Appliance Technician', 'Appliance Repair', 'AC Technician'],
        };
        const matchingServices = [service, ...(serviceAliases[service] || [])];
        result = result.filter(w => matchingServices.includes(w.service));
      }
      if (verifiedOnly) result = result.filter(w => w.verificationStatus === 'verified');
      if (availableNow) result = result.filter(w => w.availableNow);
      if (priceTier) result = result.filter(w => w.priceTier === priceTier);
      result = result.filter(w => w.priceMin >= priceRange[0] && w.priceMin <= priceRange[1]);

      if (sortBy === 'price_asc') result.sort((a, b) => Number(a.priceMin) - Number(b.priceMin));
      else if (sortBy === 'price_desc') result.sort((a, b) => Number(b.priceMin) - Number(a.priceMin));
      else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'nearest') result.sort((a, b) => a.distance - b.distance);
      else if (sortBy === 'available') result.sort((a, b) => (b.availableNow ? 1 : 0) - (a.availableNow ? 1 : 0));
      else result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    setWorkers(result);
  };

  useEffect(() => { triggerSearch(); }, [allWorkers, query, service, sortBy, priceTier, priceRange, verifiedOnly, availableNow]);

  const clearFilter = (label: string) => {
    if (label === 'Verified Only') setVerifiedOnly(false);
    if (label === 'Available Now') setAvailableNow(false);
    if (PRICE_TIERS.some(p => p.label === label)) setPriceTier('');
    if (SERVICE_OPTIONS.includes(label)) setService('All Services');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sticky search header */}
      <div className="sticky top-16 z-20 border-b shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {workerError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {workerError}
              </div>
            )}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {/* Location */}
            <div className="relative w-full sm:w-48 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📍</span>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Search query */}
            <div className="relative flex-1 min-w-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#667477' }} />
              <input
                type="text"
                placeholder="Search by skill, service or name..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && triggerSearch()}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <Button onClick={triggerSearch} loading={loading} icon={<Zap size={14} />} className="shrink-0">
              {loading ? 'Matching...' : 'Find Workers'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setFiltersOpen(!filtersOpen)}
              icon={<SlidersHorizontal size={14} />}
              className="shrink-0"
            >
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>
          </div>

          {/* Sort tabs */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                style={sortBy === opt.value
                  ? { background: '#0F4C5C', color: 'white' }
                  : { background: 'var(--bg)', color: '#667477', border: '1px solid var(--border)' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mt-3 p-4 rounded-2xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Service */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#667477' }}>Service</label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Budget tier */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#667477' }}>Budget</label>
                  <select
                    value={priceTier}
                    onChange={e => setPriceTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    {PRICE_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#667477' }}>
                    Price Range: ₹{priceRange[0]}–₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min={200} max={1000} step={50}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#0F4C5C]"
                  />
                  <div className="flex justify-between text-xs mt-0.5" style={{ color: '#667477' }}>
                    <span>₹200</span><span>₹1,000</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-2 justify-center">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-[#0F4C5C] cursor-pointer" />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Verified workers only</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={availableNow} onChange={e => setAvailableNow(e.target.checked)} className="w-4 h-4 accent-[#2E8B70] cursor-pointer" />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Available now</span>
                  </label>
                </div>
              </div>
              <Button size="sm" onClick={() => setFiltersOpen(false)} className="mt-3">Apply Filters</Button>
            </div>
          )}

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {activeFilters.map(f => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#e8f4f7', color: '#0F4C5C' }}
                >
                  {f}
                  <button onClick={() => clearFilter(f)} aria-label={`Remove ${f} filter`}>
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setVerifiedOnly(false); setAvailableNow(false); setPriceTier(''); setService('All Services'); setPriceRange([200, 1000]); }}
                className="text-xs px-2 py-1 rounded-full"
                style={{ color: '#667477' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency banner */}
      <div className="border-b" style={{ background: '#FFF5F5', borderColor: '#FEE2E2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} style={{ color: '#D9534F' }} />
            <span className="text-sm font-medium" style={{ color: '#991B1B' }}>
              Need urgent help? Get connected with an available verified worker near you.
            </span>
          </div>
          <Link to="/emergency">
            <button className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90" style={{ background: '#D9534F' }}>
              Emergency Service
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {searched && !loading && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#e8f4f7', color: '#0F4C5C' }}>
              <CheckCircle size={12} /> Verified Workers
            </div>
            <span className="text-sm" style={{ color: '#667477' }}>
              {workers.length} verified worker{workers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <SkeletonWorkerCard key={i} />)}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface)' }}>
              <Search size={26} style={{ color: '#667477' }} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No Workers Found</h3>
            <p className="text-sm mb-4" style={{ color: '#667477' }}>
              Try a different search or adjust your filters.
            </p>
            <Button variant="secondary" onClick={() => { setQuery(''); setPriceTier(''); setService('All Services'); setVerifiedOnly(false); setAvailableNow(false); setPriceRange([200, 1000]); }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workers.map(w => (
              <WorkerCard
                key={w.id}
                worker={w}
                showMatch={searched}
                matchReasons={[]}
                onBook={() => toast(`Opening booking for ${w.name}…`, 'info')}
              />
            ))}
          </div>
        )}

        {/* Fallback alternatives if searching */}
        {searched && !loading && workers.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#667477' }}>
              Smart Fallback — If your preferred worker is unavailable, CoServe automatically recommends alternatives from the same cooperative.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
