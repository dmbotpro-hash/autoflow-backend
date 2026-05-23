# AutoFlow — ULTIMATE UI/UX Master Prompt → Phased Roadmap

Yeh document aapke **ULTIMATE MASTER UI/UX + PRODUCT EXPERIENCE** prompt ko implement karne ke liye phase-by-phase plan hai.

**Current baseline (approx.):** ~32–38% of full vision  
**Target:** Enterprise futuristic AI automation OS (ManyChat + Linear + Framer + Stripe level feel)

---

## Phase 0 — Foundation & Alignment (Week 0–1)

**Goal:** Jo already hai usko stable karo; nayi UI layer ke liye base ready karo.

### Prompt coverage
- Core dark aesthetic (`#0A0A0F`, gradients)
- Basic dashboard routes (dashboard, inbox, workflows, contacts, settings, billing)
- Auth flow (login/signup)
- Backend wiring (inbox API, workflows CRUD, settings, billing usage)
- Inter font + partial Framer on marketing

### Deliverables
| # | Task | Status |
|---|------|--------|
| 0.1 | Auth refresh + session persist | ✅ Done |
| 0.2 | API-connected inbox / workflows / billing | ✅ Done |
| 0.3 | Document current vs target gap | ✅ This file |
| 0.4 | Fix production blockers (Meta webhook env, IG tokens) | 🔲 Ops |

### Exit criteria
- User login → dashboard → inbox/workflows without 401/404
- Team agrees phase order & design references (Linear, Framer, etc.)

---

## Phase 1 — Design System & Theme Engine (Week 1–2) ✅ Started

**Goal:** Poori app ek hi design language follow kare — tokens, states, themes.

**Implemented (2025):** `styles/tokens.css`, UI primitives, `ThemeProvider`, `/design-system` page.

### Prompt sections mapped
- Global Design Language
- Color System (dark + light + accents)
- Typography System (Inter / Geist)
- Design Token System
- Component State System (default → AI processing)
- Theme Engine (Dark / Light / AMOLED / dynamic accent)
- Accessibility (focus, contrast baseline)

### Deliverables
| # | Task |
|---|------|
| 1.1 | `tokens.css` / Tailwind extend: spacing, radius, shadows, glow, z-index, blur |
| 1.2 | Semantic colors: `#050816`, `#0B1020`, electric blue, neon purple, AI cyan |
| 1.3 | Typography scale: hero / h1–h4 / body / caption |
| 1.4 | Shared UI primitives: `Button`, `Input`, `Card`, `Badge`, `Skeleton`, `Toast` |
| 1.5 | All states: hover, active, focus, loading, disabled, success, warning, error, `ai-processing` |
| 1.6 | `ThemeProvider` + dark/light toggle (AMOLED optional) |
| 1.7 | `prefers-reduced-motion` support |

### Exit criteria
- Storybook-style page OR `/design-system` route showing all tokens & components
- Dashboard + marketing use tokens only (no random hex in pages)

---

## Phase 2 — Dashboard Shell (“AI Operating System”) (Week 2–3) ✅ Started

**Goal:** Dashboard Linear/Raycast jaisa feel de — fast, layered, premium.

**Implemented (2025):** `DashboardShell`, collapsible sidebar, enhanced navbar, ⌘K `CommandPalette`, ambient background.

### Prompt sections mapped
- Dashboard Experience
- Sidebar UX (collapsible, glow, workspace switcher placeholder)
- Topbar UX (search, notifications, profile)
- Command Palette (⌘K / Ctrl+K)
- Advanced Performance (optimistic UI prep)
- Micro interactions (hover glow, toggles)

### Deliverables
| # | Task |
|---|------|
| 2.1 | Glass-style layout: floating sidebar, sticky topbar, layered background |
| 2.2 | Collapsible sidebar + animated active indicator |
| 2.3 | Topbar: global search input, notification bell, profile menu |
| 2.4 | **Command palette**: navigation, “New workflow”, “Go to inbox”, etc. |
| 2.5 | Workspace switcher UI (single workspace → multi later) |
| 2.6 | Page transition + card hover physics (subtle, 60fps) |
| 2.7 | React Query hooks for dashboard data (replace raw useEffect where needed) |

### Exit criteria
- ⌘K works on all dashboard routes
- Sidebar collapse persists (localStorage)
- Feels like “command center”, not admin template

---

## Phase 3 — Landing Page (Cinematic Marketing) (Week 3–4) ✅ Done

**Goal:** Website “billion-dollar AI OS” jaisi breathe kare — black/white sections, motion, trust.

**Implemented:** Full 12-section flow, TrustedBy marquee, Live Demo, Workflow/AI/Inbox/Analytics previews, magnetic CTAs, alternating light/dark sections.

### Prompt sections mapped
- Landing Page Experience (Hero)
- Landing Page Sections (all 12)
- Section Color Strategy (alternating black/white)
- Special Website Effects (grid, particles, marquee, scroll reveal)
- Advanced Animations (magnetic CTA, parallax — controlled)

