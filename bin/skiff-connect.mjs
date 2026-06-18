#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { homedir } from "node:os"

const SKIFF_MCP_URL = "https://app.getskiff.com/api/mcp"
const args = process.argv.slice(2)
const target = args[0]

function usage() {
  console.log("Usage: skiff-connect skiff_mcp_...")
  console.log("       skiff-connect claude skiff_mcp_...")
  console.log("       skiff-connect disconnect")
  console.log("       skiff-connect claude disconnect")
  console.log("       skiff-connect codex skiff_mcp_...")
  console.log("       skiff-connect codex disconnect")
  console.log("")
  console.log("Claude setup writes SKIFF_MCP_TOKEN to ~/.claude/settings.json.")
  console.log("Codex setup writes Skiff MCP config to ~/.codex/config.toml.")
}

if (!target || target === "--help" || target === "-h") {
  usage()
  process.exit(target ? 0 : 1)
}

function assertToken(token) {
  if (!/^skiff_mcp_[A-Za-z0-9_-]+$/.test(token ?? "")) {
    console.error("Expected a Skiff MCP token like skiff_mcp_... or a disconnect command.")
    process.exit(1)
  }
}

function readJsonObject(path) {
  if (!existsSync(path)) return {}
  try {
    const value = JSON.parse(readFileSync(path, "utf8"))
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      console.error(`${path} must contain a JSON object.`)
      process.exit(1)
    }
    return value
  } catch (error) {
    console.error(`Could not parse ${path}: ${error.message}`)
    console.error("Fix the JSON, then run skiff-connect again.")
    process.exit(1)
  }
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

function connectClaude(token) {
  assertToken(token)

  const settingsPath =
    process.env.CLAUDE_SETTINGS_PATH ||
    join(homedir(), ".claude", "settings.json")
  const settings = readJsonObject(settingsPath)

  settings.env = {
    ...(settings.env && typeof settings.env === "object" && !Array.isArray(settings.env)
      ? settings.env
      : {}),
    SKIFF_MCP_TOKEN: token,
  }

  writeText(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)

  console.log(`Saved SKIFF_MCP_TOKEN to ${settingsPath}`)
  console.log("Start a new Claude Code session, then run /mcp to confirm skiff is connected.")
}

function disconnectClaude() {
  const settingsPath =
    process.env.CLAUDE_SETTINGS_PATH ||
    join(homedir(), ".claude", "settings.json")
  const settings = readJsonObject(settingsPath)
  const env = settings.env && typeof settings.env === "object" && !Array.isArray(settings.env)
    ? { ...settings.env }
    : {}

  if (!Object.hasOwn(env, "SKIFF_MCP_TOKEN")) {
    console.log(`No SKIFF_MCP_TOKEN found in ${settingsPath}`)
    console.log("Start a new Claude Code session if you already removed it elsewhere.")
    return
  }

  delete env.SKIFF_MCP_TOKEN

  if (Object.keys(env).length > 0) {
    settings.env = env
  } else {
    delete settings.env
  }

  writeText(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)

  console.log(`Removed SKIFF_MCP_TOKEN from ${settingsPath}`)
  console.log("Start a new Claude Code session, then run /mcp to confirm skiff is disconnected.")
}

function escapeTomlString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function skiffCodexBlock(token) {
  return [
    "[mcp_servers.skiff]",
    `url = "${SKIFF_MCP_URL}"`,
    "enabled = true",
    `http_headers = { Authorization = "Bearer ${escapeTomlString(token)}" }`,
    "",
  ].join("\n")
}

function upsertTomlTable(text, tableName, block) {
  const tablePattern = new RegExp(`(^|\\n)\\[${tableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\n[\\s\\S]*?(?=\\n\\[[^\\n]+\\]|$)`)
  if (tablePattern.test(text)) {
    return text.replace(tablePattern, (match, prefix) => `${prefix}${block.trimEnd()}\n`)
  }

  const trimmed = text.trimEnd()
  return `${trimmed}${trimmed ? "\n\n" : ""}${block.trimEnd()}\n`
}

function removeTomlTable(text, tableName) {
  const tablePattern = new RegExp(`(^|\\n)\\[${tableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\n[\\s\\S]*?(?=\\n\\[[^\\n]+\\]|$)`)
  return text.replace(tablePattern, (match, prefix) => prefix === "\n" ? "\n" : "").replace(/\n{3,}/g, "\n\n")
}

function connectCodex(token) {
  assertToken(token)

  const configPath =
    process.env.CODEX_CONFIG_PATH ||
    join(homedir(), ".codex", "config.toml")
  const current = existsSync(configPath) ? readFileSync(configPath, "utf8") : ""
  const next = upsertTomlTable(current, "mcp_servers.skiff", skiffCodexBlock(token))

  writeText(configPath, next.endsWith("\n") ? next : `${next}\n`)

  console.log(`Saved Skiff MCP server config to ${configPath}`)
  console.log("Start a new Codex Desktop thread, then ask Codex to use Skiff on a ticket.")
}

function disconnectCodex() {
  const configPath =
    process.env.CODEX_CONFIG_PATH ||
    join(homedir(), ".codex", "config.toml")

  if (!existsSync(configPath)) {
    console.log(`No Codex config found at ${configPath}`)
    console.log("Start a new Codex Desktop thread if you already removed it elsewhere.")
    return
  }

  const current = readFileSync(configPath, "utf8")
  const next = removeTomlTable(current, "mcp_servers.skiff")

  if (next === current) {
    console.log(`No Skiff MCP server config found in ${configPath}`)
    console.log("Start a new Codex Desktop thread if you already removed it elsewhere.")
    return
  }

  writeText(configPath, next.endsWith("\n") || next.length === 0 ? next : `${next}\n`)

  console.log(`Removed Skiff MCP server config from ${configPath}`)
  console.log("Start a new Codex Desktop thread, then check MCP settings to confirm skiff is disconnected.")
}

if (target === "codex") {
  if (args[1] === "disconnect") {
    disconnectCodex()
  } else {
    connectCodex(args[1])
  }
  process.exit(0)
}

if (target === "claude") {
  if (args[1] === "disconnect") {
    disconnectClaude()
  } else {
    connectClaude(args[1])
  }
  process.exit(0)
}

if (target === "disconnect") {
  disconnectClaude()
  process.exit(0)
}

connectClaude(target)
