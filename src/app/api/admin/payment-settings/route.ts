import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentSettings,
  savePaymentSettings,
  type PaymentMode,
} from "@/lib/server/payment-settings";

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot load payment settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment_mode: PaymentMode = body?.payment_mode === "live" ? "live" : "mock";
    const momo_enabled = !!body?.momo_enabled;
    const vnpay_enabled = !!body?.vnpay_enabled;
    const bank_enabled = !!body?.bank_enabled;
    const bank_name = String(body?.bank_name || "");
    const bank_account_number = String(body?.bank_account_number || "");
    const bank_account_holder = String(body?.bank_account_holder || "");
    const bank_qr_image = String(body?.bank_qr_image || "");
    const bank_transfer_note = String(body?.bank_transfer_note || "");

    await savePaymentSettings({
      payment_mode,
      momo_enabled,
      vnpay_enabled,
      bank_enabled,
      bank_name,
      bank_account_number,
      bank_account_holder,
      bank_qr_image,
      bank_transfer_note,
    });
    return NextResponse.json({
      data: {
        payment_mode,
        momo_enabled,
        vnpay_enabled,
        bank_enabled,
        bank_name,
        bank_account_number,
        bank_account_holder,
        bank_qr_image,
        bank_transfer_note,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot save payment settings" },
      { status: 500 }
    );
  }
}
