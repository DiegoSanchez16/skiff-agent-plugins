# Skiff Agent Plugins

MCP setup helpers for Skiff ticket handoff in local coding tools.

The Skiff app owns ticket data, auth, repo linking, and the hosted MCP server. This repo packages the tool-specific setup that lets local agents read a Skiff ticket code like `E3AE25` and pull the full ticket through Skiff MCP.

## Integration status

- `cursor/` - Cursor plugin with a ticket command/rule. Skiff MCP is configured separately as a user MCP server in Cursor.
- `claude-code/` - Claude Desktop marketplace plugin that configures Skiff MCP for Claude Code. Tested with `@getskiff/connect` for token setup.
- `codex/` - Codex Desktop plugin scaffold with a marketplace entry. Token setup is handled by `@getskiff/connect codex`.

## Cursor

Cursor uses two pieces:

- a user MCP server in Cursor settings
- a Skiff plugin command/rule for ticket handoff

Create a Skiff MCP token in Skiff, then add Skiff as a custom MCP server in Cursor:

```json
{
  "mcpServers": {
    "skiff": {
      "url": "https://app.getskiff.com/api/mcp",
      "headers": {
        "Authorization": "Bearer skiff_mcp_..."
      }
    }
  }
}
```

The plugin includes:

- a plugin manifest
- a `/skiff` command
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

Claude marketplace source:

```text
GitHub repo: DiegoSanchez16/skiff-agent-plugins
Git URL: https://github.com/DiegoSanchez16/skiff-agent-plugins
```

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
- Git URL: `https://github.com/DiegoSanchez16/skiff-agent-plugins`

Leave Git ref and Sparse paths empty unless Codex asks for them.

After the marketplace is added, find Skiff in Codex Desktop and click **Add plugin**.

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
