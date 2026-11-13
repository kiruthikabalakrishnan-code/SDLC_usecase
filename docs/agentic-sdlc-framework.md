# Agentic SDLC framework

This repository contains reusable Copilot agents, phase prompts, skills, repository instructions, and VS Code MCP server definitions for the Agentic SDLC. It is configuration only: do not run a Jira/Confluence story or create business-specific SDLC artifacts until a user supplies a source and asks to run the Orchestrator.

## Entry point and artifacts

Use these workspace slash commands from Copilot Chat:

- `/run-agentic-sdlc` — start the complete gated workflow for one User Story.
- `/draft-requirements` — run requirements clarification and create `docs/requirements.md` only.
- `/sdlc-mcp-preflight` — check Atlassian and GitHub MCP connectivity without reading an issue or starting a workflow.

The commands are prompt files under `.github/prompts/`; they route work to the Orchestrator or Requirements Agent, or perform a read-only connectivity check. An associated Jira issue key/ID is required before branch preparation and GitHub PR operations. The Orchestrator delegates each phase to its named specialist, maintains `docs/sdlc-state.md` during an actual run, pauses for blocking questions, and enforces the review, verification, final-output, and PR gates. Hooks under `.github/hooks/` provide separate automatic tool-use guards; prompt commands do not replace those safeguards.

Business artifacts are created under `docs/` only during an actual SDLC run. The final business report uses `docs/final-output.md` as its canonical source and generates `docs/final-output.docx` from it. The framework guide itself is not a business artifact.

## MCP and authentication

`.vscode/mcp.json` uses the VS Code workspace MCP format and the official remote endpoints for Atlassian and GitHub. No token or password is stored in this repository. On first use, install/enable the MCP servers if requested by the client, sign in through the provider's supported OAuth flow, and review/trust the servers and requested tools.

Atlassian's server exposes capabilities beyond read operations. This workflow instructs its agents to retrieve Jira/Confluence information only and not to write there. Workspace hooks deny recognized Atlassian write tools, but hooks are not an authorization boundary; review the tools offered by the MCP client and use an Atlassian account with appropriately limited permissions where possible. GitHub operations likewise require the signed-in user's authorization. A Jira issue key/ID authorizes the scoped branch, commit, push, and PR workflow after all gates pass; do not merge.

## Delegation and runtime notes

The Orchestrator declares an explicit allowlist of specialist agent names. Current VS Code Copilot documentation describes custom-agent delegation in the Copilot harness through its native task tool; the Local harness uses its separate `agent`/`runSubagent` tool set. These are harness-dependent. If the selected runtime does not expose custom-agent task delegation, do not claim that automatic orchestration worked: report the limitation and use the specialist prompts manually only with the user's approval.

Custom agent files use `.github/agents/*.agent.md`, prompts use `.github/prompts/*.prompt.md`, and skills use `.github/skills/<skill-name>/SKILL.md`. The MCP configuration is VS Code's `servers` format in `.vscode/mcp.json`; other Copilot clients may require the portable `.mcp.json` format instead.

## Workspace hooks

`.github/hooks/sdlc-guards.json` registers two `PreToolUse` guards:

- `agent-safety-guard.js` denies recognized Atlassian write operations, GitHub merge tools, and selected destructive shell/Git commands.
- `pr-publication-gate.js` denies `git push`, GitHub pull-request creation, and repository file-push operations until `docs/sdlc-state.md` and `docs/verification.md` contain the required passing gate attestations and both final-output files exist.

The PR gate expects exact status lines documented in the Orchestrator, Verification Agent, and PR Agent instructions. `PASS_WITH_WARNINGS` also requires the user's acceptance to be recorded in state. Hooks need Node.js available on PATH. Tool names vary by Copilot runtime, so validate the recognized MCP names in the target client. These guards are defense-in-depth only: alternate tools, shells, or clients that do not load workspace hooks can bypass them. Keep least-privilege MCP permissions and review all external operations.

## Manual setup and first validation

1. Ensure the GitHub Copilot extension and a Copilot-enabled account are available in VS Code, and open this workspace as trusted.
2. Enable the two configured MCP servers and authenticate with Atlassian and GitHub when prompted. Inspect and trust the requested tools; do not store credentials in repository files.
3. Start a harmless Copilot session without supplying a real Jira/Confluence source. Select the Orchestrator and confirm the agents and phase prompts are discoverable and that a specialist task can be delegated. Stop before any business workflow or external write.

If a needed runtime, authentication, permission, or document-conversion capability is unavailable, the workflow must report a blocker instead of claiming success.
