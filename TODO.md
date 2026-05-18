# TODO

- [ ] Update `frontend/app/(dashboard)/layout.tsx` to add a mobile hamburger + sidebar drawer, and prevent squished layout on small screens.
- [ ] Update `frontend/components/layout/Sidebar.tsx` to support mobile drawer closing behavior.
- [ ] Update `frontend/app/(dashboard)/dashboard/page.tsx` to remove dummy stats and implement fresh-account empty states (stats = 0, chart empty state, no fake loading delay).
- [ ] Run `frontend` typecheck/build to confirm TS/Next correctness.

## TypeScript 493-errors emergency fix
- [ ] Fix `frontend/tsconfig.json` to Next 14-safe baseline (types/include/exclude/moduleResolution/plugins).
- [ ] Reinstall deps in frontend+backend.
- [ ] Run `npx tsc --noEmit` in both packages and confirm errors reduced.
- [ ] Run `next build` and `nest build` for final validation.

