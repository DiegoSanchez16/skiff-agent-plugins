---
name: fix-ticket
description: Use when the user asks Cursor to fix a Skiff ticket, report, issue code, or feedback item.
---

# Skiff Fix Ticket

Use this skill when the user wants to work on a Skiff ticket from the current local repo.

The user may provide a short board code like `E3AE25`, a report id, a ticket id, or an issue-group id.

Workflow:

1. Use Skiff MCP `get_ticket` to read the full ticket.
2. Use Skiff MCP `get_ticket_assets` to collect screenshots and future video assets.
3. Use Skiff MCP `get_fix_packet` to get the implementation-ready context.
4. Compare the ticket's linked repo to the currently open local repo. If they do not match, stop and tell the user which repo Skiff expects.
5. Inspect the code before editing.
6. Share a concise plan.
7. Make the smallest useful code change.
8. Run focused verification when available.
9. Summarize changed files, tests, and any unresolved risk.

Never rely only on the short ticket code. Always read Skiff MCP first.

