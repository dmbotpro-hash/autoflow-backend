'use client';

import { useEffect, useState } from 'react';
import api from '../api/auth.api';

export interface SearchResultItem {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
}

export interface GlobalSearchResults {
  contacts: SearchResultItem[];
  workflows: SearchResultItem[];
  conversations: SearchResultItem[];
}

const empty: GlobalSearchResults = {
  contacts: [],
  workflows: [],
  conversations: [],
};

export function useGlobalSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<GlobalSearchResults>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!enabled || q.length < 2) {
      setResults(empty);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get<GlobalSearchResults>('/search', {
          params: { q, limit: 6 },
        });
        setResults(res.data ?? empty);
      } catch {
        setResults(empty);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, enabled]);

  return { results, loading };
}

/** Natural-language style routing hints for command palette */
export function matchNlCommand(query: string): { label: string; href: string } | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  if (/^(go to|open|show)\s+(inbox|messages)/.test(q) || q === 'inbox') {
    return { label: 'Open Inbox', href: '/inbox' };
  }
  if (/^(go to|open|show)\s+(workflow|automation)/.test(q) || q.includes('workflow')) {
    return { label: 'Open Workflows', href: '/workflows' };
  }
  if (/^(go to|open|show)\s+(contact|lead)/.test(q) || q.includes('contact')) {
    return { label: 'Open Contacts', href: '/contacts' };
  }
  if (/^(go to|open|show)\s+analytics/.test(q) || q.includes('analytics')) {
    return { label: 'Open Analytics', href: '/analytics' };
  }
  if (/connect\s+instagram|instagram\s+connect/.test(q)) {
    return { label: 'Connect Instagram', href: '/settings' };
  }
  if (/create\s+(a\s+)?workflow|new\s+workflow|new\s+campaign/.test(q)) {
    return { label: 'Create workflow', href: '/workflows' };
  }
  if (/ai\s+settings|configure\s+ai/.test(q)) {
    return { label: 'AI settings', href: '/settings' };
  }
  return null;
}
