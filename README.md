# Skiff Agent Plugins

MCP setup helpers for Skiff ticket handoff in local coding tools.

The Skiff app owns ticket data, auth, repo linking, and the hosted MCP server. This repo packages the tool-specific setup that lets local agents read a Skiff ticket code like `E3AE25` and pull the full ticket through Skiff MCP.

## Integration status

- `cursor/` - Cursor plugin that configures Skiff MCP plus a ticket command/rule. Submitted to the Cursor marketplace and tested locally.
- `claude-code/` - Claude Desktop marketplace plugin that configures Skiff MCP for Claude Code. Tested with `@getskiff/connect` for token setup.
- `codex/` - Codex Desktop plugin scaffold with a marketplace entry. Token setup is handled by `@getskiff/connect codex`.

## Cursor

The Cursor plugin adds Skiff MCP configuration plus a ticket command/rule for Cursor:

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

## Claude Desktop

Add this repository as a Claude marketplace, then install the Skiff plugin from Claude Desktop. The plugin bundles a `/skiff:fix-ticket` skill and Skiff MCP configuration for Claude Code.

Create a Skiff MCP token in Skiff, then use `@getskiff/connect` to save that token where Claude Code can read it:

```bash
npx @getskiff/connect "skiff_mcp_..."
```

For local package development, you can test from this GitHub repo:

```bash
npx -y github:DiegoSanchez16/skiff-agent-plugins "skiff_mcp_..."
```

The command writes the token to Claude Code settings:

```json
{
  "env": {
    "SKIFF_MCP_TOKEN": "skiff_mcp_..."
  }
}
```

If `~/.claude/settings.json` already has an `env` object, add only `SKIFF_MCP_TOKEN` inside it. Start a new Claude Code session after changing settings, then run `/mcp` to confirm `skiff` is connected.

To disconnect Claude from Skiff MCP:

```bash
npx @getskiff/connect disconnect
```

The disconnect command removes only `SKIFF_MCP_TOKEN` from `~/.claude/settings.json`. It preserves the rest of your Claude settings.

## Codex Desktop

Codex Desktop can add this repository as a plugin marketplace. The Codex plugin currently bundles the Skiff ticket skill; MCP auth is configured separately by `@getskiff/connect` so the desktop app does not depend on shell environment variables.

Add the marketplace from Codex Desktop:

- Source: `DiegoSanchez16/skiff-agent-plugins`
- Git ref: `main`
- Sparse paths: `.agents/plugins` and `codex`

Create a Skiff MCP token in Skiff, then connect Codex Desktop with:

```bash
npx @getskiff/connect codex "skiff_mcp_..."
```

That command writes a Skiff MCP server block to `~/.codex/config.toml` using the hosted Skiff MCP URL:

```toml
[mcp_servers.skiff]
url = "https://app.getskiff.com/api/mcp"
enabled = true
http_headers = { Authorization = "Bearer skiff_mcp_..." }
```

Start a new Codex Desktop thread, open the linked repo, then ask Codex:

```text
Use Skiff to fix ticket E3AE25.
```

To disconnect Codex from Skiff MCP:

```bash
npx @getskiff/connect codex disconnect
```

The disconnect command removes only the `[mcp_servers.skiff]` block from `~/.codex/config.toml`. It preserves the rest of your Codex settings.
