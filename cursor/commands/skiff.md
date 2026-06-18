---
name: skiff
description: Fix a Skiff ticket by code or id using Skiff MCP.
---

# Fix Skiff Ticket

Ticket: `$ARGUMENTS`

Use the Skiff MCP server named `skiff`.

1. Call `get_ticket` for the ticket above.
2. Call `get_ticket_assets` and inspect any screenshot or future video context.
3. Call `get_fix_packet` before editing files.
4. Call `mark_ticket_in_progress` with tool `cursor` when starting local work.
5. Confirm the Skiff linked repo matches this currently open local repo.
6. Inspect the codebase and propose a short plan.
7. Implement the fix.
8. Summarize files changed, verification run, and anything still unresolved.
9. Ask whether to mark the ticket closed. Only call `mark_ticket_resolved` after the user confirms.

If `$ARGUMENTS` is missing, ask for a Skiff ticket code such as `E3AE25`.
