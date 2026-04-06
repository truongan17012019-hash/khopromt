const fs = require("fs");
const path = require("path");

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { scanDir(full); continue; }
    if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue;
    const content = fs.readFileSync(full, "utf8");
    const imports = [...content.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1]);
    for (const imp of imports) {
      if (imp.startsWith("@/")) {
        const resolved = path.join("D:/Promt/promptvn/src", imp.slice(2));
        const exists = fs.existsSync(resolved + ".ts") || fs.existsSync(resolved + ".tsx") || fs.existsSync(resolved);
        if (!exists) console.log("MISSING: " + imp + " in " + full.replace("D:\\Promt\\promptvn\\", ""));
      }
    }
  }
}
scanDir("D:/Promt/promptvn/src/app/admin");
scanDir("D:/Promt/promptvn/src/app");
console.log("Done scanning");
