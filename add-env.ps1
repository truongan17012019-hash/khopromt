# Add OpenAI key to Vercel production env (never commit real keys).
# Run locally after: $env:OPENAI_API_KEY = "your-key-here"
if (-not $env:OPENAI_API_KEY) {
  Write-Error "Set OPENAI_API_KEY first, e.g. `$env:OPENAI_API_KEY = 'sk-...'"
  exit 1
}
$env:OPENAI_API_KEY | npx vercel env add OPENAI_API_KEY production
