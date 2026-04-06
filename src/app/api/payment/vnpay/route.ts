import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getPaymentSettings } from "@/lib/server/payment-settings";

const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE!,
  hashSecret: process.env.VNPAY_HASH_SECRET!,
  url: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.NEXT_PUBLIC_BASE_URL + "/thanh-toan-thanh-cong",
};

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

export async function POST(req: NextRequest) {
  try {
    const settings = await getPaymentSettings();
    const { orderId, amount, orderInfo, ipAddr } = await req.json();
    const requestOrigin = req.nextUrl.origin;
    if (!orderId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    if (!settings.vnpay_enabled) {
      return NextResponse.json({ error: "VNPay is disabled by admin" }, { status: 400 });
    }

    const isMockByAdmin = settings.payment_mode === "mock";
    // Local fallback when gateway env is not configured.
    if (
      isMockByAdmin ||
      VNPAY_CONFIG.tmnCode.includes("your-") ||
      VNPAY_CONFIG.hashSecret.includes("your-")
    ) {
      const payUrl = `${requestOrigin}/thanh-toan-thanh-cong?orderId=${orderId}&vnp_ResponseCode=00`;
      return NextResponse.json({ payUrl, orderId, isMock: true });
    }

    const now = new Date();
    const createDate = now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    let vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNPAY_CONFIG.tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: String(amount * 100),
      vnp_ReturnUrl: VNPAY_CONFIG.returnUrl,
      vnp_IpAddr: ipAddr || "127.0.0.1",
      vnp_CreateDate: createDate,
    };
    vnpParams = sortObject(vnpParams);

    const signData = new URLSearchParams(vnpParams).toString();
    const hmac = crypto.createHmac("sha512", VNPAY_CONFIG.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams["vnp_SecureHash"] = signed;

    const paymentUrl = `${VNPAY_CONFIG.url}?${new URLSearchParams(vnpParams).toString()}`;

    return NextResponse.json({ payUrl: paymentUrl, orderId });
  } catch (error) {
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}