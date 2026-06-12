import { readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const errors = []

function readJson(path) {
  try {
    return JSON.parse(readFileSync(join(root, path), "utf8"))
  } catch (error) {
    errors.push(`${path}: ${error.message}`)
    return null
  }
}

function assertFile(path) {
  try {
    if (!statSync(join(root, path)).isFile()) errors.push(`${path}: not a file`)
  } catch {
    errors.push(`${path}: missing`)
  }
}

function assertDir(path) {
  try {
    if (!statSync(join(root, path)).isDirectory()) errors.push(`${path}: not a directory`)
  } catch {
    errors.push(`${path}: missing`)
  }
}

function assertFrontmatter(path, keys) {
  const text = readFileSync(join(root, path), "utf8")
  if (!text.startsWith("---\n")) {
    errors.push(`${path}: missing frontmatter`)
    return
  }
  const end = text.indexOf("\n---\n", 4)
  if (end === -1) {
    errors.push(`${path}: malformed frontmatter`)
    return
  }
  const block = text.slice(4, end)
  for (const key of keys) {
    if (!new RegExp(`(^|\\n)${key}:\\s*\\S`).test(block)) {
      errors.push(`${path}: missing ${key}`)
    }
  }
}

const cursorMarketplace = readJson(".cursor-plugin/marketplace.json")
const cursorManifest = readJson("cursor/.cursor-plugin/plugin.json")
const cursorMcp = readJson("cursor/mcp.json")
const claudeManifest = readJson("claude-code/.claude-plugin/plugin.json")
const claudeMcp = readJson("claude-code/.mcp.json")
const codexManifest = readJson("codex/.codex-plugin/plugin.json")
const codexMcp = readJson("codex/.mcp.json")

assertDir("cursor")
assertDir("claude-code")
assertDir("codex")
assertFile("cursor/assets/logo.svg")

if (cursorMarketplace?.plugins?.[0]?.source !== "cursor") {
  errors.push(".cursor-plugin/marketplace.json: expected first plugin source to be cursor")
}
if (cursorManifest?.name !== "skiff") errors.push("cursor plugin name must be skiff")
if (!cursorMcp?.mcpServers?.skiff?.url) errors.push("cursor MCP server skiff.url missing")
if (!cursorMcp?.mcpServers?.skiff?.headers?.Authorization?.includes("SKIFF_MCP_TOKEN")) {
  errors.push("cursor MCP Authorization header must use SKIFF_MCP_TOKEN")
}
if (claudeManifest?.name !== "skiff") errors.push("claude plugin name must be skiff")
if (!claudeMcp?.mcpServers?.skiff?.url) errors.push("claude MCP server skiff.url missing")
if (codexManifest?.name !== "skiff") errors.push("codex plugin name must be skiff")
if (!codexMcp?.mcp_servers?.skiff?.bearer_token_env_var) {
  errors.push("codex MCP bearer_token_env_var missing")
}

assertFrontmatter("cursor/commands/fix-skiff-ticket.md", ["name", "description"])
assertFrontmatter("cursor/skills/fix-ticket/SKILL.md", ["name", "description"])
assertFrontmatter("cursor/rules/skiff-ticket-handoff.mdc", ["description", "alwaysApply"])
assertFrontmatter("claude-code/skills/fix-ticket/SKILL.md", ["description"])
assertFrontmatter("codex/skills/fix-ticket/SKILL.md", ["name", "description"])

if (errors.length > 0) {
  console.error("Validation failed:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("Validation passed.")

