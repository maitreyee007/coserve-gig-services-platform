import { type ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
  sub?: string;
}

export default function StatCard({ label, value, icon, trend, trendUp, accent, sub }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border transition-shadow duration-150 hover:shadow-md"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-2xl font-bold truncate" style={{ color: accent || 'var(--text-primary)' }}>{value}</p>
          {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg)' }}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-[#2E8B70]' : 'text-[#D9534F]'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  );
}
