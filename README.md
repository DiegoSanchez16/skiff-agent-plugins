# Skiff Agent Plugins

Last-mile integrations for Skiff ticket handoff in local coding tools.

The Skiff app owns ticket data, auth, repo linking, and the hosted MCP server. This repo packages the tool-specific layer that lets local agents read a Skiff ticket code like `E3AE25` and pull the full ticket through Skiff MCP.

## Integration status

- `cursor/` - Cursor plugin for Cursor's plugin system. Submitted to the Cursor marketplace and tested locally.
- `claude-code/` - Claude Desktop marketplace plugin for Claude Code sessions. Tested with `@getskiff/connect` for auth setup.
- `codex/` - Codex plugin scaffold. Not ready for user-facing install yet.

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

## Claude Desktop

Add this repository as a Claude marketplace, then install the Skiff plugin from Claude Desktop. The plugin bundles a `/skiff:fix-ticket` skill and a Skiff MCP server that connects through `npx mcp-remote`.

Create a Skiff MCP token in Skiff, then connect Claude Code with the helper command:

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
