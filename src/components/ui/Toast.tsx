import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface Ctx {
  toast: (msg: string, type?: ToastType) => void;
}

const ToastCtx = createContext<Ctx>({ toast: () => {} });
export const useToast = () => useContext(ToastCtx);

let nextId = 0;

const icons = {
  success: <CheckCircle size={16} className="text-[#2E8B70]" />,
  error: <AlertCircle size={16} className="text-[#D9534F]" />,
  info: <Info size={16} style={{ color: 'var(--cs-teal)' }} />,
};

function ToastItem({ t, onDismiss }: { t: Toast; onDismiss: () => void }) {
  return (
    <div
      className="toast-enter flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-64 max-w-80"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {icons[t.type]}
      <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{t.message}</span>
      <button onClick={onDismiss} className="shrink-0 p-0.5 rounded hover:opacity-70">
        <X size={14} style={{ color: 'var(--text-muted)' }} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem
            key={t.id}
            t={t}
            onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
