import { Link } from 'react-router-dom';
import {
  Users, Briefcase, Wallet, Star, TrendingUp, ArrowRight,
  BarChart2, CheckCircle, ShieldCheck, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { DEMAND_DATA, EARNINGS_DATA } from '../../data/mockData';
import { useWorkers } from '../../context/WorkerContext';

const MEMBER_STATUS = [
  { name: 'Verified', value: 21, color: '#2E8B70' },
  { name: 'Pending', value: 2, color: '#F4B942' },
  { name: 'Inactive', value: 1, color: '#DCE5E3' },
];

export default function CooperativeDashboard() {
  const { workers } = useWorkers();
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Anna Nagar Electrical Workers Cooperative
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="emerald" icon={<ShieldCheck size={10} />}>Verified Cooperative</Badge>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Reg: TN/COOP/2021/0482</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: '#FEF3C7' }}>
            <AlertCircle size={13} style={{ color: '#92400E' }} />
            <span className="text-xs font-medium" style={{ color: '#92400E' }}>2 pending verifications</span>
          </div>
          <Link to="/cooperative/members">
            <Button icon={<Users size={14} />}>Manage Members</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value="24" icon={<Users size={18} style={{ color: 'var(--cs-teal)' }} />} sub="21 verified" />
        <StatCard label="Active Jobs" value="8" icon={<Briefcase size={18} style={{ color: '#2E8B70' }} />} trend="+3 vs last week" trendUp />
        <StatCard label="Monthly Earnings" value="₹1.28L" icon={<Wallet size={18} style={{ color: '#F4B942' }} />} trend="+12% vs last month" trendUp />
        <StatCard label="Avg Rating" value="4.8★" icon={<Star size={18} style={{ color: '#F4B942' }} />} sub="412 jobs done" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Demand chart */}
        <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Service Demand (This Month)</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Requests by service category in your area</p>
            </div>
            <Link to="/cooperative/analytics" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
              Full analytics <ArrowRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEMAND_DATA} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="service" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }} />
              <Bar dataKey="requests" radius={[6, 6, 0, 0]}>
                {DEMAND_DATA.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Member status donut */}
        <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Member Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={MEMBER_STATUS} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                {MEMBER_STATUS.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Pie>
              <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MEMBER_STATUS.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings over time */}
      <div className="rounded-2xl border p-5 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Cooperative Earnings Trend</h2>
          <Link to="/cooperative/earnings" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
            Full report <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Collective Fund (this month)</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--cs-teal)' }}>₹12,840</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Member Earnings</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: '#2E8B70' }}>₹1,15,560</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg per Member</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>₹5,503</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={EARNINGS_DATA}>
            <defs>
              <linearGradient id="coopGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E8B70" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2E8B70" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Earnings']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }} />
            <Area type="monotone" dataKey="earnings" stroke="#2E8B70" strokeWidth={2} fill="url(#coopGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Member list */}
      <div className="rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Top Performing Members</h2>
          <Link to="/cooperative/members" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--cs-teal)' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Member', 'Service', 'Jobs', 'Rating', 'Earnings', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {workers.slice(0, 4).map(w => (
                <tr key={w.id} className="hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: 'var(--cs-teal)' }}>
                        {w.avatar}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{w.service}</td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{w.completedJobs}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1">
                      <Star size={12} fill="#F4B942" color="#F4B942" />
                      <span className="font-medium">{w.rating}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: '#2E8B70' }}>—</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="emerald" size="sm" icon={<CheckCircle size={10} />}>Verified</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
