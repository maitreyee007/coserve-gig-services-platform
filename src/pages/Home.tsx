import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Search, ShieldCheck, Users, Zap } from 'lucide-react';
import { SERVICES, SERVICE_IMAGES, SERVICE_IMAGE_POSITIONS } from '../data/mockData';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const customerDestination = (destination: string) => {
    if (!user) {
      navigate('/login', { state: { redirectTo: destination } });
      return;
    }

    if (user.role === 'customer') navigate(destination);
    else if (user.role === 'worker') navigate('/worker/dashboard');
    else if (user.role === 'cooperative') navigate('/cooperative/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
    else navigate('/login', { state: { redirectTo: destination } });
  };

  const requireAuthForLink = (destination: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      event.preventDefault();
      navigate('/login', { state: { redirectTo: destination } });
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    customerDestination(`/workers?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="page-enter" style={{ background: 'var(--bg)' }}>
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: '#e8f4f7', color: 'var(--cs-teal)' }}>
                <Users size={12} /> Cooperative Gig Services Platform
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                <span style={{ color: 'var(--text-primary)' }}>Trusted Services.</span><br />
                <span style={{ color: 'var(--cs-teal)' }}>Empowered Workers.</span><br />
                <span style={{ color: 'var(--cs-emerald)' }}>Stronger Communities.</span>
              </h1>
              <p className="text-lg mt-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Connect with verified skilled workers from cooperative societies for reliable household and community services.</p>
              <form onSubmit={handleSearch} className="mt-7 w-full">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--cs-teal)' }} />
                  <input type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search: Electrician, Plumber, Cleaner..." className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cs-teal)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </form>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button size="lg" icon={<Search size={16} />} onClick={() => customerDestination('/services')}>Find a Service</Button>
                <button type="button" onClick={() => customerDestination('/emergency')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#D9534F' }}>Need Help Now?</button>
                <Button variant="secondary" size="lg" onClick={() => {
                  if (!user) {
                    navigate('/login', { state: { redirectTo: '/worker/register' } });
                    return;
                  }
                  navigate('/worker/register');
                }}>Join as a Worker</Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="max-w-sm rounded-3xl border p-8 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <ShieldCheck size={40} style={{ color: 'var(--cs-emerald)' }} />
                <h2 className="text-2xl font-bold mt-5" style={{ color: 'var(--text-primary)' }}>Verified local service</h2>
                <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Compare live worker profiles, rates and availability before you book.</p>
                <div className="mt-6 space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p className="flex items-center gap-2"><CheckCircle size={15} style={{ color: 'var(--cs-emerald)' }} /> Firebase-linked profiles</p>
                  <p className="flex items-center gap-2"><CheckCircle size={15} style={{ color: 'var(--cs-emerald)' }} /> Admin-reviewed verification</p>
                  <p className="flex items-center gap-2"><CheckCircle size={15} style={{ color: 'var(--cs-emerald)' }} /> Transparent booking details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8"><div><h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Popular Services</h2><p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Choose a service to find available workers.</p></div><Link to="/services" onClick={requireAuthForLink('/services')} className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>View all <ArrowRight size={14} /></Link></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.slice(0, 4).map(service => <Link key={service.id} to={`/workers?service=${encodeURIComponent(service.name)}`} onClick={requireAuthForLink(`/workers?service=${encodeURIComponent(service.name)}`)} className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}><img src={SERVICE_IMAGES[service.id]} alt={service.name} className="w-full h-36 object-cover" style={{ objectPosition: SERVICE_IMAGE_POSITIONS[service.id] }} /><div className="p-4"><h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{service.name}</h3><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{service.description}</p><p className="text-sm font-semibold mt-3" style={{ color: 'var(--cs-teal)' }}>Find workers <ArrowRight size={13} className="inline" /></p></div></Link>)}
          </div>
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: 'var(--border)' }}><div className="max-w-3xl mx-auto px-4 sm:px-6 text-center"><Zap size={28} className="mx-auto" style={{ color: 'var(--cs-amber)' }} /><h2 className="text-3xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>Services coordinated by cooperatives</h2><p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Workers are reviewed, profiles stay connected to Firebase, and customers can book with clear service details.</p></div></section>
      <footer className="border-t py-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}><div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4"><span className="font-bold" style={{ color: 'var(--cs-teal)' }}>CoServe</span><div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}><Link to="/about">About</Link><Link to="/how-it-works">How It Works</Link><Link to="/cooperatives">Cooperatives</Link></div></div></footer>
    </div>
  );
}
