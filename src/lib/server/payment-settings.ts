import { createServerClient } from "@/lib/supabase";

export type PaymentMode = "mock" | "live";

export interface PaymentSettings {
  payment_mode: PaymentMode;
  momo_enabled: boolean;
  vnpay_enabled: boolean;
  bank_enabled: boolean;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  bank_qr_image: string;
  bank_transfer_note: string;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  payment_mode: "mock",
  momo_enabled: true,
  vnpay_enabled: true,
  bank_enabled: true,
  bank_name: "",
  bank_account_number: "",
  bank_account_holder: "",
  bank_qr_image: "",
  bank_transfer_note: "Vui lòng ghi đúng mã đơn hàng trong nội dung chuyển khoản.",
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return DEFAULT_PAYMENT_SETTINGS;
  }

  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", [
      "payment_mode",
      "momo_enabled",
      "vnpay_enabled",
      "bank_enabled",
      "bank_name",
      "bank_account_number",
      "bank_account_holder",
      "bank_qr_image",
      "bank_transfer_note",
    ]);

  if (error || !data) {
    return DEFAULT_PAYMENT_SETTINGS;
  }

  const merged = { ...DEFAULT_PAYMENT_SETTINGS };
  for (const row of data) {
    if (row.key === "payment_mode" && (row.value === "mock" || row.value === "live")) {
      merged.payment_mode = row.value;
    }
    if (row.key === "momo_enabled") {
      merged.momo_enabled = row.value === "true";
    }
    if (row.key === "vnpay_enabled") {
      merged.vnpay_enabled = row.value === "true";
    }
    if (row.key === "bank_enabled") merged.bank_enabled = row.value === "true";
    if (row.key === "bank_name") merged.bank_name = row.value || "";
    if (row.key === "bank_account_number") merged.bank_account_number = row.value || "";
    if (row.key === "bank_account_holder") merged.bank_account_holder = row.value || "";
    if (row.key === "bank_qr_image") merged.bank_qr_image = row.value || "";
    if (row.key === "bank_transfer_note") merged.bank_transfer_note = row.value || "";
  }
  return merged;
}

export async function savePaymentSettings(next: PaymentSettings) {
  const supabase = createServerClient();
  const payload = [
    { key: "payment_mode", value: next.payment_mode },
    { key: "momo_enabled", value: String(next.momo_enabled) },
    { key: "vnpay_enabled", value: String(next.vnpay_enabled) },
    { key: "bank_enabled", value: String(next.bank_enabled) },
    { key: "bank_name", value: next.bank_name || "" },
    { key: "bank_account_number", value: next.bank_account_number || "" },
    { key: "bank_account_holder", value: next.bank_account_holder || "" },
    { key: "bank_qr_image", value: next.bank_qr_image || "" },
    { key: "bank_transfer_note", value: next.bank_transfer_note || "" },
  ];

  const { error } = await supabase.from("app_settings").upsert(payload, {
    onConflict: "key",
  });

  if (error) {
    throw new Error(error.message);
  }
}
