'use client';

import { useEffect, useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/auth.api';
import { Button } from '@/components/ui/Button';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  installs: number;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get<MarketplaceTemplate[]>('/marketplace/templates').then((res) => {
      setTemplates(res.data ?? []);
    });
  }, []);

  const categories = ['All', ...new Set(templates.map((t) => t.category))];
  const filtered =
    filter === 'All' ? templates : templates.filter((t) => t.category === filter);

  const install = async (id: string) => {
    setInstalling(id);
    try {
      await api.post(`/marketplace/templates/${id}/install`);
      router.push('/workflows');
    } finally {
      setInstalling(null);
    }
  };

  return (
    <div className="dashboard-page max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Sparkles size={22} style={{ color: '#818CF8' }} />
          Template marketplace
        </h1>
        <p className="text-sm text-[var(--af-text-muted)] mt-0.5">
          Browse and install proven automation templates into your workspace
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className="px-3 py-1.5 rounded-full text-xs border transition-colors"
            style={filter === c ? {
              border: '1px solid var(--border-glow)',
              background: 'rgba(129,140,248,0.12)',
              color: '#C7D2FE',
            } : {
              border: '1px solid var(--border-glass)',
              color: 'var(--text-muted)',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="premium-card p-5 flex flex-col"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
              {t.category}
            </span>
            <h3 className="text-sm font-semibold text-[var(--af-text-primary)] mt-2">
              {t.name}
            </h3>
            <p className="text-xs text-[var(--af-text-muted)] mt-2 flex-1 leading-relaxed">
              {t.description}
            </p>
            <p className="text-[10px] text-[var(--af-text-muted)] mt-3">
              {t.installs.toLocaleString()} installs
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              onClick={() => install(t.id)}
              loading={installing === t.id}
            >
              <Download size={14} />
              Install to workspace
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
