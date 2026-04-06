import { createClient } from "@supabase/supabase-js";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isPlaceholder(value?: string) {
  if (!value) return true;
  return value.includes("your-");
}

export const isSupabaseConfigured =
  !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "");

// Do not crash module initialization when local env is still placeholder.
export const supabase =
  !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!)
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

// Server-side client with service role
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isPlaceholder(url) || !isValidHttpUrl(url!)) {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL. Please set a real Supabase URL in .env.local.");
  }

  if (isPlaceholder(serviceRoleKey)) {
    throw new Error("Invalid SUPABASE_SERVICE_ROLE_KEY. Please set a real key in .env.local.");
  }

  return createClient(
    url!,
    serviceRoleKey!
  );
}