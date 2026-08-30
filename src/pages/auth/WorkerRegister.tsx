import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, ShieldCheck, User, Briefcase, MapPin } from 'lucide-react';
import { useWorkers } from '../../context/WorkerContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const SERVICE_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'House Cleaner',
  'AC Technician', 'Appliance Repair', 'Mason', 'Gardener', 'Security Systems', 'Other',
];

const AVAILABILITY_OPTIONS = [
  'Available Now', 'Available Tomorrow', 'Weekdays Only', 'Weekends Only', 'By Appointment',
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Electrician': ['Wiring', 'Fan Installation', 'MCB/Fuse Box', 'Switch Repair', 'AC Wiring', 'Solar Panel'],
  'Plumber': ['Leak Repair', 'Pipe Fitting', 'Drainage Cleaning', 'Water Heater', 'Tank Fitting'],
  'Carpenter': ['Furniture Repair', 'Door/Window Fixing', 'Cupboard Work', 'False Ceiling', 'Custom Furniture'],
  'House Cleaner': ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Post-Construction', 'Carpet Cleaning'],
  'Painter': ['Interior Painting', 'Exterior Painting', 'Texture Work', 'Waterproofing', 'Wood Polishing'],
  'AC Technician': ['AC Installation', 'AC Servicing', 'Gas Refilling', 'AC Repair', 'Duct Cleaning'],
  'Appliance Repair': ['Washing Machine', 'Refrigerator', 'Microwave', 'Water Purifier', 'Geyser'],
};

type Step = 'basic' | 'professional' | 'identity' | 'review';

