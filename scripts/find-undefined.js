// Check each component imported in layout for undefined exports
const path = require("path");
const checks = [
  ["@/components/Header", "D:/Promt/promptvn/src/components/Header.tsx"],
  ["@/components/Footer", "D:/Promt/promptvn/src/components/Footer.tsx"],
  ["@/components/Toast", "D:/Promt/promptvn/src/components/Toast.tsx"],
  ["@/components/AuthProvider", "D:/Promt/promptvn/src/components/AuthProvider.tsx"],
  ["@/components/JsonLd", "D:/Promt/promptvn/src/components/JsonLd.tsx"],
];
const fs = require("fs");
for (const [name, filepath] of checks) {
  if (!fs.existsSync(filepath)) {
    console.log("MISSING: " + name + " -> " + filepath);
    continue;
  }
  const content = fs.readFileSync(filepath, "utf8");
  const hasDefault = content.includes("export default");
  const namedExports = [...content.matchAll(/export\s+(function|const|class)\s+(\w+)/g)].map(m => m[2]);
  console.log(name + ": default=" + hasDefault + ", named=[" + namedExports.join(",") + "]");
}

// Check admin layout imports
const adminLayout = "D:/Promt/promptvn/src/app/admin/layout.tsx";
if (fs.existsSync(adminLayout)) {
  const content = fs.readFileSync(adminLayout, "utf8");
  const imports = [...content.matchAll(/from\s+"([^"]+)"/g)].map(m => m[1]);
  console.log("\nAdmin layout imports:", imports);
  for (const imp of imports) {
    if (imp.startsWith("@/")) {
      const resolved = "D:/Promt/promptvn/src/" + imp.slice(2);
      const exists = fs.existsSync(resolved + ".ts") || fs.existsSync(resolved + ".tsx");
      if (!exists) console.log("  MISSING: " + imp + " -> " + resolved);
    }
  }
}
