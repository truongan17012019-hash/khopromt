import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getPaymentSettings } from "@/lib/server/payment-settings";

const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE!,
  accessKey: process.env.MOMO_ACCESS_KEY!,
  secretKey: process.env.MOMO_SECRET_KEY!,
  endpoint: process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: process.env.NEXT_PUBLIC_BASE_URL + "/thanh-toan-thanh-cong",
  ipnUrl: process.env.NEXT_PUBLIC_BASE_URL + "/api/payment/callback",
};

export async function POST(req: NextRequest) {
  try {
    const settings = await getPaymentSettings();
    const { orderId, amount, orderInfo } = await req.json();
    const requestOrigin = req.nextUrl.origin;
    if (!orderId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    if (!settings.momo_enabled) {
      return NextResponse.json({ error: "MoMo is disabled by admin" }, { status: 400 });
    }

    const isMockByAdmin = settings.payment_mode === "mock";
    // Local fallback when gateway env is not configured.
    if (
      isMockByAdmin ||
      MOMO_CONFIG.partnerCode.includes("your-") ||
      MOMO_CONFIG.accessKey.includes("your-") ||
      MOMO_CONFIG.secretKey.includes("your-")
    ) {
      const payUrl = `${requestOrigin}/thanh-toan-thanh-cong?orderId=${orderId}&resultCode=0`;
      return NextResponse.json({ payUrl, orderId, isMock: true });
    }

    const requestId = `${orderId}-${Date.now()}`;
    const extraData = "";

    // Create signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo || "Thanh toán PromptVN"}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

    const signature = crypto
      .createHmac("sha256", MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: "PromptVN",
      storeId: "PromptVNStore",
      requestId,
      amount,
      orderId,
      orderInfo: orderInfo || "Thanh toán PromptVN",
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      lang: "vi",
      requestType: "payWithMethod",
      autoCapture: true,
      extraData,
      signature,
    };
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.resultCode === 0) {
      return NextResponse.json({ payUrl: data.payUrl, orderId });
    } else {
      return NextResponse.json(
        { error: data.message || "MoMo payment creation failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}