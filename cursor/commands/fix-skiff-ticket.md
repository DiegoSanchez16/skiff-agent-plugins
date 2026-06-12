---
name: fix-skiff-ticket
description: Fix a Skiff ticket by code or id using Skiff MCP.
---

# Fix Skiff Ticket

Ticket: `$ARGUMENTS`

Use the Skiff MCP server named `skiff`.

1. Call `get_ticket` for the ticket above.
2. Call `get_ticket_assets` and inspect any screenshot or future video context.
3. Call `get_fix_packet` before editing files.
4. Confirm the Skiff linked repo matches this currently open local repo.
5. Inspect the codebase and propose a short plan.
6. Implement the fix.
7. Summarize files changed, verification run, and anything still unresolved.

If `$ARGUMENTS` is missing, ask for a Skiff ticket code such as `E3AE25`.

