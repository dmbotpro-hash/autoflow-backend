'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import api from '@/lib/api/auth.api';
import { Button } from '@/components/ui/Button';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing invite token');
    }
  }, [token]);

  const accept = async () => {
    if (!token) return;
    setStatus('loading');
    try {
      const res = await api.post('/workspaces/invites/accept', { token });
      setStatus('ok');
      setMessage('You joined the workspace!');
      if (res.data?.workspaceId) {
        localStorage.setItem('workspaceId', res.data.workspaceId);
      }
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (e: unknown) {
      setStatus('error');
      const err = e as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message ?? 'Could not accept invite. Log in with the invited email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full af-glass rounded-2xl border border-[var(--af-border-subtle)] p-8 text-center space-y-4">
        <h1 className="text-lg font-bold text-[var(--af-text-primary)]">Team invite</h1>
        <p className="text-sm text-[var(--af-text-muted)]">{message || 'Accept to join this workspace'}</p>
        {status !== 'ok' && (
          <Button onClick={accept} disabled={!token || status === 'loading'} loading={status === 'loading'}>
            Accept invite
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen af-ambient-bg" />}>
      <AcceptInviteContent />
    </Suspense>
  );
}
