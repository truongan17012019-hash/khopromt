import { NextRequest, NextResponse } from 'next/server';
import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';
import crypto from 'crypto';

interface ReferralCode {
  code: string;
  created_at: string;
}

interface ReferralTracking {
  referrer_email: string;
  referred_email: string;
  code: string;
  signed_up_at: string;
  first_purchase_at: string | null;
  reward_paid: boolean;
  reward_amount: number;
}

interface UserBalances {
  [email: string]: number;
}

interface BalanceTransaction {
  user_email: string;
  amount: number;
  type: 'referral_reward' | 'purchase' | 'other';
  description: string;
  timestamp: string;
}

// Generate random 6-character alphanumeric code
function generateReferralCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
}

// GET: Fetch user's referral code and stats
async function handleGet(email: string) {
  try {
    const referralCodes = (await readAppSetting('referral_codes')) || {};
    const referralTracking = (await readAppSetting('referral_tracking')) || [];

    let userCode: string | null = null;

    if (referralCodes[email]) {
      userCode = referralCodes[email].code;
    }

    // Calculate stats
    const userReferrals = referralTracking.filter(
      (r: ReferralTracking) => r.referrer_email === email
    );
    const totalReferred = userReferrals.length;
    const totalEarned = userReferrals.reduce(
      (sum: number, r: ReferralTracking) => sum + (r.reward_paid ? r.reward_amount : 0),
      0
    );
    const pendingReward = userReferrals.filter(
      (r: ReferralTracking) => !r.reward_paid && r.signed_up_at
    ).length;

    return NextResponse.json({
      success: true,
      code: userCode,
      stats: {
        totalReferred,
        totalEarned,
        pendingReward,
      },
      referrals: userReferrals,
    });
  } catch (error) {
    console.error('GET referral error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch referral data' }, { status: 500 });
  }
}

// POST: Handle different referral actions
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, code, referred_email } = body;

    if (action === 'generate') {
      // Generate referral code for user
      const referralCodes = (await readAppSetting('referral_codes')) || {};

      if (referralCodes[email]) {
        return NextResponse.json({
          success: true,
          code: referralCodes[email].code,
          message: 'Code already exists',
        });
      }

      const newCode = generateReferralCode();
      referralCodes[email] = {
        code: newCode,
        created_at: new Date().toISOString(),
      };

      await writeAppSetting('referral_codes', referralCodes);

      return NextResponse.json({
        success: true,
        code: newCode,
        message: 'Code generated successfully',
      });
    } else if (action === 'track_signup') {
      // Track when someone signs up via referral link
      const referralCodes = (await readAppSetting('referral_codes')) || {};
      const referralTracking = (await readAppSetting('referral_tracking')) || [];

      // Find referrer by code
      let referrerEmail: string | null = null;
      for (const [email, codeData] of Object.entries(referralCodes)) {
        if ((codeData as ReferralCode).code === code) {
          referrerEmail = email;
          break;
        }
      }

      if (!referrerEmail) {
        return NextResponse.json({ success: false, error: 'Invalid referral code' }, { status: 400 });
      }

      // Check if already tracked
      const alreadyTracked = referralTracking.find(
        (r: ReferralTracking) => r.referred_email === referred_email && r.code === code
      );

      if (alreadyTracked) {
        return NextResponse.json({ success: true, message: 'Already tracked' });
      }

      // Add new tracking entry
      const newTracking: ReferralTracking = {
        referrer_email: referrerEmail,
        referred_email,
        code,
        signed_up_at: new Date().toISOString(),
        first_purchase_at: null,
        reward_paid: false,
        reward_amount: 10000,
      };

      referralTracking.push(newTracking);
      await writeAppSetting('referral_tracking', referralTracking);

      return NextResponse.json({
        success: true,
        message: 'Signup tracked',
        referrer: referrerEmail,
      });
    } else if (action === 'complete') {
      // Called after first purchase - pay reward to referrer
      const referralTracking = (await readAppSetting('referral_tracking')) || [];
      const userBalances = (await readAppSetting('user_balances')) || {};
      const balanceTransactions = (await readAppSetting('balance_transactions')) || [];

      // Find tracking entry
      const trackingEntry = referralTracking.find(
        (r: ReferralTracking) =>
          r.referred_email === referred_email && !r.reward_paid && r.signed_up_at
      );

      if (!trackingEntry) {
        return NextResponse.json({ success: false, error: 'No pending referral reward' }, { status: 400 });
      }

      const referrerEmail = trackingEntry.referrer_email;
      const rewardAmount = 10000;

      // Update user balance
      userBalances[referrerEmail] = (userBalances[referrerEmail] || 0) + rewardAmount;

      // Log transaction
      const transaction: BalanceTransaction = {
        user_email: referrerEmail,
        amount: rewardAmount,
        type: 'referral_reward',
        description: `Referral reward for ${referred_email}`,
        timestamp: new Date().toISOString(),
      };

      balanceTransactions.push(transaction);

      // Mark as reward paid
      trackingEntry.first_purchase_at = new Date().toISOString();
      trackingEntry.reward_paid = true;

      // Save all changes
      await writeAppSetting('user_balances', userBalances);
      await writeAppSetting('balance_transactions', balanceTransactions);
      await writeAppSetting('referral_tracking', referralTracking);

      return NextResponse.json({
        success: true,
        message: 'Reward paid successfully',
        amount: rewardAmount,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST referral error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process referral' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
  }

  return handleGet(email);
}

export async function POST(req: NextRequest) {
  return handlePost(req);
}