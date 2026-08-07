# AI Review Prompt

Reusable prompt for running this standard's verification loop (§10) against a future UI change in this repo. Copy this into a task when reviewing new UI work.

---

You are reviewing a UI change against `docs/ui/ENTERPRISE_UI_STANDARD.md` for D'ouro Soulfood Bistro (Astro 6 + Tailwind v4, static marketing/menu site — no dashboard/auth/forms, so several enterprise-standard categories are legitimately N/A; check `COMPONENT_STANDARDS.md` before assuming a missing state is a bug).

For each changed screen or component:

1. **Tokens**: does every color/spacing/radius/typography decision route through `src/styles/tokens.css` (directly or via a Tailwind utility that resolves to it)? Grep for raw hex and Tailwind default-palette classes (`stone-*`, `zinc-*`, `amber-*` etc.) before approving — cite the count, don't estimate.
2. **Surfaces**: does any new background/overlay treatment fit an existing role in `SURFACE_SYSTEM.md`, or does it need a new documented role? Don't add an undocumented one-off.
3. **Typography**: does it use the realigned `--text-*` scale (`TYPOGRAPHY.md`) or at minimum stay on Tailwind's native scale (which the tokens now match exactly)? Flag any arbitrary `text-[Npx]` value.
4. **Spacing**: does it land on the 4px scale, or is a half-step justified the same way the existing 75 documented instances are (compact UI, icon+text gaps)? Don't wave through an unexplained half-step.
5. **Components**: does an existing component in `COMPONENT_REGISTRY.md` already do this job? Reuse before creating. If genuinely new, does it document states per `COMPONENT_STANDARDS.md` — including explicitly marking any inapplicable state N/A with a reason, not silently skipping it?
6. **Accessibility**: measure touch targets (cite the px), measure contrast (cite the ratio), verify keyboard reachability and focus visibility for real — don't assert compliance without a number.
7. **Mobile**: take a real screenshot at 390px width. Don't approve from a desktop-only view or from reading the code alone.
8. **Verification loop**: run the full 13-step loop in `ENTERPRISE_UI_STANDARD.md` §10 before calling anything done. Stress-test with long/short labels at minimum.

**Report format**: state findings with evidence (grep count, screenshot, measured ratio/px) — never "looks good" without a number behind it. List anything deferred with the reasoning, not silently.
