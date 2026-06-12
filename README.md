# Skiff Agent Plugins

Native coding-tool plugins for Skiff ticket handoff.

This repository packages the last-mile install experience for local coding agents. The Skiff app owns ticket data, auth, repo linking, and the hosted MCP server. These plugins teach each coding tool how to connect to Skiff MCP and work from a ticket code like `E3AE25`.

## Plugins

- `cursor/` - Cursor plugin. Build and test this first.
- `claude-code/` - Claude Code plugin scaffold.
- `codex/` - Codex plugin scaffold.

## MCP

Set a Skiff MCP token in your shell environment:

```bash
export SKIFF_MCP_TOKEN="skiff_mcp_..."
```

The plugins point at:

```text
https://app.getskiff.com/api/mcp
```

For local Skiff development, change the plugin MCP URL to:

```text
http://localhost:3002/api/mcp
```

## Cursor First

The Cursor plugin is the first complete target. It contains:

- a plugin manifest
- Skiff MCP config
- a `fix-skiff-ticket` command
- a `fix-ticket` skill

Install locally while developing by symlinking the Cursor plugin folder:

```bash
ln -s "$(pwd)/cursor" ~/.cursor/plugins/local/skiff
```

Then restart Cursor or run `Developer: Reload Window`.
