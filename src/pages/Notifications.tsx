import { useState } from 'react';
import { Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { NOTIFICATIONS } from '../data/mockData';
import Button from '../components/ui/Button';

const ICONS: Record<string, React.ReactNode> = {
  booking: <CheckCircle size={16} style={{ color: '#2E8B70' }} />,
  message: <Info size={16} style={{ color: 'var(--cs-teal)' }} />,
  success: <CheckCircle size={16} style={{ color: '#2E8B70' }} />,
  info: <Info size={16} style={{ color: '#F4B942' }} />,
  warning: <AlertCircle size={16} style={{ color: '#D9534F' }} />,
};

export default function Notifications() {
  const [notes, setNotes] = useState(NOTIFICATIONS);

  const markAll = () => setNotes(n => n.map(x => ({ ...x, isRead: true })));
  const markRead = (id: number) => setNotes(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));

  const unread = notes.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
            {unread > 0 && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{unread} unread</p>}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAll}>Mark all read</Button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {notes.map((n, i) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-[var(--bg)]
                  ${i < notes.length - 1 ? 'border-b' : ''}
                  ${!n.isRead ? '' : ''}`}
                style={{ borderColor: 'var(--border)', background: !n.isRead ? '#f0f9fa' : undefined }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg)' }}>
                  {ICONS[n.type] || <Bell size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold' : 'font-medium'}`} style={{ color: 'var(--text-primary)' }}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--cs-teal)' }} />
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