export default function WorkerRegister() {
  const navigate = useNavigate();
  const { addWorker } = useWorkers();
  const { registerCustomer } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [accountExists, setAccountExists] = useState(false);

  const [form, setForm] = useState({
    // Basic
    name: '',
    phone: '',
    email: '',
    password: '',
    // Professional
    service: '',
    skills: [] as string[],
    experience: '',
    priceMin: '',
    availability: 'Available Now',
    bio: '',
    // Identity
    aadhaarNumber: '',
    address: '',
    city: 'Chennai',
    area: '',
  });

  const set = (field: string, value: string | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      set('skills', [...form.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    set('skills', form.skills.filter(s => s !== skill));

  const suggestedSkills = SKILL_SUGGESTIONS[form.service] || [];

  const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'basic', label: 'Basic Info', icon: <User size={14} /> },
    { key: 'professional', label: 'Professional', icon: <Briefcase size={14} /> },
    { key: 'identity', label: 'Identity', icon: <ShieldCheck size={14} /> },
    { key: 'review', label: 'Review', icon: <CheckCircle size={14} /> },
  ];

  const stepIdx = STEPS.findIndex(s => s.key === step);

  const canProceedBasic = form.name && /^[+]?[0-9 ()-]{10,15}$/.test(form.phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password.length >= 8;
  const canProceedProfessional = form.service && form.experience && form.priceMin && form.bio.length >= 20;
  const canProceedIdentity = form.aadhaarNumber.replace(/\D/g, '').length === 12 && form.address && form.area;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await registerCustomer(form.name.trim(), form.email.trim(), form.phone.trim(), form.password, form.city.trim(), 'worker');
      await addWorker({
        name: form.name,
        phone: form.phone,
        email: form.email,
        aadhaarNumber: form.aadhaarNumber,
        address: form.address,
        city: form.city,
        area: form.area,
        service: form.service,
        skills: form.skills,
        experience: Number(form.experience),
        priceMin: Number(form.priceMin),
        bio: form.bio,
        availability: form.availability,
      });
      toast('Registration successful! Your worker profile has been created.', 'success');
      navigate('/worker/profile');
    } catch (error: any) {
      const isExistingEmail = error.code === 'auth/email-already-in-use';
      const isProfilePermissionError = error.code === 'permission-denied' || error.code === 'profile-save-failed';
      setAccountExists(isExistingEmail);
      toast(isExistingEmail ? 'An account with this email already exists. Please log in instead.' : isProfilePermissionError ? 'Unable to create your profile right now. Please try again.' : 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/login">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface)] transition-colors">
              <ArrowLeft size={16} style={{ color: 'var(--text-primary)' }} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Register as a Worker</h1>
            <p className="text-xs" style={{ color: '#667477' }}>Join CoServe and grow with the cooperative</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: i < stepIdx ? '#2E8B70' : i === stepIdx ? '#0F4C5C' : 'var(--border)',
                    color: i <= stepIdx ? 'white' : '#667477',
                  }}
                >
                  {i < stepIdx ? <CheckCircle size={14} /> : s.icon}
                </div>
                <span className="text-xs mt-1 hidden sm:block font-medium" style={{ color: i <= stepIdx ? '#0F4C5C' : '#667477' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-10 sm:w-16 h-0.5 mx-1 -mt-5 sm:-mt-4 shrink-0"
                  style={{ background: i < stepIdx ? '#2E8B70' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          {/* Step 1: Basic Info */}
          {step === 'basic' && (
            <div>
              <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Ravi Kumar"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone Number *</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 9876543210" type="tel"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Email Address *</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" type="email"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Password *</label>
                  <div className="relative">
                    <input value={form.password} onChange={e => set('password', e.target.value)}
                      type={showPw ? 'text' : 'password'} placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] pr-10"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#667477' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#667477' }}>Passwords are stored securely. Never share your password.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep('professional')} disabled={!canProceedBasic} icon={<ArrowRight size={14} />}>
                  Next: Professional Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Professional Info */}
          {step === 'professional' && (
            <div>
              <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Professional Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Service Category *</label>
                  <select value={form.service} onChange={e => { set('service', e.target.value); set('skills', []); }}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select service category</option>
                    {SERVICE_CATEGORIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Skills</label>
                  {suggestedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {suggestedSkills.map(s => (
                        <button key={s} type="button"
                          onClick={() => addSkill(s)}
                          disabled={form.skills.includes(s)}
                          className="px-2.5 py-1 rounded-lg text-xs border transition-colors"
                          style={{
                            background: form.skills.includes(s) ? '#0F4C5C' : 'var(--bg)',
                            borderColor: form.skills.includes(s) ? '#0F4C5C' : 'var(--border)',
                            color: form.skills.includes(s) ? 'white' : '#667477',
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                      placeholder="Add a skill and press Enter"
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <button type="button" onClick={() => addSkill(skillInput)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-white"
                      style={{ background: '#0F4C5C' }}>Add</button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white">
                          <span style={{ background: '#2E8B70', padding: '2px 8px', borderRadius: 8 }}>
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="ml-1.5 opacity-70 hover:opacity-100">×</button>
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Years of Experience *</label>
                    <input value={form.experience} onChange={e => set('experience', e.target.value)} type="number" min="0" max="40" placeholder="e.g. 5"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Base Rate (₹ per visit) *</label>
                    <input value={form.priceMin} onChange={e => set('priceMin', e.target.value)} type="number" min="100" placeholder="e.g. 350"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Availability</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY_OPTIONS.map(a => (
                      <button key={a} type="button" onClick={() => set('availability', a)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={{
                          background: form.availability === a ? '#0F4C5C' : 'var(--bg)',
                          borderColor: form.availability === a ? '#0F4C5C' : 'var(--border)',
                          color: form.availability === a ? 'white' : '#667477',
                        }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    About You / Bio * <span style={{ color: '#667477', fontWeight: 400 }}>(min. 20 characters)</span>
                  </label>
                  <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4}
                    placeholder="Describe your experience, what makes you stand out, and how you approach your work..."
                    className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  <p className="text-xs mt-1 text-right" style={{ color: form.bio.length >= 20 ? '#2E8B70' : '#667477' }}>
                    {form.bio.length} / 20 min
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep('basic')} icon={<ArrowLeft size={14} />}>Back</Button>
                <Button onClick={() => setStep('identity')} disabled={!canProceedProfessional} icon={<ArrowRight size={14} />}>
                  Next: Identity
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Identity */}
          {step === 'identity' && (
            <div>
              <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Identity Verification</h2>
              <div className="flex items-start gap-2 p-3 rounded-xl mb-5" style={{ background: '#FEF3C7' }}>
                <ShieldCheck size={14} style={{ color: '#92400E', marginTop: 1, flexShrink: 0 }} />
                <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                  Your Aadhaar number is used only for identity verification. It will be stored as <strong>XXXX XXXX XXXX</strong> and never shown publicly. Only authorized admins can access verification data.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Aadhaar Number * (12 digits)</label>
                  <input
                    value={form.aadhaarNumber}
                    onChange={e => set('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="Enter 12-digit Aadhaar number"
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  {form.aadhaarNumber.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: form.aadhaarNumber.length === 12 ? '#2E8B70' : '#D9534F' }}>
                      {form.aadhaarNumber.length === 12 ? '✓ Valid length — will be stored as XXXX XXXX ' + form.aadhaarNumber.slice(-4) : `${form.aadhaarNumber.length}/12 digits entered`}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Address *</label>
                  <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2}
                    placeholder="House/Flat No., Street, Locality"
                    className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      <MapPin size={11} className="inline mr-1" />Area / Locality *
                    </label>
                    <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Anna Nagar"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>City</label>
                    <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Chennai"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep('professional')} icon={<ArrowLeft size={14} />}>Back</Button>
                <Button onClick={() => setStep('review')} disabled={!canProceedIdentity} icon={<ArrowRight size={14} />}>
                  Review & Submit
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div>
              <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Review Your Details</h2>
              <div className="space-y-4">
                {/* Profile preview */}
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--bg)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: '#0F4C5C' }}>
                    {form.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{form.name}</p>
                    <p className="text-sm" style={{ color: '#667477' }}>{form.service} · {form.experience} yrs exp</p>
                    <p className="text-sm font-semibold" style={{ color: '#0F4C5C' }}>From ₹{form.priceMin}/visit</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      ⏳ Pending Verification
                    </span>
                  </div>
                </div>

                {[
                  { label: 'Phone', value: form.phone },
                  { label: 'Email', value: form.email },
                  { label: 'Aadhaar', value: 'XXXX XXXX ' + form.aadhaarNumber.slice(-4) },
                  { label: 'Location', value: `${form.area}, ${form.city}` },
                  { label: 'Availability', value: form.availability },
                  { label: 'Skills', value: form.skills.join(', ') || 'None added' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-semibold" style={{ color: '#667477' }}>{label}</span>
                    <span className="text-xs text-right max-w-[60%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}

                <div className="p-3 rounded-xl" style={{ background: '#e8f9f4' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#2E8B70' }}>
                    <strong>Note:</strong> Your profile will be <strong>Pending Verification</strong> until an admin reviews and approves it. You won't appear on the customer listing until verified.
                  </p>
                </div>
                {accountExists && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    <p>An account with this email already exists. Please log in instead.</p>
                    <button type="button" onClick={() => navigate('/login')} className="mt-2 font-semibold underline">Go to Login</button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep('identity')} icon={<ArrowLeft size={14} />}>Back</Button>
                <Button onClick={handleSubmit} loading={submitting} icon={<CheckCircle size={14} />}>
                  Submit Registration
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-center mt-4" style={{ color: '#667477' }}>
          Already registered?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#0F4C5C' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
