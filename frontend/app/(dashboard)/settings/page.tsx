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
            aiPrompt: res.data.aiPrompt ?? 'You are a helpful customer support assistant for a digital marketing business. Keep your replies concise and focus on guiding users toward our products.',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage(null);
    try {
      await api.post('/settings', {
        aiTone: settings.aiTone,
        aiPrompt: settings.aiPrompt,
      });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      console.error(e);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConnectInsta = async () => {
    try {
      const response = await api.post('/settings/instagram/connect');
      if (response.data?.username) {
        setSettings(prev => ({
          ...prev,
          instaConnected: true,
          instaUsername: response.data.username,
        }));
        setMessage({ type: 'success', text: 'Successfully connected Instagram account!' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not connect Instagram account.' });
      console.error(e);
    }
  };

  const handleDisconnectInsta = async () => {
    try {
      await api.post('/settings/instagram/disconnect');
      setSettings(prev => ({
        ...prev,
        instaConnected: false,
        instaUsername: null,
      }));
      setMessage({ type: 'success', text: 'Instagram account disconnected.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to disconnect Instagram.' });
      console.error(e);
    }
  };

  const tones = ['Professional', 'Friendly', 'Casual', 'Sarcastic'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sans">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Configure integrations and AI personalities
          </p>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-xs leading-relaxed animate-fade-in ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Instagram Integration */}
      <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 select-none">
            <Instagram size={18} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Instagram Account Connection</h3>
            <p className="text-[#A0A0A0] text-xs font-light mt-0.5">Link your Instagram Business profile to enable automations</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white">Status</div>
            <div className="text-[#A0A0A0] text-xs font-light mt-1">
              {settings.instaConnected && settings.instaUsername ? (
                <span className="flex items-center gap-1.5 text-green-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Connected as @{settings.instaUsername}
                </span>
              ) : (
                <span className="text-[#606060]">No business account linked</span>
              )}
            </div>
          </div>

          <div>
            {settings.instaConnected ? (
              <button
                type="button"
                onClick={handleDisconnectInsta}
                className="w-full sm:w-auto bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                Disconnect Account
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectInsta}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-92 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Connect Instagram
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: AI Automation Tuning */}
      <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 select-none">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">AI Agent Personality</h3>
            <p className="text-[#A0A0A0] text-xs font-light mt-0.5">Customize default response templates and parameters</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold text-white mb-2 block select-none">Select Response Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tones.map((tone) => {
                const isSelected = settings.aiTone === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, aiTone: tone }))}
                    className={`px-3 py-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-black border-[rgba(255,255,255,0.08)] text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Instructions */}
          <div>
            <label className="text-xs font-semibold text-white mb-2 block select-none">AI Prompt Rules</label>
            <textarea
              rows={5}
              value={settings.aiPrompt}
              onChange={e => setSettings(prev => ({ ...prev, aiPrompt: e.target.value }))}
              placeholder="Tell the AI how to act, guidelines, prices, or links..."
              className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-all resize-none leading-relaxed font-light"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full sm:w-auto bg-white hover:opacity-88 active:scale-95 text-black px-5 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            {saveLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
