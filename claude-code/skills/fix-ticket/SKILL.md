---
description: Fix a Skiff ticket from the current local repo using Skiff MCP.
---

# Fix Skiff Ticket

Ticket: `$ARGUMENTS`

Use the Skiff MCP server named `skiff`.

1. Read the full ticket with `get_ticket`.
2. Read ticket assets with `get_ticket_assets`.
3. Read the fix packet with `get_fix_packet`.
4. Call `mark_ticket_in_progress` with tool `claude` when starting local work.
5. Confirm the linked repo matches the local repo.
6. Propose a short plan, implement the fix, and summarize verification.
7. Ask whether to mark the ticket closed. Only call `mark_ticket_resolved` after the user confirms.
