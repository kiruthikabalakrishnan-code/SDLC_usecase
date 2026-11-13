---
name: Run Agentic SDLC
description: Start the complete gated SDLC workflow for one supplied User Story.
argument-hint: Jira issue key/ID, Confluence reference, Word document, or pasted story
agent: Agentic SDLC Orchestrator
---

Run the Agentic SDLC workflow for the single User Story provided with this prompt.

- Accept a Jira issue key/ID, Confluence reference, Word document, or pasted story and preserve the original source/reference.
- Follow the Agentic SDLC Orchestrator workflow, specialist delegation, `docs/` output convention, traceability, clarification pauses, and all review, verification, final-output, and PR gates.
- For Jira, use the `story-ingestion` skill. Use the `requirements-traceability` skill throughout the lifecycle and the phase-specific skills required by specialists.
- Do not invent missing requirements or bypass human clarification.
- An associated Jira issue key/ID is required before preparing the Jira-named branch or performing commit, push, or PR operations. Never merge or write to Jira/Confluence.
- If no usable story/source was supplied, ask the user for it. If required tools, authentication, permissions, or delegation are unavailable, report the exact blocker.
