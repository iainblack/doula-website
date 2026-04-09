# /retrospective — Synthesize Learnings and Improve Skills

Run this skill after all screens for a project are built and reviewed.
It reads SCORECARD.md, identifies systemic patterns, and proposes targeted improvements to the skill files.

---

## Before Starting

Ask the user: "Are all screens built and reviewed in SCORECARD.md, or is this a mid-project retrospective?"

Read in full:
- `SCORECARD.md`
- `.claude/commands/build-screen.md`
- `.claude/commands/design-dna.md`
- `.claude/commands/review-screen.md`
- `COMPONENTS.md`

---

## Phase 1 — Quantitative Summary

From SCORECARD.md, compute and display:

**Per automated check — failure rate:**
For each of the 12 automated checks, count how many screens failed it. Present as a table sorted by failure count descending.

**Score averages:**
- Average visual fidelity score (across all individual section scores, not screen averages)
- Lowest-scoring section type overall
- Average mobile score across all breakpoints
- Average CMS usability score

**Issue breakdown:**
- Total issues: X (X High, X Med, X Low)
- Issues by category: Auto / Visual / Schema / CMS / Query / Mobile
- **Repeat offenders**: any issue description appearing in 2+ screens — these are systemic

Present the full summary before spawning the subagent:

```
Screens reviewed: N
Build period: [date range]

Automated check failure rates (sorted by frequency):
  [check name]: X/N screens failed
  ...

Score averages:
  Visual fidelity: X.X/5 (lowest section: [name] at X/5)
  Mobile: X.X/5
  CMS usability: X.X/5

Issues: X total (X High, X Med, X Low)
Systemic failures (2+ screens): [list or "none"]
```

---

## Phase 2 — Plan Subagent: Pattern Analysis and Proposed Improvements

Spawn a **Plan subagent** with the following prompt. Pass it the full text of SCORECARD.md and all three skill files.

---

**Subagent prompt:**

> You are a software process improvement specialist analyzing build quality data for a Next.js + Sanity site built from Stitch designs.
>
> You have been given:
> 1. SCORECARD.md — quality review results for N screens
> 2. build-screen.md — the skill that generated the components
> 3. design-dna.md — the design import skill
> 4. review-screen.md — the review skill
>
> **Your task:** Identify systemic failure patterns (issues appearing in 2+ screens) and propose specific, targeted improvements to the skill files. Also flag single-screen findings that suggest a likely problem for future projects.
>
> **Classify each finding into one of these categories:**
>
> - **Category A — Missing instruction:** The skill file does not mention this requirement at all.
>   Fix: add an explicit instruction at the appropriate phase.
>
> - **Category B — Instruction present but skippable:** The skill mentions it but it is positioned as a note or suggestion, making it easy to overlook.
>   Fix: elevate to a required checklist item in Phase C.4 verification, or add to the automated checks in `/review-screen`.
>
> - **Category C — Instruction unclear:** The skill describes the rule but the generated code still violated it — likely because the instruction was abstract.
>   Fix: add a concrete before/after code example that shows the correct pattern.
>
> - **Category D — Design DNA gap:** A visual or design rule violation occurred that originated from incomplete design token capture.
>   Fix: strengthen the design-dna.md extraction step to capture this token/rule more explicitly, or add a DESIGN.md reference check to Phase C.3 of build-screen.md.
>
> - **Category E — Review gap:** The review-screen checks missed something that should have been caught.
>   Fix: add a new automated check or manual prompt to review-screen.md.
>
> **Output format — one block per finding:**
>
> ---
> ### Finding [N]: [Short descriptive title]
>
> **Screens affected:** [list screen names, or "single screen — preventive finding"]
> **Severity:** High / Med / Low
> **Category:** A / B / C / D / E
> **Root cause:** [1–2 sentences — what caused this to slip through?]
>
> **Proposed change to:** `build-screen.md` / `design-dna.md` / `review-screen.md`
> **Location:** [Phase letter and section name, e.g. "Phase C.3 — Write the component"]
>
> **Current text (quote exactly, or "not present"):**
> ```
> [exact quote]
> ```
>
> **Proposed replacement / addition:**
> ```
> [exact new text — write it as it will appear in the skill file]
> ```
>
> **Rationale:** [1 sentence — why this change prevents the recurrence]
>
> ---
>
> After all findings, append:
>
> ## Summary Table
>
> | # | Title | File | Location | Category | Severity |
> |---|-------|------|----------|----------|----------|
>
> Sort by: Severity (High first), then Category (A before E).
>
> End with 3–5 "Patterns for Next Project" bullet points — the highest-leverage insights to carry forward.

