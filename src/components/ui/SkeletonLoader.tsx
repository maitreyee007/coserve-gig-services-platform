export function SkeletonWorkerCard() {
  return (
    <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="skeleton w-14 h-14 rounded-2xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-18 rounded-full" />
      </div>
      <div className="skeleton h-8 w-full mt-3 rounded-lg" />
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-8 flex-1 rounded-xl" />
        <div className="skeleton h-8 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="skeleton h-3 w-24 mb-2" />
      <div className="skeleton h-7 w-16" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="skeleton w-9 h-9 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3 w-36 mb-1.5" />
        <div className="skeleton h-3 w-24" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
  );
}
