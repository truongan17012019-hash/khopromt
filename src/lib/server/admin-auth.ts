import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Nhoc201091@@";

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function randomSalt() {
  return crypto.randomBytes(16).toString("hex");
}

export async function ensureAdminSeed() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("app_settings")
    .select("key,value")
    .in("key", ["admin_email", "admin_password_hash", "admin_password_salt"]);
  const map = new Map<string, string>((data || []).map((r: any) => [r.key, r.value]));
  if (map.get("admin_email") && map.get("admin_password_hash") && map.get("admin_password_salt")) {
    return;
  }
  const salt = randomSalt();
  const hash = hashPassword(DEFAULT_ADMIN_PASSWORD, salt);
  await supabase.from("app_settings").upsert(
    [
      { key: "admin_email", value: DEFAULT_ADMIN_EMAIL },
      { key: "admin_password_salt", value: salt },
      { key: "admin_password_hash", value: hash },
    ],
    { onConflict: "key" }
  );
}

export async function verifyAdminLogin(email: string, password: string) {
  const supabase = createServerClient();
  await ensureAdminSeed();
  const { data } = await supabase
    .from("app_settings")
    .select("key,value")
    .in("key", ["admin_email", "admin_password_hash", "admin_password_salt"]);
  const map = new Map<string, string>((data || []).map((r: any) => [r.key, r.value]));
  const adminEmail = (map.get("admin_email") || "").toLowerCase();
  const salt = map.get("admin_password_salt") || "";
  const hash = map.get("admin_password_hash") || "";
  if (email.toLowerCase() !== adminEmail) return false;
  if (!salt || !hash) return false;
  return hashPassword(password, salt) === hash;
}

export async function resetAdminPassword(newPassword: string) {
  const supabase = createServerClient();
  const salt = randomSalt();
  const hash = hashPassword(newPassword, salt);
  const { error } = await supabase.from("app_settings").upsert(
    [
      { key: "admin_password_salt", value: salt },
      { key: "admin_password_hash", value: hash },
    ],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}
