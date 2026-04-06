const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});
const apiKey = env.OPENAI_API_KEY;
console.log('Key starts:', apiKey?.substring(0, 20));

async function test() {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        { role: "system", content: "You are helpful." },
        { role: "user", content: "Say hello in Vietnamese, 1 sentence only" },
      ],
    }),
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}
test().catch(console.error);
