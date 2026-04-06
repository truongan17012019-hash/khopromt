const fs = require("fs");
const c = fs.readFileSync("D:/Promt/promptvn/src/components/Header.tsx", "utf8");
c.split("\n").forEach((l, i) => {
  if (l.includes("import")) console.log(i + 1 + ": " + l);
});
