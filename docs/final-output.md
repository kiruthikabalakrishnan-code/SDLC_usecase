# SCRUM-5 — Product Search and Filter

## Executive summary

SCRUM-5 requested a customer-facing product listing that can be filtered by product name, category, and maximum price. The implemented solution is a self-contained React application in `product-search/`, using local mock data and assets, with Vitest unit tests and Playwright acceptance tests.

The implementation verification gate is **PASS**. The design review and code review also passed; code-review finding CR-001 was remediated and verified. Build, unit-test, browser-test, dependency-install, and dependency-audit outcomes are recorded below. npm emitted non-blocking dependency notices during installation, which are disclosed rather than treated as passing checks or failures.

**Implementation verification: PASS.** This is the implementation verification result, not a consolidated status for all workflow gates. Independent final-output validation evidence/status is recorded in [`verification.md`](verification.md), and workflow progress is recorded in [`sdlc-state.md`](sdlc-state.md). No pull request or merge is claimed.

## Source and context

- **Jira story:** [SCRUM-5 — Implement Product Search and Filter](https://epam-team-d41wx5ya.atlassian.net/browse/SCRUM-5).
- **User-story objective (S-01):** Search and filter products by name, category, and price to find products matching customer preferences.
- **Approved requirements and traceability:** [`requirements.md`](requirements.md) records the source AC1–AC8, TR-01–TR-05, DOD-01–DOD-06, and stable requirements FR-001–FR-010, NFR-001–NFR-009, and AC-001–AC-008.
- **Approved setup decision:** Requirements D-01 (user-approved 2026-11-13) selects a self-contained `product-search/` app using Node/npm, Vite, Vitest, and Playwright without framework configuration changes.
- **Evidence used:** [`architecture.md`](architecture.md), [`design-review.md`](design-review.md), [`impl-plan.md`](impl-plan.md), [`implementation.md`](implementation.md), [`code-review.md`](code-review.md), and [`verification.md`](verification.md). The design and code review findings and their resolution are summarized below.

## Requirements and accepted decisions

The approved scope is a React/HTML/CSS product listing with local mock JSON containing at least 10 products, Vitest and Playwright coverage, and no backend or database. Approved clarifications Q-01–Q-05 (2026-11-13) define the following behavior:

- Search is case-insensitive substring matching; active filters combine with AND. Empty search and **All categories** are unrestricted. Category options are All categories, Electronics, Clothing, and Home.
- The numeric maximum-price control has data-derived bounds. A selected maximum is inclusive; initial/reset state is unrestricted. Prices display in USD to two decimal places.
- Mock product images use a local placeholder, also used as the missing-image fallback.
- Results update on each filter change without an Apply action. No separate measurable latency threshold is required.
- Responsive behavior is checked at 375×667 and 1366×768: content reflows without horizontal overflow and controls remain usable.

| Requirement trace | Approved behavior / evidence outcome |
|---|---|
| FR-001, FR-003–FR-005; AC-002–AC-004; Q-01/Q-02 | Search, category and inclusive maximum-price filters compose with AND; tested, including boundaries and invalid out-of-range input. |
| FR-002; AC-001; Q-02/Q-03 | Product name, image, category and two-decimal USD price; local placeholder and fallback tested. |
| FR-006; AC-005; Q-04 | Results update on control changes without Apply; browser-tested. |
| FR-007; AC-006 | Exact empty-state text “No products found”; browser-tested. |
| FR-008; AC-007 | Clear Filters restores unrestricted defaults; browser-tested. |
| FR-009; AC-008; Q-05 | Both approved viewport sizes tested for overflow and control usability. |
| FR-010; TR-02 | Local JSON fixture contains 12 products (minimum required: 10); fixture checks passed. |
| NFR-001–NFR-006; TR-01–TR-05; DOD-01–DOD-03 | React/HTML/CSS and client-only boundary inspected; Vitest, Playwright, build and acceptance checks passed as detailed in verification evidence. |
| NFR-007; DOD-04 | Code-review gate passed; CR-001 resolved. Dependency audit reported zero vulnerabilities. |
| NFR-008; DOD-05 | This report and its Word companion have been generated. Independent validation evidence/status is recorded in [`verification.md`](verification.md); workflow progress is recorded in [`sdlc-state.md`](sdlc-state.md). |
| NFR-009; DOD-06 | Pull request is a later gate after successful verification. No PR or merge is claimed. |

## Architecture and key decisions

The approved architecture is a small client-only React page. Local JSON is the product-data source; page-owned filter state feeds a deterministic in-memory selector, which renders matching products or the specified empty state. Local assets avoid remote image dependencies. There is no API, backend, database, persistence, authentication, or external runtime integration in scope.

Architecture decisions D-01–D-04 cover the local-only client architecture, single-page filter state and pure AND selector, local image fallback/currency formatting, and the Vitest/Playwright test split. Requirements D-01 confirms the app location and execution toolchain. The design review recorded DR-001 as a MEDIUM planning prerequisite; the approved setup decision and implementation plan resolved the target/toolchain question before implementation. The design-review gate passed with no unresolved BLOCKER or HIGH findings.

## Implementation summary

Implementation evidence maps approved plan tasks IMP-001–IMP-004 to the app scaffold, local data and filter logic, UI, and browser acceptance coverage. The plan's task status labels remain PENDING in the original planning document; completion evidence is recorded in the implementation and verification reports rather than by editing that approved plan.

Key files include:

- `product-search/package.json`, `package-lock.json`, `vite.config.js`, `playwright.config.js` — pinned app setup, commands, and local Playwright server integration.
- `product-search/src/data/products.json`, `src/filterProducts.js`, `src/filterProducts.test.js` — local fixture, filtering/formatting logic, and unit tests.
- `product-search/src/ProductSearchApp.jsx`, `src/priceInput.js`, `src/priceInput.test.js`, `src/styles.css`, `public/placeholder.svg` — listing, filter controls, price input validation, responsive styling, and local image fallback.
- `product-search/tests/product-search.spec.js` — Playwright acceptance tests.

CR-001 concerned out-of-range price values being accepted into applied filter state. The remediation keeps editable price text separate from the applied ceiling and retains the previous applied value/results for invalid values; blank input remains unrestricted. Regression tests cover invalid below/above-bound values, valid inclusive endpoints, and reset.

## Reviews, security and dependency observations

- **Design review:** PASS; no unresolved BLOCKER or HIGH findings. DR-001 (MEDIUM) was a planning prerequisite, resolved by the approved requirements D-01 setup decision.
- **Code review:** PASS; no unresolved BLOCKER or HIGH findings. CR-001 is resolved, with unit, browser, and build regression evidence.
- **Security/data handling:** The reviewed app uses local product JSON and images, React text rendering, and no observed network/API calls or backend/database. An independent verification browser check observed only requests to the local app origin and zero external requests. This is the scope of the reported inspection, not a claim of penetration testing or an independent accessibility audit.
- **Dependency audit:** `npm.cmd audit` reported zero vulnerabilities. The code review also records `npm.cmd audit --omit=dev` with zero vulnerabilities.
- **Non-blocking install notices:** npm reported deprecated transitive package `whatwg-encoding@3.1.1` and an `esbuild@0.28.2` install script not covered by npm's approval list. Installation completed successfully. These notices remain disclosed; they are not claims that the dependency notices were resolved.
- **Environment:** Windows PowerShell; Node `v26.13.0`, npm `11.20.0`. The PowerShell `npm` shim was blocked by execution policy, so commands were run with `npm.cmd` from `product-search/`.

## Build, tests and verification results

The Verification Agent's [`verification.md`](verification.md) records a **PASS** after remediation, superseding the earlier pre-remediation price-filter failure. All exact commands below were run from `product-search/` on Windows:

| Command | Recorded result |
|---|---|
| `npm.cmd ci` | **PASS**, exit 0; 121 packages added, 122 audited, zero vulnerabilities. Non-blocking deprecation and install-script notices are noted above. |
| `npm.cmd run test:unit` | **PASS**, exit 0; Vitest 2 files and 8 tests passed. |
| `npm.cmd run test:e2e` | **PASS**, exit 0; Playwright 7 tests passed against the configured local Vite server. |
| `npm.cmd run build` | **PASS**, exit 0; Vite production build succeeded, 32 modules transformed. |
| `npm.cmd audit` | **PASS**, exit 0; zero vulnerabilities reported. |

Independent price-input browser checks also confirmed the inclusive data minimum (12.50) and maximum (129.99), unrestricted blank input, reset to all 12 products, and retention of the previously applied six results when invalid values 12.49 or 130 were entered. The Playwright suite checked both approved viewport sizes. These outcomes are implementation verification evidence, not final-output validation.

An initial install from the repository root failed because no package manifest/lockfile exists there; that attempt is not counted as a passing project check. The required install succeeded when rerun from the app directory. A historical pre-remediation CR-001 failure is superseded by the current post-remediation verification PASS; it is not an outstanding failure.

## Limitations, exclusions and workflow status

- No backend, database, external product service, persistence, authentication, or real product catalog is part of the approved scope.
- Product names and sample values are mock data; the requirements do not specify a real catalog or further product schema.
- Automated screen-reader or keyboard-only testing is not evidenced. The review notes labeled controls, alternative text and visible focus styling, but those observations are not a claim of assistive-technology testing.
- The npm dependency notices are non-blocking warnings and remain disclosed.
- Independent final-output validation evidence/status is recorded in [`verification.md`](verification.md); workflow progress is recorded in [`sdlc-state.md`](sdlc-state.md). This report does not state a final-output validation outcome.
- No PR has been created and no merge has occurred. PR publication and final SDLC approval remain subsequent workflow gates.

## Implementation verification status

**PASS** — The implementation verification gate passed and the documented CR-001 remediation is verified. The npm dependency notices above remain disclosed as non-blocking notices; they are not represented as a separate workflow-gate result. Final-output validation evidence/status and overall workflow progress are recorded in the referenced workflow documents.
