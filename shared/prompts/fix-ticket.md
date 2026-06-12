# Skiff Ticket Fix Workflow

Use the Skiff MCP server before editing code.

1. Read the ticket with `get_ticket`.
2. Read assets with `get_ticket_assets`.
3. Read implementation context with `get_fix_packet`.
4. Confirm the linked repo matches the repo currently open locally.
5. Inspect the relevant files.
6. Propose a short plan.
7. Implement the fix.
8. Summarize changed files, verification, and any follow-up needed.

Do not guess ticket details from the short prompt alone. Treat Skiff MCP as the source of truth.

