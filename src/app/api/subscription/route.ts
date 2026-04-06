import { NextRequest, NextResponse } from "next/server";
import { readAppSetting, writeAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SubscriptionData {
  [email: string]: {
    plan: "free" | "pro" | "business";
    billingCycle: "monthly" | "yearly" | null;
    startedAt: string;
    expiresAt: string | null;
    autoRenew: boolean;
  };
}

interface UserBalance {
  [email: string]: number;
}

interface Transaction {
  email: string;
  type: "purchase" | "refund" | "subscription";
  amount: number;
  planType?: string;
  billingCycle?: string;
  timestamp: string;
  description: string;
}

const PLAN_PRICES = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 199000, yearly: 1690000 },
  business: { monthly: 499000, yearly: 4290000 },
};

function calculateExpirationDate(billingCycle: "monthly" | "yearly"): string {
  const now = new Date();
  if (billingCycle === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now.toISOString();
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const subscriptionsData = await readAppSetting("subscriptions");
    const subscriptions: SubscriptionData = subscriptionsData || {};

    const userSubscription = subscriptions[email];

    if (!userSubscription) {
      return NextResponse.json({
        plan: "free",
        expiresAt: null,
        billingCycle: null,
      });
    }

    return NextResponse.json({
      plan: userSubscription.plan,
      expiresAt: userSubscription.expiresAt,
      billingCycle: userSubscription.billingCycle,
      startedAt: userSubscription.startedAt,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan, billingCycle } = body;

    if (!email || !plan || !billingCycle) {
      return NextResponse.json(
        { error: "Email, plan, and billingCycle are required" },
        { status: 400 }
      );
    }

    if (!["free", "pro", "business"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan type" },
        { status: 400 }
      );
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Free plan doesn't require payment
    if (plan !== "free") {
      const balances = (await readAppSetting("user_balances")) || {};
      const userBalance = balances[email] || 0;

      const price =
        PLAN_PRICES[plan as keyof typeof PLAN_PRICES][
          billingCycle as "monthly" | "yearly"
        ];

      if (userBalance < price) {
        return NextResponse.json(
          { error: "Insufficient balance", requiredAmount: price, currentBalance: userBalance },
          { status: 402 }
        );
      }

      // Deduct from wallet
      balances[email] = userBalance - price;
      await writeAppSetting("user_balances", balances);

      // Log transaction
      const transactions = (await readAppSetting("balance_transactions")) || [];
      const transaction: Transaction = {
        email,
        type: "subscription",
        amount: price,
        planType: plan,
        billingCycle,
        timestamp: new Date().toISOString(),
        description: `Subscription upgrade to ${plan} (${billingCycle})`,
      };
      transactions.push(transaction);
      await writeAppSetting("balance_transactions", transactions);
    }

    // Store subscription
    const subscriptionsData = (await readAppSetting("subscriptions")) || {};
    const expiresAt =
      plan === "free" ? null : calculateExpirationDate(billingCycle as "monthly" | "yearly");

    subscriptionsData[email] = {
      plan,
      billingCycle: plan === "free" ? null : billingCycle,
      startedAt: new Date().toISOString(),
      expiresAt,
      autoRenew: true,
    };

    await writeAppSetting("subscriptions", subscriptionsData);

    return NextResponse.json({
      success: true,
      plan,
      billingCycle: plan === "free" ? null : billingCycle,
      expiresAt,
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
