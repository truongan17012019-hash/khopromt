// Start next dev server and check the _not-found page
const http = require("http");
const { spawn } = require("child_process");

const child = spawn("npx", ["next", "dev", "--port", "3987"], {
  cwd: "D:/Promt/promptvn",
  stdio: ["pipe", "pipe", "pipe"],
  shell: true,
});

let output = "";
child.stdout.on("data", d => { output += d.toString(); });
child.stderr.on("data", d => { output += d.toString(); });

// Wait for server to start, then fetch a non-existent page
setTimeout(() => {
  http.get("http://localhost:3987/__test_404_page__", (res) => {
    let body = "";
    res.on("data", d => body += d);
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      // Check server console for errors
      const errLines = output.split("\n").filter(l =>
        l.includes("Error") || l.includes("undefined") || l.includes("Module")
      );
      console.log("Server errors:");
      errLines.forEach(l => console.log("  " + l.trim()));
      child.kill();
      process.exit(0);
    });
  }).on("error", e => {
    console.log("Fetch error:", e.message);
    console.log("Server output:", output.slice(-500));
    child.kill();
    process.exit(1);
  });
}, 15000);

setTimeout(() => { child.kill(); process.exit(0); }, 30000);
