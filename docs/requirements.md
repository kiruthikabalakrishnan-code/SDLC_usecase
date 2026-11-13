# Requirements — SCRUM-5: Implement Product Search and Filter

## 1. Overview

### Problem and goal

The Jira story describes a customer who wants to search and filter products by name, category, and price to find products matching their preferences. The requested outcome is a product listing with the specified filters, an empty-results message, a reset action, and a responsive desktop/mobile presentation.

### Scope

- Product listing and search/filter interactions described by Jira SCRUM-5.
- Local mock JSON data with at least 10 products.
- React, HTML, and CSS frontend; Vitest unit tests; Playwright UI automation.
- The approved implementation setup is a self-contained app under `product-search/`, using Node/npm, Vite, Vitest, and Playwright without changing framework configuration (D-01). This constrains the implementation location/tooling; it does not add product behavior.
- No backend or database.

### Out of scope

- A backend or database (explicitly excluded by the source).
- Other capabilities not described by the source are not included in this requirements baseline. This is a scope boundary, not a decision that any particular unmentioned capability is unwanted.
- No linked Jira issues or other dependencies were reported by the retrieved source issue; unrelated issues were not searched.

### Readiness

The source establishes the core capabilities and technical constraints. The user-approved clarification answers dated 2026-11-13 resolve Q-01 through Q-05 and define observable behavior and verification conditions. The user also approved the implementation setup recorded as D-01 on 2026-11-13. No blocking clarification remains; this baseline is ready for architecture review.

## 2. Stakeholders & Personas

| Persona / stakeholder | Source evidence | Needs / permissions |
|---|---|---|
| Customer | User-story statement S-01 | Search and filter the product listing. Authentication, roles, and permissions are not specified; none are inferred. |
| Product owner / story approver | Jira issue SCRUM-5 and its acceptance criteria | Resolve the blocking behavior questions and approve this requirements baseline. |
| Delivery / quality team | Technical requirements and Definition of Done in SCRUM-5 | Implement and verify the stated UI and quality gates. |

## 3. Assumptions & Dependencies

### Source-backed constraints

- **C-01:** Frontend technology is React, HTML, and CSS. (TR-01)
- **C-02:** Product data is local mock JSON containing at least 10 products. (TR-02)
- **C-03:** Vitest is required for unit testing. (TR-03)
- **C-04:** Playwright is required for UI automation. (TR-04)
- **C-05:** No backend or database is required. (TR-05)

### Assumptions

- **Approved clarification decisions (user clarification, 2026-11-13):** Q-01: case-insensitive substring name matching; active filters combine with AND; empty search and All categories impose no restriction; category choices are All categories, Electronics, Clothing, and Home. Q-02: numeric maximum-price control; allowable range derives from product data; initial/reset state imposes no maximum; the maximum is inclusive; currency is USD and prices display to two decimal places. Q-03: use local placeholder images for mock products and the same placeholder as fallback when an image is unavailable. Q-04: results update on each filter change without an Apply action; no separate measurable latency threshold is required. Q-05: verify at 375x667 and 1366x768; content reflows without horizontal overflow and controls remain usable. The user expressly approved these defaults.
- **Approved implementation setup decision (D-01, user approval 2026-11-13):** Create a self-contained app under `product-search/` using Node/npm, Vite, Vitest, and Playwright, without changing framework configuration. This records approved implementation setup only and does not add or change product behavior or the existing Q-01–Q-05 decisions.
- Product field schema and sample values beyond the fields and constraints stated here remain unspecified; they may be selected during architecture/implementation without changing these approved behaviors.

### Dependencies

- A React frontend and the local mock product data are required to realize the requested experience.
- Node/npm, Vite, Vitest, and Playwright are the user-approved setup for the self-contained `product-search/` app (D-01). The setup must not change framework configuration. This does not claim that the app has been implemented or that tool versions/configuration have been selected.
- Vitest and Playwright are required for the source-mandated test activities.
- No external service, API, database, or linked Jira issue is specified.

## 4. Functional Requirements

Priority meanings: **Must** is necessary to satisfy the source story; **Should** and **Could** are not used to invent optional functionality.

