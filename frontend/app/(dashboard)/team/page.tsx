'use client';

import { useEffect, useState } from 'react';
import { Copy, Mail, Trash2, UserPlus, Users } from 'lucide-react';
import api from '@/lib/api/auth.api';
import { useWorkspaceStore } from '@/lib/store/workspace.store';
import { Button } from '@/components/ui/Button';

interface Member {
  userId: string;
  email: string;
  name: string;
  role: string;
  joinedAt: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
}

export default function TeamPage() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const workspaceId =
    typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : null;
  const active = workspaces.find((w) => w.id === workspaceId);
  const canManage = active?.role === 'owner' || active?.role === 'admin';

  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [mRes, iRes] = await Promise.all([
        api.get<Member[]>('/workspaces/members'),
        canManage
          ? api.get<Invite[]>('/workspaces/invites')
          : Promise.resolve({ data: [] }),
      ]);
      setMembers(mRes.data ?? []);
      setInvites(iRes.data ?? []);
    } catch {
      setMembers([]);
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [canManage]);

  const sendInvite = async () => {
    const res = await api.post('/workspaces/invites', { email, role });
    setLastLink(res.data.inviteLink);
    setEmail('');
    load();
  };

  const revokeInvite = async (id: string) => {
    await api.delete(`/workspaces/invites/${id}`);
    load();
  };

  const removeMember = async (userId: string) => {
    await api.delete(`/workspaces/members/${userId}`);
    load();
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--af-text-primary)]">Team</h1>
        <p className="text-sm text-[var(--af-text-muted)] mt-0.5">
          Invite teammates to {active?.name ?? 'this workspace'}
        </p>
      </div>

      {canManage && (
        <div className="af-glass rounded-2xl border border-[var(--af-border-subtle)] p-5 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <UserPlus size={16} className="text-violet-400" />
            Invite by email
          </h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@agency.com"
              className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-black/30 border border-[var(--af-border-subtle)] text-sm"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
              className="h-10 px-3 rounded-xl bg-black/30 border border-[var(--af-border-subtle)] text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={sendInvite} disabled={!email.trim()}>
              Send invite
            </Button>
          </div>
          {lastLink && (
            <div className="flex items-center gap-2 text-xs text-[var(--af-text-muted)] bg-black/20 p-3 rounded-xl">
              <Mail size={14} />
              <span className="flex-1 truncate">
                Share link: {typeof window !== 'undefined' ? window.location.origin : ''}
                {lastLink}
              </span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}${lastLink}`)}
                className="text-violet-400 hover:text-violet-300"
              >
                <Copy size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="af-glass rounded-2xl border border-[var(--af-border-subtle)] p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <Users size={16} />
          Members ({members.length})
        </h2>
        {loading ? (
          <p className="text-xs text-[var(--af-text-muted)]">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {members.map((m) => (
              <li
                key={m.userId}
                className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-[var(--af-border-subtle)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--af-text-primary)]">
                    {m.name || m.email}
                  </p>
                  <p className="text-[10px] text-[var(--af-text-muted)]">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] capitalize px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {m.role}
                  </span>
                  {canManage && m.role !== 'owner' && (
                    <button
                      type="button"
                      onClick={() => removeMember(m.userId)}
                      className="text-[var(--af-text-muted)] hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canManage && invites.length > 0 && (
        <div className="af-glass rounded-2xl border border-[var(--af-border-subtle)] p-5">
          <h2 className="text-sm font-semibold mb-3">Pending invites</h2>
          <ul className="space-y-2">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between text-xs p-3 rounded-xl bg-black/20"
              >
                <span>{inv.email}</span>
                <button
                  type="button"
                  onClick={() => revokeInvite(inv.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