### Deliverables
| # | Task | Prompt section |
|---|------|----------------|
| 3.1 | Hero: cinematic grid, glowing AI, floating dashboard panels, live DM sim | Hero |
| 3.2 | **Trusted By** — logo marquee | §2 |
| 3.3 | **Live Product Demo** — video or animated product strip | §3 |
| 3.4 | Features grid (upgrade motion + glass cards) | §4 |
| 3.5 | **Workflow Builder Preview** (static or looping animation) | §5 |
| 3.6 | **AI Automation** section (neural glow, copy) | §6 |
| 3.7 | **Unified Inbox Preview** | §7 |
| 3.8 | **Analytics Preview** | §8 |
| 3.9 | Testimonials (upgrade) | §9 |
| 3.10 | Pricing (white section contrast) | §10 |
| 3.11 | FAQ (existing, restyle) | §11 |
| 3.12 | Final cinematic CTA (black) | §12 |
| 3.13 | Scroll-triggered reveals (Framer / Intersection Observer) | Effects |

### Exit criteria
- Full page scroll = clear black ↔ white rhythm
- Lighthouse: motion not blocking LCP (lazy below fold)

---

## Phase 4 — Inbox Experience (Discord + Intercom + AI CRM) (Week 4–5)

**Goal:** Realtime inbox premium + AI-assisted replies.

### Prompt sections mapped
- Inbox Experience
- Realtime Collaboration (presence — light version)
- AI Experience (summaries, smart reply)
- Empty State Experience
- Mobile Experience (inbox-specific)

### Deliverables
| # | Task |
|---|------|
| 4.1 | Message entrance animations + typing pulses |
| 4.2 | AI typing indicator (socket + local state) |
| 4.3 | Contact panel: persist notes/tags → **Contact API** |
| 4.4 | AI conversation summary (call backend or OpenAI endpoint) |
| 4.5 | Smart reply suggestions (chips above composer) |
| 4.6 | Attachment preview UI (upload later) |
| 4.7 | Empty state: illustration + “Connect Instagram” CTA |
| 4.8 | Mobile: list/chat swipe, thumb-friendly composer |
| 4.9 | Hover actions on conversation rows |

### Exit criteria
- Send/receive feels live; AI assist visible in UI
- CRM fields save to database

---

## Phase 5 — Workflow Builder + Execution Visualization (Week 5–7)

**Goal:** Signature experience — users **dekhein** automation chal raha hai.

### Prompt sections mapped
- Workflow Builder Experience (infinite canvas, nodes, drag-drop)
- Workflow Execution Visualization (**SIGNATURE**)
- Node Types: Trigger, AI, Delay, Condition, API, CRM, Analytics, Smart routing

### Deliverables
| # | Task |
|---|------|
| 5.1 | Canvas library integration (React Flow / similar): pan, zoom, grid |
| 5.2 | Node components: Trigger, AI, Delay, Condition, Action |
| 5.3 | Animated connection lines |
| 5.4 | Drag-drop from palette → save to `WorkflowNode` in DB |
| 5.5 | **Simulation mode**: play button → glowing path + particle along edges |
| 5.6 | Live execution overlay (webhook events → highlight active node) |
| 5.7 | Success/failure indicators on nodes |
| 5.8 | Migrate list-only workflows page → canvas-first |

### Exit criteria
- User builds keyword → DM flow visually
- “Run simulation” shows cinematic execution path

---

## Phase 6 — AI Experience Layer (Week 7–8)

**Goal:** “AI is alive inside this platform.”

### Prompt sections mapped
- AI Experience System
- AI Generated Actions (“Create workflow for comment ‘price’”)
- AI copilot, neural glow, thinking animations, token streaming

### Deliverables
| # | Task |
|---|------|
| 6.1 | Floating AI assistant (bottom-right or side dock) |
| 6.2 | AI copilot panel in dashboard |
| 6.3 | NL command: parse intent → create workflow draft |
| 6.4 | Streaming text UI for AI responses |
| 6.5 | “AI thinking” shimmer on buttons/cards |
| 6.6 | Recommendations: optimize workflow, tone suggestions |
| 6.7 | Backend: `POST /ai/generate-workflow` (prompt → JSON config) |

### Exit criteria
- User types one sentence → draft workflow appears on canvas
- Copilot accessible from topbar + ⌘K

---

## Phase 7 — Analytics & Live Event Stream (Week 8–9) ✅ Done

**Goal:** Mission control — realtime metrics + activity feed.

### Prompt sections mapped
- Analytics Experience
- Live Event Stream
- Advanced Notification Center

### Deliverables
| # | Task |
|---|------|
| 7.1 | Analytics page: live charts (Recharts + socket or polling) |
| 7.2 | Metrics cards with animated counters |
| 7.3 | Conversion funnel + workflow performance |
| 7.4 | **Live event feed**: DM sent, lead captured, workflow triggered, AI replied |
| 7.5 | Notification center drawer: grouped alerts, failures, leads |
| 7.6 | Heatmap / engagement timeline (v2) |

