import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { finalizePaidOrder } from "@/lib/server/order-finalize";
import crypto from "crypto";

const processedTransactions = new Set<string>();

export async function POST(req: NextRequest) {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ message: "OK (mock mode)" });
  }

  try {
    const body = await req.json();

    // MoMo callback
    if (body.partnerCode) {
      const { orderId, resultCode, transId } = body;

      if (resultCode === 0) {
        // Payment success
        await processSuccessfulPayment(supabase, orderId, transId, "momo");
      } else {
        // Payment failed
        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", orderId);
      }

      return NextResponse.json({ message: "OK" });
    }

    return NextResponse.json({ error: "Unknown callback" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}

// VNPay returns via GET
export async function GET(req: NextRequest) {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ message: "OK (mock mode)" });
  }
  const { searchParams } = new URL(req.url);

  const vnpParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    vnpParams[key] = value;
  });

  const secureHash = vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHashType"];
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = vnpParams[key];
      return acc;
    }, {});

  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET!);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const orderId = vnpParams["vnp_TxnRef"];
    const responseCode = vnpParams["vnp_ResponseCode"];
    const transactionId = vnpParams["vnp_TransactionNo"];

    if (responseCode === "00") {
      await processSuccessfulPayment(supabase, orderId, transactionId, "vnpay");
    } else {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ message: "OK" });
}
async function processSuccessfulPayment(
  supabase: any,
  orderId: string,
  transactionId: string,
  method: string
) {
  const txKey = `${method}:${transactionId || orderId}`;
  if (processedTransactions.has(txKey)) {
    return;
  }
  processedTransactions.add(txKey);

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("payment_status")
    .eq("id", orderId)
    .single();
  if (existingOrder?.payment_status === "paid") {
    return;
  }

  // Update order status
  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      transaction_id: transactionId,
    })
    .eq("id", orderId);

  await finalizePaidOrder(supabase, orderId);
}