import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variants = {
  primary: 'bg-[var(--cs-teal)] hover:bg-[var(--cs-teal-light)] text-white shadow-sm',
  secondary: 'bg-[var(--surface)] hover:bg-[var(--bg)] text-[var(--text-primary)] border border-[var(--border)] shadow-sm',
  ghost: 'bg-transparent hover:bg-[var(--bg)] text-[var(--text-primary)]',
  danger: 'bg-[#D9534F] hover:bg-[#c9403c] text-white shadow-sm',
  amber: 'bg-[var(--cs-amber)] hover:bg-[#e8a832] text-[#172326] shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--cs-teal)] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
