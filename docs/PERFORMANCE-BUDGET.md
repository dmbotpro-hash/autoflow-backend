# AutoFlow Performance Budget (Phase 10)

Targets align with Core Web Vitals for the **dashboard** (authenticated app) on mid-tier mobile (Moto G4 class) and desktop.

## Core Web Vitals targets

| Metric | Target | Notes |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Dashboard shell + first meaningful paint (nav + stats skeleton) |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Send message, toggle workflow, open notifications |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Reserve space for bottom nav on mobile; skeleton loaders |

## Bundle & runtime

| Area | Budget | Implementation |
|------|--------|----------------|
| Landing hero animation | Framer Motion only | No GSAP in repo; marketing uses CSS + Framer |
| Dashboard JS (First Load) | Monitor via `next build` | Code-split heavy routes (workflows canvas, analytics charts) |
| List rendering | Virtualize at 20+ rows | `VirtualList` on inbox (20+) and contacts (25+) |
| API polling | ≤ 30s intervals | Analytics `useAnalytics(30000)` |
| WebSocket | One connection per tab | `/inbox` namespace, workspace room |

## Interaction patterns (Phase 10)

- **Optimistic UI**: outbound DM send, workflow toggle, settings save (revert on error)
- **Reduced motion**: `prefers-reduced-motion` in `globals.css` + `tokens.css` + `useReducedMotion()` for FAB menu
- **Mobile**: bottom nav + FAB; inbox swipe-back from chat to list

## How to measure locally

```bash
cd frontend
npm run build
npm run start
```

Use Chrome DevTools → Lighthouse (Mobile) on `/dashboard` and `/inbox` while logged in.

## Future (post–Phase 10)

- `@tanstack/react-virtual` if lists exceed 500+ rows regularly
- Route-level `loading.tsx` skeletons
- Image optimization for avatars (`next/image`)
- Service worker / offline inbox (optional)