| ID | Priority | Requirement | Source | Notes / edge cases |
|---|---|---|---|---|
| FR-001 | Must | The customer must be able to search/filter the product listing by product name, category, and price. | S-01; AC-02–AC-04 | Active filters combine with AND; see Q-01 clarification (2026-11-13). |
| FR-002 | Must | The product listing must display each product’s name, image, category, and price. | AC-01 | Use local placeholder images for mock products and the same placeholder as fallback when unavailable; display prices in USD to two decimal places (Q-02, Q-03; user clarification 2026-11-13). |
| FR-003 | Must | The page must provide a search box that matches product names using case-insensitive substring matching. An empty search imposes no restriction. | AC-02 | Search matching and empty-search behavior are user-approved (Q-01; 2026-11-13). |
| FR-004 | Must | The page must provide a category dropdown containing All categories, Electronics, Clothing, and Home. All categories imposes no category restriction. | AC-03 | The All categories option and unrestricted meaning are user-approved (Q-01; 2026-11-13). |
| FR-005 | Must | The page must provide a numeric maximum-price control whose allowable range derives from product data. The initial and reset state imposes no maximum-price restriction. When set, products priced at or below the selected maximum are displayed. Prices use USD and display to two decimal places. | AC-04 | The maximum is inclusive; values/range are based on product data (Q-02; user clarification 2026-11-13). |
| FR-006 | Must | The displayed product list must update on each filter change without a separate Apply action. | AC-05 | User clarification (Q-04; 2026-11-13) defines immediate interaction; no separate measurable latency threshold is required. |
| FR-007 | Must | When no products match, the page must display the exact message “No products found”. | AC-06 | Matching conditions follow FR-003 through FR-005. |
| FR-008 | Must | The page must provide a Clear Filters action that resets the search to empty, category to All categories, and maximum price to no restriction. | AC-07 | Reset values follow the approved Q-01/Q-02 decisions (2026-11-13). |
| FR-009 | Must | The page must be responsive at 375x667 and 1366x768 viewports: content must reflow without horizontal overflow and controls must remain usable. | AC-08 | Target viewports and observable behavior are user-approved (Q-05; 2026-11-13). |
| FR-010 | Must | The product data must be provided as local mock JSON containing at least 10 products. | TR-02 | Product fields must support the displayed name, image, category, and price; exact sample values are unspecified. |

## 5. Non-Functional Requirements

| ID | Priority | Requirement / constraint | Source | Testability and notes |
|---|---|---|---|---|
| NFR-001 | Must | The frontend must use React, HTML, and CSS. | TR-01 | Verifiable by repository implementation inspection. |
| NFR-002 | Must | Unit tests must use Vitest. | TR-03; DOD-03 | Test execution outcome is a later verification gate. |
| NFR-003 | Must | UI automation must use Playwright. | TR-04; DOD-03 | Test execution outcome is a later verification gate. |
| NFR-004 | Must | The feature must not require a backend or database. | TR-05 | Verifiable by implementation/dependency inspection. |
| NFR-005 | Must | Positive, negative, and boundary test cases must be covered. | DOD-02 | Include case-insensitive substring and empty-search behavior, AND-combined filters, inclusive maximum-price equality and no-maximum state, and the responsive viewport conditions defined by AC-008. |
| NFR-006 | Must | Unit and UI automation tests must pass before the feature is considered done. | DOD-03 | Later verification must record evidence; no result is claimed here. |
| NFR-007 | Must | Code review and security checks must be completed before the feature is considered done. | DOD-04 | Later workflow gates; no review result is claimed here. |
| NFR-008 | Must | SDLC documents must be generated and approved before the feature is considered done. | DOD-05 | Later workflow gate; this requirements document is ready for architecture and remains subject to human approval. |
| NFR-009 | Must | A pull request must be created only after successful verification. | DOD-06 | Later workflow gate; no PR is authorized or created by this phase. |

Performance thresholds, availability, scalability, privacy, accessibility, logging/monitoring, and compliance obligations are not specified by the source. No additional target is inferred here.

## 6. User Flows

### Main flow

1. A customer views the product listing, including name, image, category, and price.
2. The customer optionally enters a name query, selects a category (All categories by default), and/or enters a maximum price (no maximum by default).
3. Each active filter is applied with AND semantics; name matching is case-insensitive substring matching, and an empty query or All categories selection adds no restriction.
4. If a maximum price is set, products priced at or below it match; prices are shown in USD to two decimal places.
5. The listing updates on each filter change without an Apply action.
6. The customer sees matching products, or “No products found” when there are no matches.
7. The customer may select Clear Filters to reset search, category, and price to their unrestricted states.

At 375x667 and 1366x768, content reflows without horizontal overflow and controls remain usable (AC-008).

### Alternate / error flows

- **No matches:** Display “No products found” when the case-insensitive substring, selected-category, and inclusive maximum-price filters combined with AND match no products (AC-006).
- **Clear filters:** Reset search to empty, category to All categories, and maximum price to no restriction (AC-007).
- **Responsive presentation:** At 375x667 and 1366x768, content reflows without horizontal overflow and controls remain usable (AC-008).
- **Missing/unavailable image:** Use the same local placeholder image used for mock products (AC-001; Q-03).
- Other error handling is not described in the source.

## 7. Acceptance Criteria

These criteria preserve the Jira acceptance criteria and incorporate the user-approved clarifications dated 2026-11-13. Source references and testability are noted.

