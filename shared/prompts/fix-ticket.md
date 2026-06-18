# Skiff Ticket Fix Workflow

Use the Skiff MCP server before editing code.

1. Read the ticket with `get_ticket`.
2. Read assets with `get_ticket_assets`.
3. Read implementation context with `get_fix_packet`.
4. Call `mark_ticket_in_progress` with the current tool name when starting local work.
5. Confirm the linked repo matches the repo currently open locally.
6. Inspect the relevant files.
7. Propose a short plan.
8. Implement the fix.
9. Summarize changed files, verification, and any follow-up needed.
10. Ask whether to mark the ticket closed. Only call `mark_ticket_resolved` after the user confirms.

Do not guess ticket details from the short prompt alone. Treat Skiff MCP as the source of truth.
