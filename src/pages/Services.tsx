import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Zap } from 'lucide-react';
import { SERVICES, SERVICE_IMAGES, SERVICE_IMAGES_BY_NAME, SERVICE_IMAGE_POSITIONS, SERVICE_IMAGE_POSITIONS_BY_NAME } from '../data/mockData';

const CATEGORIES = ['All', 'Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Appliance', 'Gardening', 'Security'];

export default function Services() {
  const services = SERVICES;
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = services.filter(s =>
    (category === 'All' || s.category === category) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Our Services</h1>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Professional home and community services delivered by verified cooperative workers.
          </p>
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)]"
              style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                category === c ? 'text-white' : 'hover:bg-[var(--surface)]'
              }`}
              style={category === c
                ? { background: 'var(--cs-teal)' }
                : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(s => (
            <Link
              key={s.id}
              to={`/workers?service=${encodeURIComponent(s.name)}`}
              className="group rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <img
                src={SERVICE_IMAGES[s.id] ?? SERVICE_IMAGES_BY_NAME[s.name]}
                alt={`${s.name} professional at work`}
                className="w-full h-36 sm:h-40 lg:h-44 mb-4 rounded-lg object-cover"
                style={{ objectPosition: SERVICE_IMAGE_POSITIONS[s.id] ?? SERVICE_IMAGE_POSITIONS_BY_NAME[s.name] }}
              />
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--cs-teal)' }}>From ₹{s.basePrice}</span>
                <span
                  className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--cs-teal)' }}
                >
                  <Zap size={11} /> Find Workers <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No services found</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-sm font-medium" style={{ color: 'var(--cs-teal)' }}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
