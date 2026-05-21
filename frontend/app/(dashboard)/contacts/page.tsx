'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/auth.api';
import { TrendingUp, Users, AlertCircle } from 'lucide-react';

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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const getLeadBadge = (score: number) => {
    if (score >= 50) return { label: 'Hot Lead 🔥', color: 'bg-red-500/10 text-red-400' };
    if (score >= 20) return { label: 'Warm Lead', color: 'bg-orange-500/10 text-orange-400' };
    return { label: 'New Lead', color: 'bg-gray-800 text-gray-400' };
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 min-h-screen bg-[#0A0A0F] font-sans">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Contacts & Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your Instagram leads and contacts
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-gray-500 text-xs animate-pulse">Loading contacts...</div>
      )}

      {error && (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <p className="text-white font-medium text-sm">Unable to load contacts</p>
          <p className="text-gray-500 text-xs mt-1 mb-4">
            Check your backend connection
          </p>
          <button
            onClick={loadContacts}
            className="text-orange-400 text-sm hover:text-orange-300 transition-colors font-medium"
          >
            Try again →
          </button>
        </div>
      )}

      {!error && contacts.length === 0 && !loading && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
          <Users size={36} className="mx-auto text-gray-700 mb-3" />
          <p className="text-white font-medium text-sm">No contacts yet</p>
          <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
            Contacts appear automatically when users interact with your automations
          </p>
        </div>
      )}

      {contacts.length > 0 && !loading && !error && (
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#141414]/50 border-b border-[rgba(255,255,255,0.08)] text-[#A0A0A0] text-[10px] font-bold uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Lead Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {contacts.map((contact) => {
                const badge = getLeadBadge(contact.leadScore);
                return (
                  <tr key={contact.id} className="hover:bg-[#141414]/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold uppercase">
                        {contact.username?.charAt(0) || 'U'}
                      </div>
                      <span className="text-white text-xs font-semibold font-sans">
                        {contact.name || 'Anonymous'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A0A0A0] text-xs font-normal">@{contact.username}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-white">
                        <TrendingUp size={13} />
                        <span className="font-bold text-xs">{contact.leadScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${badge.color}`}>
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