| ID | Given | When | Then | Source | Testability |
|---|---|---|---|---|---|
| AC-001 | Product data is available | The customer views the product listing | Products are displayed with name, image, category, and price; prices use USD with two decimal places. Mock products use local placeholder images, and the same placeholder is shown if an image is unavailable. | AC1; user clarification 2026-11-13 (Q-02/Q-03) | Testable by checking displayed fields/format and placeholder rendering/fallback. |
| AC-002 | The product listing is displayed | The customer enters a name query | Products whose names contain the query, ignoring letter case, are retained; an empty query imposes no restriction. Active filters combine with AND. | AC2; user clarification 2026-11-13 (Q-01) | Testable with matching/nonmatching case and substring data, empty query, and combined filters. |
| AC-003 | The product listing is displayed | The customer opens/selects from the category dropdown | The dropdown contains All categories, Electronics, Clothing, and Home; All categories imposes no restriction. | AC3; user clarification 2026-11-13 (Q-01) | Testable by verifying options and unrestricted/all-category results. |
| AC-004 | The product listing is displayed | The customer sets a numeric maximum price | The control's allowable range derives from product data; products priced at or below the maximum are displayed. Initial/reset state has no maximum restriction. Prices display in USD to two decimal places. | AC4; user clarification 2026-11-13 (Q-02) | Testable with lower/upper data-derived range, equality boundary, unset state, and display format. |
| AC-005 | One or more filters are available | A filter value changes | The product list updates on that change without a separate Apply action. No separate measurable latency threshold applies. | AC5; user clarification 2026-11-13 (Q-04) | Testable by changing each filter and observing results update without activating Apply; no timing threshold is specified. |
| AC-006 | Active filters match no products | The result list is updated | The page displays “No products found”. | AC6 | Testable with a dataset/filter combination that yields zero results. |
| AC-007 | One or more filters are set | The customer activates Clear Filters | Search is empty, category is All categories, and maximum price imposes no restriction; all products are eligible to display. | AC7; user clarification 2026-11-13 (Q-01/Q-02) | Testable by checking all reset values and resulting unrestricted listing. |
| AC-008 | The product listing is displayed | The page is rendered at 375x667 and 1366x768 | At both viewports, content reflows without horizontal overflow and controls remain usable. | AC8; user clarification 2026-11-13 (Q-05) | Testable at both specified viewport dimensions against overflow and control usability. |

The Definition of Done also requires: positive, negative, and boundary tests (DOD-02); passing unit/UI automation (DOD-03); completed code review/security checks (DOD-04); generated/approved SDLC documents (DOD-05); and PR creation after successful verification (DOD-06). These are tracked as NFR-005–NFR-009 rather than additional product-behavior acceptance criteria.

## 8. Source & Traceability

### Canonical source

- **Issue:** SCRUM-5, “Implement Product Search and Filter” (Task, Medium, To Do)
- **Canonical URL:** https://epam-team-d41wx5ya.atlassian.net/browse/SCRUM-5
- **Retrieval:** Jira issue retrieved read-only for this phase. Its description, metadata, and issue links were inspected; it reports no linked issues. No unrelated issues were searched and no Jira/Confluence writes were made.
- **Source statement S-01 (verbatim):** “As a customer, I want to search and filter products by name, category, and price so that I can quickly find products that match my preferences.”
- **Acceptance criteria AC1–AC8:** As recorded individually in the table below and retained in the acceptance-criteria section.
- **Technical requirements TR-01–TR-05:** React, HTML, CSS; local mock JSON containing at least 10 products; Vitest unit tests; Playwright UI automation; no backend/database.
- **Definition of Done DOD-01–DOD-06:** UI meets AC; positive/negative/boundary tests; unit/UI automation pass; code review and security checks; SDLC docs generated/approved; PR after successful verification.

### Exact source-to-requirement mapping

