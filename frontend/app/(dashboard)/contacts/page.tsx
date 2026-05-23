'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/auth.api';
import { TrendingUp, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { EmptyState } from '@/components/empty/EmptyState';
import { VirtualList } from '@/components/ui/VirtualList';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/contacts');
      setContacts(res.data ?? []);
    } catch (e) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const getLeadBadge = (score: number) => {
    if (score >= 50) return {
      label: 'Hot Lead 🔥',
      style: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' },
    };
    if (score >= 20) return {
      label: 'Warm Lead',
      style: { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#FBBF24' },
    };
    return {
      label: 'New Lead',
      style: { background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.15)', color: '#A5B4FC' },
    };
  };

  return (
    <div
      className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 min-h-screen"
      style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid var(--border-glass)' }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Contacts & Leads
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your Instagram leads and contacts
          </p>
        </div>
        <button
          onClick={loadContacts}
          disabled={loading}
          className="p-2 rounded-lg transition-colors disabled:opacity-40"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Loading skeleton ────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-16 rounded-xl empty-pulse"
              style={{ background: 'rgba(129,140,248,0.04)' }}
            />
          ))}
        </div>
      )}

      {/* ── Glass error alert ────────────────────────────── */}
      {error && !loading && (
        <div className="glass-alert glass-alert-error rounded-xl">
          <AlertCircle size={16} className="shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-xs">Unable to load contacts</p>
            <p className="text-[11px] mt-0.5 opacity-75">Check your backend connection</p>
          </div>
          <button
            onClick={loadContacts}
            className="text-[11px] font-semibold underline underline-offset-2 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────── */}
      {!error && contacts.length === 0 && !loading && (
        <EmptyState
          icon={<Users size={32} style={{ color: '#818CF8' }} />}
          title="No contacts yet"
          description="Contacts appear when users DM you or trigger a workflow. Connect Instagram and launch your first automation."
          primaryAction={{ label: 'Connect Instagram', href: '/settings' }}
          secondaryAction={{ label: 'Create workflow', href: '/workflows' }}
        />
      )}

      {/* ── Virtualized list (>25 contacts) ─────────────── */}
      {contacts.length > 0 && !loading && !error && contacts.length > 25 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <VirtualList
            items={contacts}
            height={Math.min(640, contacts.length * 72)}
            itemHeight={72}
            getKey={(c) => c.id}
            renderItem={(contact) => {
              const badge = getLeadBadge(contact.leadScore);
              return (
                <div
                  className="flex items-center gap-3 px-4 h-full"
                  style={{ borderBottom: '1px solid var(--border-glass)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold uppercase shrink-0"
                    style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                  >
                    {contact.username?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {contact.name || 'Anonymous'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{contact.username}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={badge.style}>
                    {badge.label}
                  </span>
                </div>
              );
            }}
          />
        </div>
      )}

      {/* ── Premium table (≤25 contacts) ────────────────── */}
      {contacts.length > 0 && !loading && !error && contacts.length <= 25 && (
        <div
          className="rounded-2xl table-responsive"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                {['User', 'Username', 'Lead Score', 'Status'].map(col => (
                  <th
                    key={col}
                    className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider select-none"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const badge = getLeadBadge(contact.leadScore);
                return (
                  <tr
                    key={contact.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border-glass)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(129,140,248,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold uppercase shrink-0"
                          style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                        >
                          {contact.username?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {contact.name || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      @{contact.username}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5" style={{ color: '#818CF8' }}>
                        <TrendingUp size={13} />
                        <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                          {contact.leadScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold"
                        style={badge.style}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
