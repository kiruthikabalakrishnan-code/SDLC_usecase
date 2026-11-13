# Implementation Plan — SCRUM-5: Product Search and Filter

## Plan basis and scope

- **Source:** SCRUM-5, https://epam-team-d41wx5ya.atlassian.net/browse/SCRUM-5; approved `docs/requirements.md`, including Q-01–Q-05 and the user-approved setup decision D-01 (2026-11-13).
- **Architecture/review:** `docs/architecture.md` and `docs/design-review.md`. The review passed with no unresolved BLOCKER/HIGH findings. Its DR-001 MEDIUM planning prerequisite is resolved by requirements D-01.
- **Decision naming:** `requirements D-01` selects the app location and toolchain. References below to `architecture D-01`–`D-05` are to the separate architecture decisions in `docs/architecture.md`. The architecture's D-05 delegates toolchain selection to planning; requirements D-01 now supplies that choice without changing product behavior or framework configuration.
- **Scope:** A self-contained React app and required tests under the approved `product-search/` directory, using Node/npm, Vite, Vitest, and Playwright. No backend, database, external product services, framework configuration changes, or unrelated framework work.
- **Repository baseline:** The repository is a Copilot/Agentic SDLC framework and has no existing application shell or test setup. `product-search/` is the approved target; individual file paths beneath it are provisional implementation locations, not existing files.
- **Worktree protection:** Existing deletions of `.github/prompts/draft-requirements.prompt.md`, `.github/prompts/run-agentic-sdlc.prompt.md`, `.github/prompts/sdlc-mcp-preflight.prompt.md` and untracked `.github/commands/` are unrelated and out of scope. Leave them untouched.
- **Reproducible setup contract:** The scaffold task must pin resolved dependencies in `product-search/package-lock.json`, declare/document a Node/npm version compatible with its Vite and Playwright versions, and define the scripts below. Exact dependency versions remain an implementation choice within the approved toolchain.
  - Initial/local setup from the repository root: `cd product-search`; `npm ci`; `npx playwright install chromium`.
  - Local interactive app: `npm run dev`.
  - Unit tests: `npm run test:unit`.
  - Browser tests: `npm run test:e2e`.
  - Production build check: `npm run build`.
  - `dev` serves Vite on `127.0.0.1:4173` with a strict port. Playwright's `webServer` starts that same `npm run dev` command and waits for `http://127.0.0.1:4173` before tests. Commands run from `product-search/` after changing directory.

## Tasks

### IMP-001 — Establish the approved app scaffold and reproducible test setup

- **Priority / status:** P0 / **PENDING**.
- **Requirement / acceptance links:** NFR-001–NFR-004, NFR-006; requirements D-01. No product AC is directly implemented by this setup task.
- **Architecture:** App/runtime boundary and required test split; architecture D-01, D-04, D-05. Requirements D-01 resolves target/toolchain selection.
- **Dependencies:** None.
- **Affected components/files:** Approved root `product-search/`; likely `package.json`, `package-lock.json`, Vite/Vitest/Playwright configuration, HTML entry and React bootstrap, and app-local ignore/documentation files. Exact filenames are provisional. Do not edit framework configuration.
- **Objective:** Create the isolated React/HTML/CSS app shell using Node/npm and Vite. Add Vitest and Playwright setup, required npm scripts, a declared compatible Node/npm version, and a lockfile. Configure Playwright to start and reach the Vite app on the documented local address. Keep runtime content local and add no backend, database, remote data client, or external image integration.
- **Required tests/checks:** From `product-search/`, `npm ci`, `npm run test:unit`, `npm run test:e2e`, and `npm run build` all run successfully. The initial Vitest and Playwright smoke tests pass; Playwright launches the app through its configured `webServer`. Inspect dependencies/configuration to confirm the client-only boundary.
- **Completion criteria:** `package-lock.json` is present and `npm ci` succeeds using the documented supported Node/npm version; all four scripts are defined and reproducible; Vite serves at `http://127.0.0.1:4173` on strict port; Playwright reaches that server and passes its smoke test; all created/changed files are within `product-search/`; framework configuration and unrelated `.github` changes are untouched.

### IMP-002 — Add local product data and tested filter logic

