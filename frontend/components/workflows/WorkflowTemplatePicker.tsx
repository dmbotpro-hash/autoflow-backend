'use client';

import { WORKFLOW_TEMPLATES } from '@/lib/workflow-templates';
import type { WorkflowTemplate } from '@/lib/workflow-templates';

export function WorkflowTemplatePicker({
  onSelect,
  compact = false,
}: {
  onSelect: (template: WorkflowTemplate) => void | Promise<void>;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--af-text-muted)]">
        Quick-start templates
      </p>
      <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {WORKFLOW_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className="text-left p-3 rounded-xl border border-[var(--af-border-subtle)] bg-black/20 hover:border-violet-500/30 hover:bg-violet-500/5 transition-colors"
          >
            <span className="text-lg">{t.emoji}</span>
            <p className="text-xs font-semibold text-[var(--af-text-primary)] mt-1">{t.name}</p>
            <p className="text-[10px] text-[var(--af-text-muted)] mt-0.5 line-clamp-2">
              {t.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
