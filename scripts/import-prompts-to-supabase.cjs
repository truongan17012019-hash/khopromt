/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createClient } = require("@supabase/supabase-js");

const ROOT = process.cwd();

function loadEnvFromFile(fileName) {
  const fullPath = path.join(ROOT, fileName);
  if (!fs.existsSync(fullPath)) return;
  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

loadEnvFromFile(".env.local");

const SOURCES = [
  { file: "src/data/prompts-content.ts", varName: "contentPrompts" },
  { file: "src/data/prompts-coding.ts", varName: "codingPrompts" },
  { file: "src/data/prompts-design.ts", varName: "designPrompts" },
  { file: "src/data/prompts-marketing.ts", varName: "marketingPrompts" },
  { file: "src/data/prompts-education.ts", varName: "educationPrompts" },
  { file: "src/data/prompts-business.ts", varName: "businessPrompts" },
];

function extractArrayLiteral(content, marker) {
  const markerIndex = content.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`Cannot find marker: ${marker}`);
  }

  const equalsIndex = content.indexOf("=", markerIndex);
  const start = content.indexOf("[", equalsIndex);
  if (start < 0) {
    throw new Error(`Cannot find array start for marker: ${marker}`);
  }

  let i = start;
  let bracketDepth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (; i < content.length; i += 1) {
    const ch = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      continue;
    } else if (inSingle && ch === "'") {
      inSingle = false;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      continue;
    } else if (inDouble && ch === '"') {
      inDouble = false;
      continue;
    }

    if (!inSingle && !inDouble && ch === "`" && !inTemplate) {
      inTemplate = true;
      continue;
    } else if (inTemplate && ch === "`") {
      inTemplate = false;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "[") bracketDepth += 1;
    if (ch === "]") {
      bracketDepth -= 1;
      if (bracketDepth === 0) {
        return content.slice(start, i + 1);
      }
    }
  }

  throw new Error(`Cannot find array end for marker: ${marker}`);
}

function loadPromptsFromSources() {
  const result = [];
  for (const source of SOURCES) {
    const filePath = path.join(ROOT, source.file);
    const text = fs.readFileSync(filePath, "utf8");
    const literal = extractArrayLiteral(text, `export const ${source.varName}`);
    const parsed = vm.runInNewContext(`(${literal})`, {});
    if (!Array.isArray(parsed)) {
      throw new Error(`Parsed value is not array: ${source.file}`);
    }
    result.push(...parsed);
  }
  return result;
}

function normalizePrompt(p) {
  return {
    id: String(p.id),
    slug: String(p.id),
    title: String(p.title || ""),
    description: String(p.description || ""),
    price: Number(p.price || 0),
    original_price: p.originalPrice == null ? null : Number(p.originalPrice),
    category_id: String(p.category || ""),
    tool_id: String(p.tool || ""),
    rating: Number(p.rating || 0),
    review_count: Number(p.reviewCount || 0),
    sold: Number(p.sold || 0),
    preview: String(p.preview || ""),
    full_content: String(p.fullContent || ""),
    tags: Array.isArray(p.tags) ? p.tags.map((t) => String(t)) : [],
    difficulty: String(p.difficulty || "Trung bình"),
    author_name: String(p.author || ""),
    image_url: String(p.image || ""),
    is_active: true,
    created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
  };
}

async function upsertInBatches(supabase, rows, batchSize = 100) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const { error } = await supabase.from("prompts").upsert(chunk, {
      onConflict: "id",
      ignoreDuplicates: false,
    });
    if (error) {
      throw new Error(`Upsert batch ${i / batchSize + 1} failed: ${error.message}`);
    }
    console.log(`Upserted ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const prompts = loadPromptsFromSources();
  const rows = prompts.map(normalizePrompt);

  console.log(`Loaded ${rows.length} prompts from source files.`);
  console.log(`Sample IDs: ${rows.slice(0, 5).map((r) => r.id).join(", ")}`);

  if (dryRun) {
    console.log("Dry run complete. No data written.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  const supabase = createClient(url, serviceRole);
  await upsertInBatches(supabase, rows, 100);
  console.log("Import completed successfully.");
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
