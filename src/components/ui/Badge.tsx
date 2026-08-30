import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'verified' | 'pending' | 'rejected' | 'amber' | 'teal' | 'neutral' | 'emerald';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
}

const variants = {
  verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  emerald: 'bg-[#e8f5f0] text-[#1a6b52] border border-[#b3dcd0]',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  amber: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
  teal: 'bg-[#e8f4f7] text-[#0F4C5C] border border-[#b3d5df]',
  neutral: 'bg-[var(--bg)] text-[var(--text-secondary)] border border-[var(--border)]',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

export default function Badge({ children, variant = 'neutral', size = 'md', icon, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
