const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const key = process.env.OPENAI_API_KEY;
if (!key || !key.trim()) {
  console.error("Set OPENAI_API_KEY in the environment first.");
  process.exit(1);
}

const tmpFile = path.join(__dirname, ".tmp-key");
fs.writeFileSync(tmpFile, key.trim());
try {
  const result = execSync(`type "${tmpFile}" | npx vercel env add OPENAI_API_KEY production`, {
    encoding: "utf8",
    cwd: __dirname,
    shell: "cmd",
  });
  console.log(result);
} finally {
  try {
    fs.unlinkSync(tmpFile);
  } catch {
    /* noop */
  }
}
