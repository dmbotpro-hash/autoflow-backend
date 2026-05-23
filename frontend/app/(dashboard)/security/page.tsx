'use client';

import { useEffect, useState } from 'react';
import { History, Monitor, Shield, Trash2 } from 'lucide-react';
import api from '@/lib/api/auth.api';
import { Button } from '@/components/ui/Button';

interface Session {
  id: string;
  device: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
}

interface LoginEvent {
  id: string;
  device?: string;
  ipAddress?: string;
  success: boolean;
  createdAt: string;
}

export default function SecurityPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, hRes] = await Promise.all([
        api.get<Session[]>('/security/sessions'),
        api.get<LoginEvent[]>('/security/login-history'),
      ]);
      setSessions(sRes.data ?? []);
      setHistory(hRes.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const revoke = async (id: string) => {
    await api.delete(`/security/sessions/${id}`);
    load();
  };

  const revokeAll = async () => {
    await api.post('/security/sessions/revoke-all');
    load();
  };

  const timeAgo = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--af-text-primary)] flex items-center gap-2">
          <Shield size={22} className="text-violet-400" />
          Security
        </h1>
        <p className="text-sm text-[var(--af-text-muted)] mt-0.5">
          Active sessions, devices, and login history
        </p>
      </div>

      <div className="af-glass rounded-2xl border border-[var(--af-border-subtle)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Monitor size={16} />
            Active sessions
          </h2>
          <Button variant="ghost" size="sm" onClick={revokeAll}>
            Revoke all others
          </Button>
        </div>
        {loading ? (
          <p className="text-xs text-[var(--af-text-muted)]">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-[var(--af-text-muted)]">No active sessions</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-[var(--af-border-subtle)] text-xs"
              >
                <div>
                  <p className="font-medium text-[var(--af-text-primary)]">{s.device}</p>
                  <p className="text-[var(--af-text-muted)] mt-0.5">
                    Started {timeAgo(s.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => revoke(s.id)}
                  className="text-[var(--af-text-muted)] hover:text-red-400 p-2"
                  aria-label="Revoke session"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="af-glass rounded-2xl border border-[var(--af-border-subtle)] p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <History size={16} />
          Login history
        </h2>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {history.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between p-3 rounded-xl bg-black/20 text-xs"
            >
              <div>
                <p className="text-[var(--af-text-primary)]">
                  {e.device ?? 'Unknown'} · {e.ipAddress ?? '—'}
                </p>
                <p className="text-[var(--af-text-muted)]">{timeAgo(e.createdAt)}</p>
              </div>
              <span
                className={
                  e.success ? 'text-emerald-400' : 'text-red-400'
                }
              >
                {e.success ? 'Success' : 'Failed'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
