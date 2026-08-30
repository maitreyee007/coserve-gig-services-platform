import { Star, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COOPERATIVES } from '../data/mockData';
import Badge from '../components/ui/Badge';

export default function Cooperatives() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Partner Cooperatives</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Worker-owned cooperative societies powering CoServe's verified workforce.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Explainer */}
        <div className="rounded-2xl border p-6 mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>What is a Cooperative?</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A worker cooperative is a business owned and managed by its workers. On CoServe, registered cooperatives provide collective verification, welfare support, earnings management and workforce coordination — giving workers more power and customers more trust.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[
              { label: 'Collective Verification', desc: 'All members verified by cooperative and platform admin' },
              { label: 'Fair Earnings', desc: '10% cooperative fund supports members collectively' },
              { label: 'Welfare Support', desc: 'Workload monitoring and income security for all members' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex gap-3">
                <CheckCircle size={16} style={{ color: '#2E8B70' }} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {COOPERATIVES.map(c => (
            <div
              key={c.id}
              className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-md"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ background: 'var(--cs-teal)' }}
                >
                  {c.shortName[0]}{c.shortName[1]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{c.name}</h3>
                    <Badge variant="emerald" size="sm" icon={<ShieldCheck size={10} />}>{c.badge}</Badge>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {c.speciality} · {c.district}, {c.city}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Reg: {c.registrationNumber}</p>
                </div>
              </div>

              <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>

              <div className="grid grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'Members', value: c.members },
                  { label: 'Verified', value: c.verifiedMembers },
                  { label: 'Jobs', value: c.completedJobs },
                  { label: 'Rating', value: <span className="flex items-center gap-0.5 justify-center"><Star size={11} fill="#F4B942" color="#F4B942" />{c.rating}</span> },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center py-2 rounded-xl" style={{ background: 'var(--bg)' }}>
                    <div className="text-base font-bold" style={{ color: 'var(--cs-teal)' }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>

              <Link
                to={`/workers?cooperative=${encodeURIComponent(c.name)}`}
                className="flex items-center justify-center gap-2 mt-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-90"
                style={{ background: '#e8f4f7', color: 'var(--cs-teal)' }}
              >
                <Users size={14} /> View {c.verifiedMembers} Verified Workers
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