### Exit criteria
- Dashboard + dedicated analytics show same realtime story
- Notifications open from topbar with real events

---

## Phase 8 — Onboarding, Search & Empty States (Week 9–10) ✅ Done

**Goal:** New user → live automation in minutes.

### Prompt sections mapped
- Advanced Onboarding System (6 steps)
- Search Experience (semantic / NL)
- Empty State Experience

### Deliverables
| # | Task |
|---|------|
| 8.1 | Onboarding wizard: Account → IG connect → AI setup → First workflow → Test → Go live |
| 8.2 | Progress bar + milestone celebrations |
| 8.3 | Interactive walkthrough (tooltips on first visit) |
| 8.4 | Global search: contacts, workflows, conversations (fuse or API) |
| 8.5 | NL search in command palette |
| 8.6 | Template quick-start on empty workflow/inbox |

### Exit criteria
- New signup completes onboarding without leaving app
- Search finds contacts/workflows in <300ms feel

---

## Phase 9 — Enterprise & Multi-Workspace (Week 10–12) ✅ Done

**Goal:** Agency / team ready product surface.

### Prompt sections mapped
- Multi-Workspace Experience
- Security Experience
- Template Marketplace (future-ready)

### Deliverables
| # | Task |
|---|------|
| 9.1 | Organization + workspace switcher (DB + `X-Workspace-Id`) |
| 9.2 | Roles: owner, admin, member (UI + backend guards) |
| 9.3 | Team invite flow (UI shell → email later) |
| 9.4 | Security page: sessions, login history, devices |
| 9.5 | Template marketplace browse + install (static templates first) |
| 9.6 | Stripe checkout + plan upgrade UI |

### Exit criteria
- Agency can switch client workspaces
- Billing upgrades change plan in DB

---

## Phase 10 — Mobile, Collab, Polish & Performance (Week 12–14) ✅ Done

**Goal:** Native-feel mobile + power-user polish + 60fps everywhere.

### Prompt sections mapped
- Mobile Experience (bottom nav, FAB, gestures)
- Realtime Collaboration (Figma-style — optional v2)
- Advanced Performance System
- Advanced Micro Interactions
- Accessibility System (full)

### Deliverables
| # | Task |
|---|------|
| 10.1 | Mobile dashboard: bottom navigation + FAB |
| 10.2 | Gesture navigation where applicable |
| 10.3 | Live cursors / presence on workflow canvas (optional) |
| 10.4 | Optimistic UI for send, toggle workflow, save settings |
| 10.5 | Virtualized lists (inbox, contacts) |
| 10.6 | GSAP only where Framer insufficient (hero only) |
| 10.7 | Full keyboard nav audit + screen reader labels |
| 10.8 | Performance budget: LCP, INP targets documented |

### Exit criteria
- Mobile usable for inbox + notifications
- Reduced motion mode respects user OS setting

---

## Summary Table

| Phase | Name | Duration | % of Master Prompt |
|-------|------|----------|-------------------|
| 0 | Foundation | ~1 week | ~35% (already) |
| 1 | Design System | 1–2 weeks | +10% |
| 2 | Dashboard Shell | 1 week | +8% |
| 3 | Landing Cinematic | 1–2 weeks | +10% |
| 4 | Inbox + AI CRM | 1–2 weeks | +8% |
| 5 | Workflow Canvas + Execution | 2–3 weeks | +12% |
| 6 | AI Copilot Layer | 1–2 weeks | +8% |
| 7 | Analytics + Events | 1–2 weeks | +6% |
| 8 | Onboarding + Search | 1–2 weeks | +5% |
| 9 | Enterprise + Billing | 2 weeks | +5% |
| 10 | Mobile + Polish | 2 weeks | +3% |

**Total estimate:** ~12–14 weeks (1 dev + design focus)  
**After Phase 10:** ~90–95% of master prompt (marketplace + full collab = post-launch)

---

## Recommended build order

```
Phase 0 ✅ → 1 → 2 → 3 (marketing) 
         ↘ 4 (inbox) ∥ 5 (workflows) 
         → 6 (AI) → 7 (analytics) → 8 (onboarding) → 9 (enterprise) → 10 (polish)
```

**Parallel tracks possible:**
- Track A: Phases 1–3 (brand + landing)
- Track B: Phases 4–5 (core product UX)
- Merge at Phase 6 (AI layer ties both)

---

## Kya abhi skip karein (post-MVP)

- Full Figma-style multiplayer editing
- Voice notes in inbox
- Sell templates / payments to creators
- AMOLED theme (unless user demand)
- GSAP-heavy pages everywhere (perf risk)

---

*File: `docs/UI-UX-MASTER-PHASES.md` — update as phases complete.*
