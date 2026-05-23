# AutoFlow Implementation Checklist

## Completed

- [x] Auth: session rehydrate on refresh, 401 refresh interceptor, logout + token revoke
- [x] Middleware: protect dashboard routes via cookie; marketing routes public
- [x] WorkspacesModule: valid Nest module stub
- [x] Analytics: JWT-protected `GET /analytics/dashboard`
- [x] Settings module registered; contacts/settings endpoints
- [x] Inbox: API list/messages, WebSocket `useSocket`, real send flow
- [x] Messages: outbound send via Instagram Graph API + socket emit
- [x] Workflows UI: CRUD wired to backend
- [x] Billing: `GET /billing/usage` + UI
- [x] Webhook controller cleanup; env token alias; duplicate Prisma provider removed
- [x] AI workspace tone/prompt in webhook + AiService

## Remaining (future)

- [ ] Stripe checkout + webhook processing
- [ ] Persist inbox lead notes/tags to Contact API
- [ ] Multi-workspace switcher (`X-Workspace-Id`)
- [ ] Google OAuth
- [ ] E2E tests
