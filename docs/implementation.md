# Implementation Evidence — SCRUM-5 Product Search

## Scope and evidence status

- **Approved baseline:** `docs/requirements.md`, `docs/architecture.md`, `docs/design-review.md` (PASS), and `docs/impl-plan.md` (READY).
- **Source:** SCRUM-5, https://epam-team-d41wx5ya.atlassian.net/browse/SCRUM-5.
- **Scope:** Evidence for the four tasks defined in `docs/impl-plan.md` only: IMP-001 through IMP-004. The plan contains no IMP-005. This remediation addresses CR-001 within IMP-003 behavior and IMP-004 regression coverage. It changes only the app source/tests and this evidence; requirements, architecture, plan, review/verification/state documents, and unrelated `.github` changes are untouched.
- **IDs:** Jira AC1–AC8 retain their approved identifiers AC-001–AC-008 from `docs/requirements.md`. FR/NFR/AC/IMP identifiers and their meanings are unchanged.
- **Completion evidence:** The available implementation and test evidence below satisfies the listed IMP-001–IMP-004 completion criteria. The implementation plan remains unchanged, including its recorded PENDING task labels; this document is evidence, not a workflow-state update or final SDLC approval.

## Task, requirement, file, and test map

| Approved task objective and requirement links | Implementation files / components | Test ownership and evidence |
|---|---|---|
| **IMP-001 — Approved app/tooling scaffold.** Requirements D-01; NFR-001–NFR-004, NFR-006. Establish the isolated React/Vite app, pinned reproducible setup, scripts, and Playwright's local server integration without a backend/database or framework configuration changes. | `product-search/package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `playwright.config.js`, `src/main.jsx`, `README.md`, `.gitignore`. `playwright.config.js` sets `webServer.command` to `npm run dev`, waits for `http://127.0.0.1:4173`, and uses the app's documented strict-port server. | `npm.cmd ci` succeeded from the lockfile. `npm.cmd run test:e2e` passed, exercising the configured server startup and local app. `npm.cmd run test:unit` and `npm.cmd run build` also passed. The test scripts and Node/npm minimums are declared/documented. |
| **IMP-002 — Local product data and tested filter logic.** FR-001, FR-003–FR-005, FR-010; AC-002–AC-004; NFR-002, NFR-005. | `product-search/src/data/products.json`, `src/filterProducts.js`, `src/filterProducts.test.js`. | The Vitest file covers case-insensitive substring, empty/nonmatching query, every category and All categories, inclusive price boundary and above-boundary exclusion, absent maximum, AND combination/no match, fixture fields/count/local image paths, and USD two-decimal formatting. Run result: 1 file, 7 tests passed. |
| **IMP-003 — Accessible listing and responsive controls.** FR-001–FR-009; AC-001–AC-008; NFR-001, NFR-004. | `product-search/src/ProductSearchApp.jsx`, `src/priceInput.js`, `src/priceInput.test.js`, `src/main.jsx`, `src/styles.css`, `public/placeholder.svg`. The page renders product details, labeled controls, immediate filter results, exact empty state, local image fallback, and reset defaults. The editable price-control draft is separate from applied filter state; blank clears the ceiling, while a nonblank value updates it only when native-valid and within the data-derived inclusive bounds. Invalid values retain the previous valid ceiling. | `priceInput.test.js` checks inclusive data-derived bounds, unrestricted blank input, and prior-state retention for below/above-range invalid inputs. User-visible behavior and viewport checks are exercised by the IMP-004 Playwright suite below; they are not a separate test file or a test task assigned to IMP-003. The passed checks cover all AC-001–AC-008, including invalid below/above-range input leaving result cards/count unchanged, inclusive minimum/maximum boundaries, reset, and both approved viewports. |
| **IMP-004 — Playwright acceptance coverage.** FR-001–FR-009; AC-001–AC-008; NFR-003, NFR-005, NFR-006. | `product-search/tests/product-search.spec.js`; shared runner setup in `product-search/playwright.config.js`. | Seven Playwright tests passed against the locally served app: listing fields/currency and control bounds/options; live combined filters and clear/reset; exact empty-state text; invalid below-minimum and above-maximum values retaining the prior valid filter after valid inclusive-boundary checks; image-error fallback; responsive layout/usability at 375×667 and 1366×768. |

### Acceptance-criterion coverage in the browser suite

- **AC-001:** Listing product name, image, category, and formatted price.
- **AC-002–AC-004:** Search, category, and maximum-price filtering, including combined AND behavior, inclusive minimum/maximum boundaries, and below/above-range invalid input retaining prior valid results.
- **AC-005:** Results update as controls change without an Apply action.
- **AC-006:** Exact “No products found” empty state.
- **AC-007:** Clear Filters restores empty search, All categories, unrestricted maximum, and all products.
- **AC-008:** Both specified viewports have no horizontal overflow and controls remain visible, enabled, within the viewport, and usable.

## Verification commands and actual outcomes

Commands were run from `product-search/` on Windows PowerShell. The `npm` PowerShell shim is blocked by execution policy in this environment, so `npm.cmd` was used. Node `v26.13.0`, npm `11.20.0`.

| Exact command | Outcome |
|---|---|
| `npm.cmd ci` | **PASS** — clean lockfile install; 121 packages added, 122 audited, 0 vulnerabilities. npm reported a deprecated transitive package and an `esbuild` install script not covered by its approval list; install completed successfully. |
| `npm.cmd run test:unit` | **PASS** — Vitest: 2 files, 8 tests passed, including data-derived inclusive price bounds and retention of the previous filter for invalid values. |
| `npm.cmd run test:e2e` | **PASS** — Playwright: 7 tests passed, including below/above-range invalid values, valid exact boundaries, reset, and both approved viewport sizes. Playwright started the configured local Vite server. |
| `npm.cmd run build` | **PASS** — Vite production build completed. |
| `npm.cmd audit` | **PASS** — 0 vulnerabilities reported. |

For CR-001 remediation, the unit, browser, and build commands were rerun from `product-search/`; all passed. One initial browser-test attempt failed because the installed Playwright expect API does not provide `toBeValid`/`toBeInvalid`; the regression assertion was changed to inspect the native `validity.valid` property, and the complete browser suite then passed. Chromium browser installation was not repeated during this evidence reconciliation; the Playwright browser suite executed successfully.

## Remaining workflow gates and limits

- No IMP-001–IMP-004 completion criterion lacks evidence in this document. This is not a claim that later workflow gates have passed.
- **NFR-007 code/security review** and **NFR-008 final SDLC approval** are not evidenced here and remain later gates.
- No IMP-005 exists in the approved implementation plan; none is requested, blocked, or assigned by this evidence.
