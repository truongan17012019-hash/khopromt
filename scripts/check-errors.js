const { execSync } = require("child_process");
try {
  const out = execSync("npx next build", { encoding: "utf-8", stdio: "pipe" });
  console.log("BUILD OK");
} catch (e) {
  const all = (e.stdout || "") + (e.stderr || "");
  const lines = all.split("\n");
  const errLines = lines.filter(l =>
    l.includes("Error occurred prerendering") ||
    l.includes("Module not found") ||
    l.includes("not exported") ||
    l.includes("Cannot find module") ||
    l.includes("Element type is invalid")
  );
  errLines.slice(0, 10).forEach(l => console.log(l.trim()));
}
