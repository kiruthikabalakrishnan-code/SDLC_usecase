---
name: Draft Requirements
description: Clarify one User Story and produce traceable, testable requirements under docs/.
argument-hint: Jira issue key/ID, Confluence reference, Word document, or pasted story
agent: Requirements Agent
---

Process one supplied User Story using the Requirements Agent instructions.

- Use the `story-ingestion` skill for Jira sources and the `requirements-traceability` skill for stable requirement IDs and source mapping.
- Ask concise, grouped questions before finalizing whenever critical information is missing. Do not invent answers; pause with `AWAITING_CLARIFICATION` when blockers remain.
- Preserve the source and canonical reference. Report inaccessible content and retrieval failures explicitly.
- Create `docs/requirements.md` using the required template and readiness status.
- Do not modify application code, write to Jira/Confluence, or create commits, branches, or PRs.
- If no story/source was supplied, ask the user for it.
