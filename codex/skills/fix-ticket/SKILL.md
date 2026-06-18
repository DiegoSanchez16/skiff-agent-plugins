---
name: fix-ticket
description: Fix a Skiff ticket from the current local repo using Skiff MCP.
---

# Fix Skiff Ticket

Use when the user asks Codex to fix a Skiff ticket.

Read the ticket with Skiff MCP `get_ticket`, read assets with `get_ticket_assets`, and read the fix packet with `get_fix_packet` before editing. Call `mark_ticket_in_progress` with tool `codex` when starting local work. Confirm the linked repo matches the current local repo, propose a short plan, implement the fix, and summarize changed files plus verification. Ask whether to mark the ticket closed, and only call `mark_ticket_resolved` after the user confirms.
