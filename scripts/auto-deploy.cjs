#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = process.cwd();
const watchedDirs = ["src", "public", "scripts"];
const watchedFiles = [
  "package.json",
  "next.config.mjs",
  "tailwind.config.ts",
  "postcss.config.mjs",
  ".env.local",
];
const ignoreParts = [
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}.next${path.sep}`,
  `${path.sep}.git${path.sep}`,
  `${path.sep}.vercel${path.sep}`,
];

let deployInProgress = false;
let pendingDeploy = false;
let debounceTimer = null;
let lastChangedPath = "";

function shouldIgnore(targetPath) {
  const normalized = targetPath.replace(/\//g, path.sep);
  return ignoreParts.some((part) => normalized.includes(part));
}

function runDeploy() {
  if (deployInProgress) {
    pendingDeploy = true;
    return;
  }

  deployInProgress = true;
  const startedAt = new Date();
  console.log(`\n[${startedAt.toISOString()}] Deploying to production...`);
  if (lastChangedPath) {
    console.log(`Last change: ${lastChangedPath}`);
  }

  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const child = spawn(cmd, ["vercel", "deploy", "--prod", "--yes"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });

  child.on("close", (code) => {
    const endedAt = new Date();
    if (code === 0) {
      console.log(`[${endedAt.toISOString()}] Deploy done.`);
    } else {
      console.log(`[${endedAt.toISOString()}] Deploy failed (exit ${code}).`);
    }
    deployInProgress = false;

    if (pendingDeploy) {
      pendingDeploy = false;
      runDeploy();
    }
  });
}

function queueDeploy(changedPath) {
  if (changedPath) {
    lastChangedPath = path.relative(root, changedPath);
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runDeploy, 2000);
}

function watchPath(absPath) {
  if (!fs.existsSync(absPath)) return;
  fs.watch(absPath, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const fullPath = path.join(absPath, filename.toString());
    if (shouldIgnore(fullPath)) return;
    if (!fs.existsSync(fullPath) && eventType !== "rename") return;
    queueDeploy(fullPath);
  });
  console.log(`Watching: ${path.relative(root, absPath) || "."}`);
}

for (const dir of watchedDirs) {
  watchPath(path.join(root, dir));
}

for (const file of watchedFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) continue;
  fs.watch(fullPath, () => queueDeploy(fullPath));
  console.log(`Watching file: ${file}`);
}

console.log("\nAuto deploy is running.");
console.log("Every code change will deploy to Vercel production.");
console.log("Press Ctrl+C to stop.\n");
