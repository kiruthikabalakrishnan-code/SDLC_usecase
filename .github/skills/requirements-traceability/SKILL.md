---
name: requirements-traceability
description: Preserve stable, auditable links from source statements through requirements, architecture, implementation, tests, and verification.
---

# Requirements traceability

Maintain the chain:

`Source statement/AC -> Requirement ID -> Architecture decision/component -> IMP task -> Code/component -> Test -> Verification result`

- Use stable `FR-###`, `NFR-###`, `AC-###`, and `IMP-###` identifiers. Never silently renumber an existing identifier; document retired or split requirements and their successors.
- Record the source URL/ID and the exact acceptance-criteria or statement reference for each mapped requirement.
- Link relevant requirements to architecture decisions/components and implementation tasks. Note legitimate many-to-many links.
- Link completed tasks to changed files/components and tests. Link test evidence to the requirement and its verification result.
- Mark missing links, untestable criteria, and out-of-scope items explicitly; do not imply coverage without evidence.
- Update traceability when an approved clarification changes scope. Preserve the question, answer, and decision source.
