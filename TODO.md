- [x] Scan codebase for hardcoded API keys and embedded secrets.
- [x] Remove hardcoded Instagram webhook verify token from `backend/src/modules/instagram/webhook.controller.ts`.
- [x] Update `backend/src/modules/instagram/webhook.controller.ts` to use `process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN`.
- [x] Create/update root `.env.example` with placeholders for Groq/Gemini/OpenAI + Instagram.
- [x] Re-scan for occurrences of `autoflow_secret_123`, `sk-...`, `AIza...`, and hardcoded Bearer tokens.
- [ ] Run backend build/tests (npm run build) to confirm compilation.

