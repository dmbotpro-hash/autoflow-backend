import { create } from 'zustand';

export type CopilotMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
};

export type CopilotMode = 'chat' | 'workflow-draft';

interface AiCopilotState {
  open: boolean;
  mode: CopilotMode;
  messages: CopilotMessage[];
  isThinking: boolean;
  draftWorkflow: WorkflowDraft | null;
  recommendations: string[];
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setMode: (mode: CopilotMode) => void;
  addMessage: (msg: CopilotMessage) => void;
  updateLastMessage: (content: string, done?: boolean) => void;
  setThinking: (thinking: boolean) => void;
  setDraftWorkflow: (draft: WorkflowDraft | null) => void;
  setRecommendations: (recs: string[]) => void;
  clearMessages: () => void;
}

export type WorkflowDraft = {
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    config: Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};

export const useAiCopilotStore = create<AiCopilotState>((set) => ({
  open: false,
  mode: 'chat',
  messages: [],
  isThinking: false,
  draftWorkflow: null,
  recommendations: [],

  setOpen: (open) => set({ open }),
  toggleOpen: () => set((s) => ({ open: !s.open })),
  setMode: (mode) => set({ mode }),

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  updateLastMessage: (content, done = false) =>
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...last,
          content,
          isStreaming: !done,
        };
      }
      return { messages: msgs };
    }),

  setThinking: (isThinking) => set({ isThinking }),
  setDraftWorkflow: (draftWorkflow) => set({ draftWorkflow }),
  setRecommendations: (recommendations) => set({ recommendations }),
  clearMessages: () => set({ messages: [] }),
}));
