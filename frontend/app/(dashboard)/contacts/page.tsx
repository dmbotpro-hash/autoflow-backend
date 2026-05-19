'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api/auth.api';
import { TrendingUp } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get('/contacts')
      .then((res) => setContacts(res.data ?? []))
      .catch((e) => {
        setError('Failed to load contacts');
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 min-h-screen bg-black font-sans">
      {/* Title Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
          Contacts & Leads
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-1 font-normal">
          Leads captured from your Instagram automations are listed here.
        </p>
      </div>

      <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead className="bg-[#141414]/50 border-b border-[rgba(255,255,255,0.08)] text-[#A0A0A0] text-[10px] font-bold uppercase tracking-wider select-none">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Lead Score</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
            {contacts.map((contact) => (
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
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white"
                  >
                    {contact.leadScore > 50 ? 'HOT LEAD' : 'PROSPECT'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {contacts.length === 0 && !loading && (
          <div className="p-12 text-center text-[#606060] text-xs font-light">No contacts yet. Leads captured from your Instagram automations will appear here.</div>
        )}

        {loading && (
          <div className="p-12 text-center text-[#606060] text-xs animate-pulse">Loading...</div>
        )}

        {error && <div className="p-6 text-red-400 text-xs font-medium">{error}</div>}
      </div>
    </div>
  );
}
