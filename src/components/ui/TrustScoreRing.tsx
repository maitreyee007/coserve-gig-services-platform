interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZES = {
  sm: { r: 22, cx: 28, sz: 56, stroke: 4, fontSize: '10px', labelSize: '8px' },
  md: { r: 36, cx: 44, sz: 88, stroke: 5, fontSize: '16px', labelSize: '10px' },
  lg: { r: 52, cx: 64, sz: 128, stroke: 7, fontSize: '22px', labelSize: '12px' },
};

export default function TrustScoreRing({ score, size = 'md', showLabel = true }: Props) {
  const cfg = SIZES[size];
  const circumference = 2 * Math.PI * cfg.r;
  const filled = (score / 100) * circumference;
  const color = score >= 85 ? '#2E8B70' : score >= 70 ? '#F4B942' : '#D9534F';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: cfg.sz, height: cfg.sz }}>
      <svg width={cfg.sz} height={cfg.sz} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cfg.cx}
          cy={cfg.cx}
          r={cfg.r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={cfg.stroke}
        />
        <circle
          cx={cfg.cx}
          cy={cfg.cx}
          r={cfg.r}
          fill="none"
          stroke={color}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: cfg.fontSize, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        {showLabel && (
          <span style={{ fontSize: cfg.labelSize, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.2 }}>Trust</span>
        )}
      </div>
    </div>
  );
}
