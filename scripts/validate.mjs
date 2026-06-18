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
const claudeMarketplace = readJson(".claude-plugin/marketplace.json")
const codexMarketplace = readJson(".agents/plugins/marketplace.json")
const packageJson = readJson("package.json")
const cursorManifest = readJson("cursor/.cursor-plugin/plugin.json")
const cursorMcp = readJson("cursor/mcp.json")
const claudeManifest = readJson("claude-code/.claude-plugin/plugin.json")
const claudeMcp = readJson("claude-code/.mcp.json")
const codexManifest = readJson("codex/.codex-plugin/plugin.json")

assertDir("cursor")
assertDir("claude-code")
assertDir("codex")
assertFile("bin/skiff-connect.mjs")
assertFile(".agents/plugins/marketplace.json")
assertFile("cursor/assets/logo.svg")
assertFile("claude-code/assets/logo.svg")
assertFile("codex/assets/logo.svg")

if (packageJson?.bin?.connect !== "bin/skiff-connect.mjs") {
  errors.push("package.json: expected connect bin")
}
if (packageJson?.bin?.["skiff-connect"] !== "bin/skiff-connect.mjs") {
  errors.push("package.json: expected skiff-connect bin")
}
if (cursorMarketplace?.plugins?.[0]?.source !== "cursor") {
  errors.push(".cursor-plugin/marketplace.json: expected first plugin source to be cursor")
}
if (cursorManifest?.name !== "skiff") errors.push("cursor plugin name must be skiff")
if (claudeMarketplace?.plugins?.[0]?.source !== "./claude-code") {
  errors.push(".claude-plugin/marketplace.json: expected first plugin source to be ./claude-code")
}
if (!cursorMcp?.mcpServers?.skiff?.url) errors.push("cursor MCP server skiff.url missing")
if (!cursorMcp?.mcpServers?.skiff?.headers?.Authorization?.includes("SKIFF_MCP_TOKEN")) {
  errors.push("cursor MCP Authorization header must use SKIFF_MCP_TOKEN")
}
if (claudeManifest?.name !== "skiff") errors.push("claude plugin name must be skiff")
if (claudeMcp?.mcpServers?.skiff?.command !== "npx") {
  errors.push("claude MCP server must launch through npx")
}
if (!Array.isArray(claudeMcp?.mcpServers?.skiff?.args) || !claudeMcp.mcpServers.skiff.args.includes("mcp-remote")) {
  errors.push("claude MCP server must use mcp-remote args")
}
if (!Array.isArray(claudeMcp?.mcpServers?.skiff?.args) || !claudeMcp.mcpServers.skiff.args.some((value) => typeof value === "string" && value.includes("SKIFF_MCP_TOKEN"))) {
  errors.push("claude MCP args must reference SKIFF_MCP_TOKEN")
}
if (codexManifest?.name !== "skiff") errors.push("codex plugin name must be skiff")
if (codexManifest && Object.hasOwn(codexManifest, "mcpServers")) {
  errors.push("codex plugin should not bundle MCP auth; @getskiff/connect writes Codex MCP config")
}
if (codexManifest?.interface?.iconSmall !== "./assets/logo.svg") {
  errors.push("codex plugin iconSmall must point to ./assets/logo.svg")
}
if (codexMarketplace?.name !== "Skiff") {
  errors.push(".agents/plugins/marketplace.json: expected marketplace name to be Skiff")
}
if (codexMarketplace?.plugins?.[0]?.source?.path !== "./codex") {
  errors.push(".agents/plugins/marketplace.json: expected first plugin source path to be ./codex")
}

assertFrontmatter("cursor/commands/skiff.md", ["name", "description"])
assertFrontmatter("cursor/rules/skiff-ticket-handoff.mdc", ["description", "alwaysApply"])
assertFrontmatter("claude-code/skills/fix-ticket/SKILL.md", ["description"])
assertFrontmatter("codex/skills/fix-ticket/SKILL.md", ["name", "description"])

if (errors.length > 0) {
  console.error("Validation failed:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("Validation passed.")
