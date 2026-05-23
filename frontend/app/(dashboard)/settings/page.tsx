'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api/auth.api';
import { Instagram, Sparkles, AlertCircle, Check } from 'lucide-react';

interface Settings {
  instaConnected: boolean;
  instaUsername: string | null;
  aiTone: string;
  aiPrompt: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    instaConnected: false,
    instaUsername: null,
    aiTone: 'Friendly',
    aiPrompt: 'You are a helpful customer support assistant for a digital marketing business. Keep your replies concise and focus on guiding users toward our products.',
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data) {
          setSettings({
            instaConnected: res.data.instaConnected ?? false,
            instaUsername: res.data.instaUsername ?? null,
            aiTone: res.data.aiTone ?? 'Friendly',
            aiPrompt: res.data.aiPrompt ?? 'You are a helpful customer support assistant...',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const snapshot = { ...settings };
    setSaveLoading(true);
    setMessage({ type: 'success', text: 'Saving…' });
    try {
      await api.post('/settings', { aiTone: settings.aiTone, aiPrompt: settings.aiPrompt });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (e) {
      setSettings(snapshot);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConnectInsta = async () => {
    try {
      const response = await api.post('/settings/instagram/connect', {});
      const username = response.data?.instaUsername ?? response.data?.username;
      if (username || response.data?.instaConnected) {
        setSettings(prev => ({ ...prev, instaConnected: true, instaUsername: username ?? 'mock_business' }));
        setMessage({ type: 'success', text: 'Successfully connected Instagram account!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect Instagram account.' });
    }
  };

  const handleDisconnectInsta = async () => {
    try {
      await api.post('/settings/instagram/disconnect');
      setSettings(prev => ({ ...prev, instaConnected: false, instaUsername: null }));
      setMessage({ type: 'success', text: 'Instagram account disconnected.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to disconnect Instagram.' });
    }
  };

  const tones = [
    { id: 'friendly',     label: 'Friendly',      emoji: '😊' },
    { id: 'professional', label: 'Professional',  emoji: '💼' },
    { id: 'casual',       label: 'Casual',         emoji: '👋' },
    { id: 'sales',        label: 'Sales-Focused',  emoji: '🚀' },
  ];

  /* Loading spinner */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-main)' }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(129,140,248,0.3)', borderTopColor: '#818CF8' }}
        />
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 min-h-screen"
      style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid var(--border-glass)' }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Configure integrations and AI personalities
          </p>
        </div>
      </div>

      {/* ── Glass alert ────────────────────────────────── */}
      {message && (
        <div className={`glass-alert rounded-xl ${message.type === 'success' ? 'glass-alert-success' : 'glass-alert-error'}`}>
          {message.type === 'success'
            ? <Check size={15} className="shrink-0" />
            : <AlertCircle size={15} className="shrink-0" />}
          <span className="text-xs">{message.text}</span>
        </div>
      )}

      {/* ── Section 1: Instagram Integration ────────────── */}
      <div
        className="premium-card p-5 md:p-6 space-y-4"
      >
        <div
          className="flex items-center gap-3 pb-4"
          style={{ borderBottom: '1px solid var(--border-glass)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(236,72,153,0.10)',
              border: '1px solid rgba(236,72,153,0.20)',
              color: '#F472B6',
            }}
          >
            <Instagram size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Instagram Account Connection
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Link your Instagram Business profile to enable automations
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Status
            </div>
            {settings.instaConnected && settings.instaUsername ? (
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#34D399' }}>
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse" />
                Connected as @{settings.instaUsername}
              </span>
            ) : (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                No business account linked
              </span>
            )}
          </div>

          {settings.instaConnected ? (
            <button
              type="button"
              onClick={handleDisconnectInsta}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.30)',
                color: '#F87171',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              Disconnect Account
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectInsta}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-white"
              style={{
                background: 'linear-gradient(135deg, #818CF8, #C084FC)',
                boxShadow: '0 0 16px rgba(129,140,248,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(129,140,248,0.5)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(129,140,248,0.3)'}
            >
              Connect Instagram
            </button>
          )}
        </div>
      </div>

      {/* ── Section 2: AI Personality ───────────────────── */}
      <div className="premium-card p-5 md:p-6 space-y-5">
        <div
          className="flex items-center gap-3 pb-4"
          style={{ borderBottom: '1px solid var(--border-glass)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(129,140,248,0.10)',
              border: '1px solid rgba(129,140,248,0.20)',
              color: '#818CF8',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              AI Agent Personality
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Customize default response templates and parameters
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold mb-2.5 block" style={{ color: 'var(--text-primary)' }}>
              Select Response Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tones.map((tone) => {
                const isSelected = settings.aiTone.toLowerCase() === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, aiTone: tone.label }))}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={
                      isSelected
                        ? {
                            background: 'rgba(129,140,248,0.15)',
                            border: '1px solid var(--border-glow)',
                            color: 'var(--text-primary)',
                            boxShadow: '0 0 12px rgba(129,140,248,0.15)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-glass)',
                            color: 'var(--text-muted)',
                          }
                    }
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glow)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glass)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    <span>{tone.emoji}</span>
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-primary)' }}>
              AI Prompt Rules
            </label>
            <textarea
              rows={5}
              value={settings.aiPrompt}
              onChange={e => setSettings(prev => ({ ...prev, aiPrompt: e.target.value }))}
              placeholder="Tell the AI how to act, guidelines, prices, or links..."
              className="w-full rounded-xl p-3 text-xs outline-none resize-none leading-relaxed transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
            />
          </div>
        </div>

        <div
          className="pt-4 flex justify-end"
          style={{ borderTop: '1px solid var(--border-glass)' }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold transition-all text-white disabled:opacity-50 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC, #22D3EE)',
              boxShadow: '0 0 20px rgba(129,140,248,0.3)',
            }}
          >
            {saveLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-white/30 border-t-white animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
