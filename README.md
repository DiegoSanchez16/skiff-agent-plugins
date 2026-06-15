# Skiff Agent Plugins

Native coding-tool plugins for Skiff ticket handoff.

This repository packages the last-mile install experience for local coding agents. The Skiff app owns ticket data, auth, repo linking, and the hosted MCP server. These plugins teach each coding tool how to connect to Skiff MCP and work from a ticket code like `E3AE25`.

## Plugins

- `cursor/` - Cursor plugin. Build and test this first.
- `claude-code/` - Claude Code plugin scaffold.
- `codex/` - Codex plugin scaffold.

## Cursor

The Cursor plugin connects Cursor to the hosted Skiff MCP server:

```text
https://app.getskiff.com/api/mcp
```

Create a Skiff MCP token in Skiff, then expose it to Cursor as:

```bash
export SKIFF_MCP_TOKEN="skiff_mcp_..."
```

The plugin includes:

- a plugin manifest
- Skiff MCP config
- a `fix-skiff-ticket` command
- a Skiff ticket handoff rule

Install locally while developing by copying the Cursor plugin folder:

```bash
rm -rf ~/.cursor/plugins/local/skiff
mkdir -p ~/.cursor/plugins/local/skiff
cp -R cursor/. ~/.cursor/plugins/local/skiff/
```

Then restart Cursor or run `Developer: Reload Window`.
