- [ ] Inspect CORS setup in backend/src/main.ts and related websocket CORS configs
- [ ] Propose edit plan to update app.enableCors to read allowed origin(s) from env var (FRONTEND_URL) and include localhost for dev
- [ ] After approval, modify backend/src/main.ts CORS configuration accordingly
- [ ] Optionally align WebSocket gateway CORS with same env-based origin
- [ ] Run backend build/lint/typecheck to ensure compilation
- [ ] Provide final verification steps for Render + Netlify env vars

