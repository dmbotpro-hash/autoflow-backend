import { create } from 'zustand';
import type { ActivityEvent } from '../types/analytics';

export type NotificationGroup = 'automation' | 'ai' | 'leads' | 'alerts';

export function eventGroup(type: ActivityEvent['type']): NotificationGroup {
  if (type === 'ai_replied' || type === 'faq_intercept') return 'ai';
  if (type === 'lead_captured') return 'leads';
  if (type === 'workflow_triggered' || type === 'dm_sent') return 'automation';
  return 'alerts';
}

interface NotificationsStore {
  events: ActivityEvent[];
  unreadCount: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setEvents: (events: ActivityEvent[]) => void;
  prependEvent: (event: ActivityEvent) => void;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  events: [],
  unreadCount: 0,
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setEvents: (events) =>
    set({
      events,
      unreadCount: events.length > 0 ? get().unreadCount : 0,
    }),
  prependEvent: (event) =>
    set((s) => {
      if (s.events.some((e) => e.id === event.id)) return s;
      return {
        events: [event, ...s.events].slice(0, 80),
        unreadCount: s.drawerOpen ? s.unreadCount : s.unreadCount + 1,
      };
    }),
  markAllRead: () => set({ unreadCount: 0 }),
}));
