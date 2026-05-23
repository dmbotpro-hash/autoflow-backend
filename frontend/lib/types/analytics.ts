export type ActivityEventType =
  | 'dm_sent'
  | 'ai_replied'
  | 'faq_intercept'
  | 'workflow_triggered'
  | 'lead_captured'
  | 'inbound_dm';

export type ActivitySeverity = 'info' | 'success' | 'warning' | 'ai';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  severity: ActivitySeverity;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsOverview {
  metrics: {
    totalMessages: number;
    totalContacts: number;
    activeConversations: number;
    activeWorkflows: number;
    totalAutomations: number;
    aiReplies: number;
    faqIntercepts: number;
    hoursSaved: number;
    deliveryRate: number;
  };
  chart: Array<{
    day: string;
    dms: number;
    comments: number;
    aiReplies: number;
  }>;
  funnel: Array<{ stage: string; count: number; percent: number }>;
  workflows: Array<{
    id: string;
    name: string;
    isActive: boolean;
    trigger: string;
    executions: number;
  }>;
  heatmap: Array<{ hour: number; count: number }>;
}
