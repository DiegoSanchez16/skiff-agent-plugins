#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { homedir } from "node:os"

const token = process.argv[2]

function usage() {
  console.log("Usage: skiff-connect skiff_mcp_...")
  console.log("")
  console.log("Writes SKIFF_MCP_TOKEN to ~/.claude/settings.json for Claude Code.")
}

if (!token || token === "--help" || token === "-h") {
  usage()
  process.exit(token ? 0 : 1)
}

if (!/^skiff_mcp_[A-Za-z0-9_-]+$/.test(token)) {
  console.error("Expected a Skiff MCP token like skiff_mcp_...")
  process.exit(1)
}

const settingsPath =
  process.env.CLAUDE_SETTINGS_PATH ||
  join(homedir(), ".claude", "settings.json")

let settings = {}
if (existsSync(settingsPath)) {
  try {
    settings = JSON.parse(readFileSync(settingsPath, "utf8"))
  } catch (error) {
    console.error(`Could not parse ${settingsPath}: ${error.message}`)
    console.error("Fix the JSON, then run skiff-connect again.")
    process.exit(1)
  }
}

if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
  console.error(`${settingsPath} must contain a JSON object.`)
  process.exit(1)
}

settings.env = {
  ...(settings.env && typeof settings.env === "object" && !Array.isArray(settings.env)
    ? settings.env
    : {}),
  SKIFF_MCP_TOKEN: token,
}

mkdirSync(dirname(settingsPath), { recursive: true })
writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)

console.log(`Saved SKIFF_MCP_TOKEN to ${settingsPath}`)
console.log("Start a new Claude Code session, then run /mcp to confirm skiff is connected.")