- **Priority / status:** P1 / **PENDING**.
- **Requirement / acceptance links:** FR-001, FR-003–FR-005, FR-010; AC-002–AC-004; NFR-002, NFR-005.
- **Architecture:** Product data module and pure AND selector; architecture D-01, D-02, D-04.
- **Dependencies:** IMP-001.
- **Affected components/files:** Provisional `product-search/src/data/products.json`, selector/price-formatting module, and corresponding Vitest tests.
- **Objective:** Supply at least 10 local mock products with stable keys and fields for name, category, numeric USD price, and local image; implement the pure filter semantics and USD two-decimal formatting. Choose deterministic sample values that cover each approved category and boundaries without implying a real catalog.
- **Required tests/checks:** Vitest covers case-insensitive substring, non-match and empty query; each category and unrestricted All categories; inclusive price equality, above-ceiling exclusion and absent-ceiling unrestricted state; AND combination and zero results; data count/field/category contract; USD formatting.
- **Completion criteria:** The local fixture contains at least 10 valid records; all selector/formatting tests pass with positive, negative, and boundary cases; all product data is local and no requirement or acceptance-criterion ID is changed.

### IMP-003 — Implement accessible listing and responsive controls

- **Priority / status:** P1 / **PENDING**.
- **Requirement / acceptance links:** FR-001–FR-009; AC-001–AC-008; NFR-001, NFR-004.
- **Architecture:** Product listing page/filter controls, result view, placeholder fallback, responsive presentation; architecture D-01–D-03.
- **Dependencies:** IMP-002.
- **Affected components/files:** Provisional React page/components and CSS under `product-search/`; local placeholder image asset. Exact layout and filenames are implementation choices within the approved architecture.
- **Objective:** Render product name, image, category, and USD price; provide labeled search, category, numeric maximum-price control, and Clear Filters; update results on each change; render the exact empty-state text; use the local placeholder for mock products and on image error. Keep controls keyboard-operable and make content reflow at the approved viewports without horizontal overflow.
- **Required tests/checks:** Component/render checks as useful within the selected harness; confirm every control is labeled and operable, initial/reset maximum is unrestricted, no Apply action is needed, and image fallback uses the same local asset.
- **Completion criteria:** All eight acceptance behaviors are represented in the running app; local-only data/assets and React/HTML/CSS constraints are retained; at 375×667 and 1366×768 there is no horizontal overflow and all controls remain usable.

### IMP-004 — Add Playwright acceptance coverage

- **Priority / status:** P1 / **PENDING**.
- **Requirement / acceptance links:** FR-001–FR-009; AC-001–AC-008; NFR-003, NFR-005, NFR-006.
- **Architecture:** Playwright UI automation and app integration; architecture D-04.
- **Dependencies:** IMP-003.
- **Affected components/files:** Provisional Playwright spec(s) and any minimal app-local test configuration under `product-search/`.
- **Objective:** Verify user-visible listing, filters, reset, empty state, image fallback, and responsive behavior through the actual locally served app.
- **Required tests/checks:** Exercise product fields and price format; search/category/price interactions and AND semantics; updates without an Apply action; exact “No products found”; Clear Filters restoring all unrestricted defaults; missing-image fallback; at 375×667 and 1366×768 assert no horizontal overflow and usable controls. Run `npm run test:unit`, `npm run test:e2e`, and `npm run build` from `product-search/`.
- **Completion criteria:** Playwright covers AC-001–AC-008 with deterministic local data; both required test suites and the production build pass; failures are reported rather than waived. This is test evidence for the later verification phase to record, not a verification result claimed by this plan.

## Dependency order and gates

`IMP-001 → IMP-002 → IMP-003 → IMP-004`. No dependency cycle or unresolved prerequisite is identified. Requirements D-01 resolves the former IMP-001 target/toolchain blocker and the design review's DR-001 planning prerequisite. All tasks are **PENDING**, not blocked; implementation work has not been performed or verified.

Complete the app/tooling smoke setup first, then data and pure logic tests, then the UI, then Playwright acceptance coverage and the integrated test/build run. Do not claim NFR-006 complete without successful Vitest and Playwright evidence. Following implementation, NFR-007 requires code review and security checks; NFR-008 requires approved SDLC documentation; NFR-009 permits PR creation only after successful verification. Those are later workflow gates, not tasks or evidence produced by this plan.

## Plan readiness and assumptions

**Planning gate: READY. No unresolved task blockers.** Requirements and acceptance criteria remain linked to stable IMP IDs and measurable completion criteria. The selected location/toolchain is explicit; only nested filenames and exact compatible dependency/runtime versions remain implementation choices and must be recorded in the scaffold and lockfile. The approved setup does not require changing architecture or framework configuration. No application, test result, code review, security result, final report, or PR is claimed here.