| Source reference | Exact source statement / content | Requirement mapping | Acceptance mapping | Coverage / clarification notes |
|---|---|---|---|---|
| S-01 | Customer wants product search/filter by name, category, and price to find matching preferences. | FR-001 | AC-002–AC-004 | Q-01 (user clarification 2026-11-13): case-insensitive substring matching; active filters combine with AND; empty search and All categories are unrestricted. |
| AC1 | Display products with name, image, category, price. | FR-002 | AC-001 | Q-02/Q-03 (user clarification 2026-11-13): USD/two decimals; local placeholder for mock products and same fallback if unavailable. |
| AC2 | Provide a search box to search products by name. | FR-003 | AC-002 | Q-01 (user clarification 2026-11-13): case-insensitive substring; empty search is unrestricted. |
| AC3 | Provide a category dropdown with Electronics, Clothing, and Home. | FR-004 | AC-003 | Q-01 (user clarification 2026-11-13): also include All categories, which is unrestricted. |
| AC4 | Provide a price filter to display products within a selected maximum price. | FR-005 | AC-004 | Q-02 (user clarification 2026-11-13): numeric control; data-derived range; no maximum initially/on reset; inclusive maximum; USD/two decimals. |
| AC5 | Update the product list immediately when filters change. | FR-006 | AC-005 | Q-04 (user clarification 2026-11-13): update on every change without Apply; no separate measurable latency threshold. |
| AC6 | Display “No products found” when no products match. | FR-007 | AC-006 | Test with a dataset/filter combination that yields zero results under the approved semantics. |
| AC7 | Clear Filters resets all filters. | FR-008 | AC-007 | Reset search to empty, category to All categories, maximum price to no restriction (user clarification 2026-11-13). |
| AC8 | Responsive on desktop/mobile. | FR-009 | AC-008 | Q-05 (user clarification 2026-11-13): test at 375x667 and 1366x768; reflow without horizontal overflow; controls remain usable. |
| TR-01 | Frontend: React, HTML, CSS. | NFR-001 | — | Technology constraint; inspectable. |
| TR-02 | Data: Local mock JSON containing at least 10 products. | FR-010 | — | Product sample values/schema beyond displayed fields unspecified. |
| TR-03 | Unit testing: Vitest. | NFR-002 | — | Execution evidence belongs to verification. |
| TR-04 | UI automation: Playwright. | NFR-003 | — | Execution evidence belongs to verification. |
| TR-05 | No backend or database required. | NFR-004 | — | Explicit scope constraint. |
| DOD-01 | UI implemented according to acceptance criteria. | FR-002–FR-009 | AC-001–AC-008 | Cannot claim complete until criteria are clarified, implemented, and verified. |
| DOD-02 | Positive, negative, and boundary test cases covered. | NFR-005 | — | Boundary tests depend on Q-01/Q-02. |
| DOD-03 | Unit and UI automation tests pass. | NFR-006 | — | Later verification gate. |
| DOD-04 | Code review and security checks completed. | NFR-007 | — | Later review gates. |
| DOD-05 | SDLC documents generated and approved. | NFR-008 | — | Later workflow gate. |
| DOD-06 | PR created after successful verification. | NFR-009 | — | Later PR gate; not performed in requirements phase. |
| D-01 | User-approved implementation setup: create a self-contained app under `product-search/` using Node/npm, Vite, Vitest, and Playwright without changing framework configuration (user approval dated 2026-11-13). | Applies to implementation setup for NFR-001–NFR-003; no new product-behavior requirement | — | Setup decision only; existing source IDs, FR/NFR/AC IDs, and Q-01–Q-05 mappings are unchanged. |

Future traceability links to architecture decisions/components, implementation tasks (`IMP-###`), code, tests, and verification results are intentionally not populated before those phases produce evidence. No implementation or test evidence is claimed by this document.

## 9. Open Questions

No unresolved implementation-blocking questions remain. The following clarification items are retained for audit traceability and were explicitly answered/approved by the user on 2026-11-13:

| Question ID | Clarification topic | Approved decision | Status |
|---|---|---|---|
| Q-01 | Search/category behavior and filter combination | Case-insensitive substring name matching; active filters combine with AND; empty search and All categories impose no restriction; dropdown includes All categories, Electronics, Clothing, Home. | Resolved |
| Q-02 | Price control, range, defaults, currency, and equality | Numeric maximum-price control; allowable range derives from product data; initial/reset means no maximum; maximum is inclusive; prices are USD and display to two decimal places. | Resolved |
| Q-03 | Product image and fallback | Use local placeholder images for mock products and the same placeholder fallback when an image is unavailable. | Resolved |
| Q-04 | Immediate-update behavior | Update on each filter change without Apply; no separate measurable latency threshold. | Resolved |
| Q-05 | Responsive verification | Test at 375x667 and 1366x768; content reflows without horizontal overflow and controls remain usable. | Resolved |

### Approved implementation setup decision log

| Decision ID | Clarification / decision | Approved by / date | Effect |
|---|---|---|---|
| D-01 | Use a self-contained app under `product-search/` with Node/npm, Vite, Vitest, and Playwright; do not change framework configuration. | User, 2026-11-13 | Implementation setup only. No product behavior is added, and Q-01–Q-05 and all existing requirement/source identifiers and mappings remain unchanged. |

Non-blocking unknowns: exact product names/sample values and a specific product JSON schema beyond the displayed fields are not supplied. They can be selected during architecture/implementation only after confirming they do not encode additional business behavior.

## 10. Status

**READY_FOR_ARCHITECTURE** — Q-01 through Q-05 are resolved by user-approved clarification dated 2026-11-13, and implementation setup decision D-01 was approved by the user on 2026-11-13. Existing stable requirement/source IDs and Q-01–Q-05 mappings are preserved. No implementation evidence or later-phase traceability links are claimed at this requirements gate.
