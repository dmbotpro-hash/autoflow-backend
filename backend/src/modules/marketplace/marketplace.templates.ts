export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  installs: number;
  trigger: string;
  config: {
    keywords: string[];
    dmMessage: string;
    replyOnce?: boolean;
  };
}

export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'comment-lead-magnet',
    name: 'Comment lead magnet',
    description: 'Send a free guide when users comment a keyword',
    category: 'Lead gen',
    installs: 1240,
    trigger: 'comment_keyword',
    config: {
      keywords: ['guide', 'free', 'pdf'],
      dmMessage: 'Here is your free guide link — enjoy! 📎',
      replyOnce: true,
    },
  },
  {
    id: 'story-reply-dm',
    name: 'Story reply → DM',
    description: 'Auto-DM everyone who replies to your story',
    category: 'Engagement',
    installs: 890,
    trigger: 'comment_keyword',
    config: {
      keywords: ['story', 'replied'],
      dmMessage: 'Thanks for engaging with our story! What would you like to know?',
    },
  },
  {
    id: 'pricing-inquiry',
    name: 'Pricing inquiry',
    description: 'Qualify pricing questions and share your offer',
    category: 'Sales',
    installs: 2100,
    trigger: 'comment_keyword',
    config: {
      keywords: ['price', 'cost', 'how much'],
      dmMessage: 'Great question! Our plans start at ₹999/mo. Want the full breakdown?',
    },
  },
  {
    id: 'webinar-registration',
    name: 'Webinar registration',
    description: 'Capture webinar signups from comment keywords',
    category: 'Events',
    installs: 560,
    trigger: 'comment_keyword',
    config: {
      keywords: ['webinar', 'register', 'live'],
      dmMessage: 'You are registered! We will DM you the join link 1 hour before.',
    },
  },
  {
    id: 'support-routing',
    name: 'Support routing',
    description: 'Route support DMs with FAQ-friendly opener',
    category: 'Support',
    installs: 430,
    trigger: 'comment_keyword',
    config: {
      keywords: ['help', 'support', 'issue'],
      dmMessage: 'Our team will help shortly. Meanwhile, check our FAQ: autoflow.app/help',
    },
  },
  {
    id: 'affiliate-offer',
    name: 'Affiliate offer blast',
    description: 'Share affiliate links to engaged commenters',
    category: 'Monetization',
    installs: 320,
    trigger: 'comment_keyword',
    config: {
      keywords: ['deal', 'discount', 'offer'],
      dmMessage: 'Exclusive deal for you — use code AUTOFLOW20 at checkout!',
    },
  },
];
