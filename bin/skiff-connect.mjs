#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { homedir } from "node:os"

const command = process.argv[2]

function usage() {
  console.log("Usage: skiff-connect skiff_mcp_...")
  console.log("       skiff-connect disconnect")
  console.log("")
  console.log("Writes SKIFF_MCP_TOKEN to ~/.claude/settings.json for Claude Code.")
  console.log("Use disconnect to remove only SKIFF_MCP_TOKEN from Claude settings.")
}

if (!command || command === "--help" || command === "-h") {
  usage()
  process.exit(command ? 0 : 1)
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

if (command === "disconnect") {
  const env = settings.env && typeof settings.env === "object" && !Array.isArray(settings.env)
    ? { ...settings.env }
    : {}

  if (!Object.hasOwn(env, "SKIFF_MCP_TOKEN")) {
    console.log(`No SKIFF_MCP_TOKEN found in ${settingsPath}`)
    console.log("Start a new Claude Code session if you already removed it elsewhere.")
    process.exit(0)
  }

  delete env.SKIFF_MCP_TOKEN

  if (Object.keys(env).length > 0) {
    settings.env = env
  } else {
    delete settings.env
  }

  mkdirSync(dirname(settingsPath), { recursive: true })
  writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)

  console.log(`Removed SKIFF_MCP_TOKEN from ${settingsPath}`)
  console.log("Start a new Claude Code session, then run /mcp to confirm skiff is disconnected.")
  process.exit(0)
}

if (!/^skiff_mcp_[A-Za-z0-9_-]+$/.test(command)) {
  console.error("Expected a Skiff MCP token like skiff_mcp_... or the command disconnect.")
  process.exit(1)
}

settings.env = {
  ...(settings.env && typeof settings.env === "object" && !Array.isArray(settings.env)
    ? settings.env
    : {}),
  SKIFF_MCP_TOKEN: command,
}

mkdirSync(dirname(settingsPath), { recursive: true })
writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)

console.log(`Saved SKIFF_MCP_TOKEN to ${settingsPath}`)
console.log("Start a new Claude Code session, then run /mcp to confirm skiff is connected.")