---

Display the subagent's full output to the user.

---

## Phase 3 — User Review of Proposed Changes

Tell the user:

> "The analysis identified **[N] proposed improvements**. Review each one below.
>
> For each, respond:
> - **approve** — apply as written
> - **approve with edit** — apply with a change you specify (provide the exact replacement text)
> - **defer** — skip for now, carry into the next project
> - **reject** — not appropriate (briefly explain why so we can note it)
>
> I'll collect all responses before applying any changes."

Walk through each finding in order. Record each response before moving to the next.

After all findings are reviewed, show a confirmation summary:

> "Ready to apply:
> - [N] approved as-is
> - [N] approved with edits
> - [N] deferred
> - [N] rejected
>
> Shall I apply the [N] approved changes now?"

Wait for confirmation.

---

## Phase 4 — Apply Approved Changes

For each approved finding:
1. Read the target file in full
2. Locate the exact section described in "Location"
3. Apply the change precisely — do not alter surrounding text, headings, or formatting
4. For "approved with edit" — use the user's exact replacement text, not the subagent's proposal

After all changes are applied to a file, **re-read the full file** to verify:
- No duplicate sections or headings
- No broken markdown structure (unclosed code blocks, misaligned tables)
- The instruction still reads coherently in context

Apply changes to files in this order: `build-screen.md` first, then `design-dna.md`, then `review-screen.md`. This order matters because build-screen changes are highest-leverage.

---

## Phase 5 — Append Retrospective Summary to SCORECARD.md

Append this section to the bottom of SCORECARD.md:

```markdown
---

## Retrospective — [Date]

**Screens reviewed:** [list]
**Findings:** [N total — N approved, N deferred, N rejected]

### Quantitative Summary

| Metric | Value |
|--------|-------|
| Automated check pass rate | X% (X/N checks passed across all screens) |
| Most common failure | [check name] — failed X/N screens |
| Average visual score | X.X/5 |
| Average mobile score | X.X/5 |
| Average CMS score | X.X/5 |
| Total issues | X (High: X, Med: X, Low: X) |
| Systemic failures | X |

### Findings Applied

| # | Title | File | Category | Severity | Disposition |
|---|-------|------|----------|----------|-------------|
| [rows from subagent summary table, with disposition added] |

### Changes Made to Skill Files

**build-screen.md:**
- [list sections modified, or "no changes"]

**design-dna.md:**
- [list sections modified, or "no changes"]

**review-screen.md:**
- [list sections modified, or "no changes"]

### Patterns for Next Project

[paste the subagent's "Patterns for Next Project" bullet points here]
```

---

## Phase 6 — Final Report

Tell the user:

> "Retrospective complete.
>
> **[N] improvements applied** to skill files.
> **[N] findings deferred** to the next project.
>
> Key patterns to carry forward:
> [paste the 3–5 bullet points from the subagent]
>
> The skill files are updated. The next project built with these skills will benefit from [N] targeted improvements based on real build data from this project."

---

## Edge Cases

- **Only one screen reviewed:** Tell the Plan subagent "N=1 — analyze single-screen findings preventively rather than as confirmed patterns. Propose changes that would have prevented the failure, framing them as guardrails rather than corrections."
- **All automated checks passed across all screens:** Tell the subagent to focus on human-judgment scores (visual, mobile, CMS). Visual or mobile scores below 4 on any screen still warrant skill improvements.
- **Conflicting proposed changes to the same location:** Ask the subagent to reconcile them in a follow-up prompt before presenting to the user.
- **User approves with edit:** Always ask for the full replacement text, not a diff description, to avoid ambiguity when applying.
- **Deferred findings:** List them in the retrospective summary under a "Carried to Next Project" section so they are not forgotten.
