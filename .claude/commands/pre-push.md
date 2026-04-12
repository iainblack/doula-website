# /pre-push — Pre-Push Validation Gate

Run this before every `git push`. Validates static analysis, type generation, all test suites, and documentation consistency. Blocks push on any failure.

---

## Phase 0 — Scope & readiness

Run:
```bash
git log -1 --oneline
git diff HEAD --name-only
```

Tell the user:
> "Validating commit: [hash] [message]
> [N] file(s) changed."

Check if the dev server is running:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3 2>/dev/null || echo "UNREACHABLE"
```

If the response is `200`: server is running — continue.
If the response is anything else or `UNREACHABLE`:
> "Dev server is not running. Starting it now — run `npm run dev` in a separate terminal, wait for 'Ready on http://localhost:3000', then re-run `/pre-push`."
Stop — do not proceed.

---

## Phase 1 — Static analysis

Run **all five commands**. Do not stop on failure — collect all results, then report.

### 1.1 — TypeScript
```bash
npx tsc --noEmit 2>&1 | head -60
```
PASS: zero output.
FAIL: any output. Capture the first error line.

### 1.2 — Lint
```bash
npm run lint 2>&1 | tail -30
```
PASS: exit code 0 / output contains no "Error" lines.
FAIL: any ESLint error. Capture the first error line.

### 1.3 — No hardcoded hex colors in sections
```bash
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/sections/ --include="*.tsx" --include="*.ts"
```
PASS: no output.
FAIL: any match. Colors must use Tailwind CSS variable classes (`bg-primary`, `text-muted`, etc.).

### 1.4 — No raw `<img>` tags
```bash
grep -rn "<img" src/components/sections/ --include="*.tsx"
```
PASS: no output.
FAIL: any match. All images must use `next/image`.

### 1.5 — No `...` spread in GROQ queries
```bash
grep -n "\.\.\." src/lib/sanity/queries.ts 2>/dev/null
```
PASS: no output or file doesn't exist yet.
FAIL: any match. Replace `...` with explicit field projections.

After running all five, report results inline and continue to Phase 2.

---

## Phase 2 — Schema & type generation

Check whether any schema files changed:
```bash
git diff HEAD --name-only | grep "schema\.ts"
```

Also check if `src/types/sanity.generated.ts` is older than any schema file:
```bash
git diff HEAD --name-only | grep "sanity.generated.ts"
```

**If schema changes detected OR generated types appear stale:**

Run typegen:
```bash
npx sanity@latest schema extract --enforce-required-fields 2>&1 | tail -20
npx sanity-typegen generate 2>&1 | tail -20
```

PASS: both commands exit cleanly (no "Error:" lines).
FAIL: any error. Tell the user which schema file is causing the issue and block push.

After typegen, re-run TypeScript check:
```bash
npx tsc --noEmit 2>&1 | head -30
```
PASS: zero output.
FAIL: generated types introduced new errors — capture and report.

**If no schema changes detected:** Mark Phase 2 as SKIP and continue.

---

## Phase 3 — Test suite

The dev server must be confirmed running (Phase 0) before proceeding.

Run all three suites. Do not stop on failure — collect all results.

### 3.1 — Structural tests
```bash
npx playwright test tests/structural/ --reporter=line 2>&1 | tail -20
```
PASS: output contains "passed" with zero failures.
FAIL: any "failed" count or error. Capture the failing test name.

### 3.2 — Functional tests
```bash
npx playwright test tests/functional/ --reporter=line 2>&1 | tail -20
```
PASS: output contains "passed" with zero failures.
FAIL: any "failed" count or error. Capture the failing test name.

### 3.3 — Visual regression tests
```bash
npm run test:visual 2>&1 | tail -40
```
PASS: output contains "passed" with zero failures.
FAIL: any snapshot diff or "failed" count.

**If visual tests fail — do NOT auto-update snapshots.** Present this choice to the user:

> "Visual regression tests failed — [X] snapshot(s) differ.
>
> This could mean:
>   **A)** The code change intentionally altered the design → update snapshots
>   **B)** A regression was introduced → the code needs to be fixed
>
> Which applies? (A/B)"

- **If A:** Run `npm run test:visual:update`, then re-run `npm run test:visual` to confirm all pass. If they pass, mark 3.3 PASS.
- **If B:** Mark 3.3 FAIL. Tell the user to fix the regression and re-run `/pre-push`.

---

## Phase 4 — Documentation consistency

Check whether any section components changed:
```bash
git diff HEAD --name-only | grep "src/components/sections"
```

**If section files changed:**

Read `COMPONENTS.md`. For each changed component directory (e.g. `src/components/sections/Hero/`), check whether that component name appears in `COMPONENTS.md`.

- **All changed components documented:** Mark Phase 4 PASS.
- **Any changed component missing from `COMPONENTS.md`:** Mark Phase 4 WARN. Tell the user:
  > "WARN — [ComponentName] was changed but is not documented in COMPONENTS.md. Update the registry before pushing (or note it as a known gap)."

This is a warning, not a hard block. The user may choose to push anyway.

**If no section files changed:** Mark Phase 4 SKIP.

---

## Phase 5 — Summary & push gate

Present the full results table:

```
Pre-push validation results
───────────────────────────────────────
Phase  Check                   Result
───────────────────────────────────────
1.1    TypeScript              PASS/FAIL
1.2    Lint                    PASS/FAIL
1.3    No hardcoded hex        PASS/FAIL
1.4    No raw <img> tags       PASS/FAIL
1.5    No GROQ spreads         PASS/FAIL
2      Typegen clean           PASS/FAIL/SKIP
3.1    Structural tests        PASS/FAIL
3.2    Functional tests        PASS/FAIL
3.3    Visual regression       PASS/FAIL
4      COMPONENTS.md current   PASS/WARN/SKIP
───────────────────────────────────────
```

**If all checks are PASS or WARN (no FAIL):**
> "All checks passed. Safe to push."

**If any check is FAIL:**
> "Push blocked — [N] check(s) failed:
> [list each failed check with the captured error detail]
>
> Fix the issues above and re-run `/pre-push`."
