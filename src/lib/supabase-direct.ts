/**
 * Direct PostgREST helper — bypasses @supabase/supabase-js client cache.
 * Use this for ALL reads from app_settings to avoid stale data on Vercel.
 */

const getUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const getKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY!;

function headers() {
  const key = getKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

/** Read a single key from app_settings, auto-parse JSON strings */
export async function readAppSetting(key: string): Promise<any> {
  const url = `${getUrl()}/rest/v1/app_settings?key=eq.${encodeURIComponent(key)}&select=value`;
  const res = await fetch(url, {
    method: "GET",
    headers: { ...headers(), Accept: "application/json" },
    cache: "no-store",
  });
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  let val = rows[0].value;
  // Handle string-encoded JSON (text column or jsonb string)
  if (typeof val === "string") {
    try { val = JSON.parse(val); } catch {}
  }
  return val;
}

/** Write a single key to app_settings (upsert). Always stores as JSON string for consistency. */
export async function writeAppSetting(key: string, value: any): Promise<void> {
  const url = `${getUrl()}/rest/v1/app_settings?on_conflict=key`;
  const body = JSON.stringify({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  });
  await fetch(url, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body,
    cache: "no-store",
  });
}
