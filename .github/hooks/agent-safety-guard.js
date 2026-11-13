// PreToolUse safety guard: blocks recognized Atlassian writes, GitHub merges,
// and selected destructive shell/Git commands. Defense in depth, not an ACL.
const fs = require("node:fs");

function deny(reason) {
  fs.writeSync(
    1,
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
}

function collectCommandStrings(value, key = "") {
  if (!value || typeof value !== "object") {
    return typeof value === "string" && /command|cmd|script/i.test(key)
      ? [value]
      : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectCommandStrings(item, key));
  }
  return Object.entries(value).flatMap(([childKey, childValue]) =>
    collectCommandStrings(childValue, childKey),
  );
}

try {
  const event = JSON.parse(fs.readFileSync(0, "utf8"));
  const toolName = String(event.toolName || event.tool_name || "").toLowerCase();
  if (!toolName) {
    deny("Cannot identify the tool for this call; blocked by the workspace safety guard.");
    process.exit(0);
  }

  if (
    /atlassian/.test(toolName) &&
    /create|edit|update|delete|transition|executewrite|executedestructive|addoredit/.test(
      toolName,
    )
  ) {
    deny("Atlassian write operations are not permitted by this workspace workflow.");
    process.exit(0);
  }

  if (/github/.test(toolName) && /merge/.test(toolName)) {
    deny("Merging pull requests is not permitted by this workspace workflow.");
    process.exit(0);
  }

  const commandText = collectCommandStrings(event.toolInput || event.tool_input || {})
    .join("\n")
    .toLowerCase();
  const destructivePatterns = [
    /\bgit\s+reset\b[^;\n]*\s--hard\b/,
    /\bgit\s+clean\b[^;\n]*(?:\s-[a-z]*f[a-z]*\b|\s--force\b)/,
    /\bgit\s+push\b[^;\n]*(?:\s-f\b|\s--force(?:-with-lease)?\b)/,
    /\bgit\s+checkout\b[^;\n]*\s--\s/,
    /\bgit\s+restore\b[^;\n]*--worktree\b|\bgit\s+restore\b(?![^;\n]*--staged)[^;\n]+/,
    /\brm\b[^;\n]*(?:\s-r\b|\s--recursive\b)/,
    /\bremove-item\b[^;\n]*\s-recurse\b/,
    /\b(?:rmdir|rd)\b[^;\n]*\s\/s\b/,
    /\bdel(?:ete)?\b[^;\n]*\s\/s\b/,
    /\bgh\s+pr\s+merge\b/,
  ];
  if (destructivePatterns.some((pattern) => pattern.test(commandText))) {
    deny("Potentially destructive shell or Git command blocked by the workspace safety guard.");
  }
} catch (error) {
  deny(`Safety guard could not validate the tool call: ${error.message}`);
}
