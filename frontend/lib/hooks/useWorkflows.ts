'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '../api/auth.api';

export interface WorkflowUi {
  id: string;
  name: string;
  triggerType: 'comment' | 'dm' | 'follow';
  triggerValue: string;
  actionMessage: string;
  isActive: boolean;
  sentCount: number;
  conversionCount: number;
  config: any;
}

function mapFromApi(w: any): WorkflowUi {
  const keywords = w.config?.keywords ?? [];
  return {
    id: w.id,
    name: w.name,
    triggerType: w.trigger === 'comment_keyword' ? 'comment' : 'dm',
    triggerValue: keywords.join(', '),
    actionMessage: w.config?.dmMessage ?? '',
    isActive: w.isActive,
    sentCount: w.sentCount ?? 0,
    conversionCount: w.conversionCount ?? 0,
    config: w.config || {},
  };
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowUi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/workflows');
      setWorkflows((res.data ?? []).map(mapFromApi));
    } catch {
      setError('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload: {
    name: string;
    triggerType: 'comment' | 'dm' | 'follow';
    triggerValue: string;
    actionMessage: string;
  }) => {
    const keywords = payload.triggerValue
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    // Initialize default high-polish nodes layout (Trigger -> Delay -> Action)
    const initialNodes = [
      {
        id: 'node-trigger',
        type: 'trigger',
        title: payload.triggerType === 'comment' ? 'Comment Trigger' : 'DM Keyword Trigger',
        description: 'Starts when trigger criteria are met',
        position: { x: 120, y: 150 },
        config: {
          triggerType: payload.triggerType,
          keywords: keywords.length ? keywords : ['*'],
        },
      },
      {
        id: 'node-delay',
        type: 'delay',
        title: 'Delay Timer',
        description: 'Waits before proceeding',
        position: { x: 440, y: 150 },
        config: {
          delaySeconds: 5,
        },
      },
      {
        id: 'node-action',
        type: 'action',
        title: 'Send Outbound DM',
        description: 'Responds via direct message',
        position: { x: 760, y: 150 },
        config: {
          dmMessage: payload.actionMessage || 'Hello! Thanks for reaching out!',
        },
      },
    ];

    const initialEdges = [
      { id: 'edge-1', from: 'node-trigger', to: 'node-delay' },
      { id: 'edge-2', from: 'node-delay', to: 'node-action' },
    ];

    const { data } = await api.post('/workflows', {
      name: payload.name,
      trigger: 'comment_keyword',
      isActive: true,
      config: {
        keywords: keywords.length ? keywords : ['*'],
        dmMessage: payload.actionMessage,
        replyOnce: true,
        nodes: initialNodes,
        edges: initialEdges,
      },
    });
    const mapped = mapFromApi(data);
    setWorkflows((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateWorkflow = async (
    id: string,
    payload: {
      name?: string;
      isActive?: boolean;
      config?: any;
    },
  ) => {
    const { data } = await api.put(`/workflows/${id}`, payload);
    const mapped = mapFromApi(data);
    setWorkflows((prev) => prev.map((w) => (w.id === id ? mapped : w)));
    return mapped;
  };

  const toggle = async (id: string) => {
    const current = workflows.find((w) => w.id === id);
    if (!current) return;
    const nextActive = !current.isActive;
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: nextActive } : w)),
    );
    try {
      const { data } = await api.patch(`/workflows/${id}/toggle`);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isActive: data.isActive } : w)),
      );
    } catch {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isActive: current.isActive } : w)),
      );
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/workflows/${id}`);
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  return {
    workflows,
    loading,
    error,
    load,
    create,
    updateWorkflow,
    toggle,
    remove,
  };
}
