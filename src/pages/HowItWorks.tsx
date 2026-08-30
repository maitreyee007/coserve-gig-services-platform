import { Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

const STEPS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Search a Service',
    who: 'Customer',
    desc: 'Tell us what you need. Search by service, skill, location or worker name. Set urgency level and preferred schedule.',
  },
  {
    step: '02',
    icon: '⚡',
    title: 'Smart Matching',
    who: 'Platform',
    desc: 'Our rule-based Smart Matching Engine scores workers on Skill Match (35%), Availability (25%), Distance (15%), Rating (10%), Experience (10%) and Reliability (5%).',
  },
  {
    step: '03',
    icon: '🛡️',
    title: 'Verified Workers',
    who: 'Platform',
    desc: 'Only verified workers appear in results. Identity verified, skills verified, cooperative certified. Each worker has a Trust Score and Skill Passport.',
  },
  {
    step: '04',
    icon: '📅',
    title: 'Book the Service',
    who: 'Customer',
    desc: 'Multi-step booking: choose service → select worker → schedule date/time → enter address and description → confirm booking.',
  },
  {
    step: '05',
    icon: '✅',
    title: 'Worker Accepts',
    who: 'Worker',
    desc: 'Worker receives the request and accepts or rejects. If rejected, smart fallback automatically recommends alternatives.',
  },
  {
    step: '06',
    icon: '💰',
    title: 'Service & Payment',
    who: 'Both',
    desc: 'Service is completed. Transparent payment breakdown: 80% to worker, 10% cooperative fund, 10% platform sustainability fee.',
  },
  {
    step: '07',
    icon: '⭐',
    title: 'Rate & Review',
    who: 'Customer',
    desc: 'Rate the service (1–5 stars) and leave a review. This updates the worker\'s Trust Score, reliability and service quality metrics.',
  },
  {
    step: '08',
    icon: '📊',
    title: 'Community Impact',
    who: 'Everyone',
    desc: 'Data feeds cooperative dashboards, demand analytics, worker welfare monitoring and platform-wide community insights.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            How CoServe Works
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A transparent, step-by-step journey from service request to community impact — powered by verified cooperative workers.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className="flex gap-6 p-6 rounded-2xl border transition-shadow hover:shadow-md"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="text-3xl">{s.icon}</div>
                  <div
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#e8f4f7', color: 'var(--cs-teal)' }}
                  >
                    {s.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 min-h-4" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#e8f4f7', color: 'var(--cs-teal)' }}>
                      {s.who}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Matching detail */}
      <section className="py-16 border-t" style={{ background: 'var(--cs-teal)', borderColor: 'transparent' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(244,185,66,0.2)', color: '#F4B942' }}>
            <Zap size={12} /> Rule-Based Algorithm — Not AI or ML
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">The Smart Matching Engine</h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            CoServe uses an explainable rule-based scoring system. Every recommendation can be explained in plain language — no black box.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
            {[
              { label: 'Skill', pct: 35 },
              { label: 'Availability', pct: 25 },
              { label: 'Distance', pct: 15 },
              { label: 'Rating', pct: 10 },
              { label: 'Experience', pct: 10 },
              { label: 'Reliability', pct: 5 },
            ].map(({ label, pct }) => (
              <div key={label} className="flex flex-col items-center p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <span className="text-2xl font-extrabold text-white">{pct}%</span>
                <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ready to get started?</h2>
          <div className="flex gap-3 justify-center">
            <Link to="/register"><Button size="lg">Create Account</Button></Link>
            <Link to="/workers"><Button size="lg" variant="secondary">Browse Workers</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
