export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  triggerType: 'comment' | 'dm' | 'follow';
  triggerValue: string;
  actionMessage: string;
  emoji: string;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'comment-dm',
    name: 'Comment → DM',
    description: 'Reply to comment keywords with an automated DM',
    triggerType: 'comment',
    triggerValue: 'price, info, link',
    actionMessage: 'Hey! Thanks for commenting — here is the link you asked for 🚀',
    emoji: '💬',
  },
  {
    id: 'dm-welcome',
    name: 'DM welcome',
    description: 'Greet new DMs with a friendly opener',
    triggerType: 'dm',
    triggerValue: 'hello, hi, hey',
    actionMessage: 'Welcome! How can we help you today?',
    emoji: '👋',
  },
  {
    id: 'follow-hook',
    name: 'Follow hook',
    description: 'Engage users who follow your account',
    triggerType: 'follow',
    triggerValue: '*',
    actionMessage: 'Thanks for following! Want our free guide?',
    emoji: '✨',
  },
];
