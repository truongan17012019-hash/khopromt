import { NextRequest, NextResponse } from 'next/server';
import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';

const MIN_PAYOUT = 100000; // 100,000đ

interface SellerEarnings {
  [email: string]: {
    total_earned: number;
    available: number;
    withdrawn: number;
    commission_rate: number;
  };
}

interface PayoutRequest {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bank_info: {
    bank_name: string;
    account_number: string;
    account_holder: string;
  };
  requested_at: string;
  reviewed_at?: string;
  note?: string;
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const earnings = await readAppSetting('seller_earnings') || {};
    const sellerEarnings = earnings[email] || {
      total_earned: 0,
      available: 0,
      withdrawn: 0,
      commission_rate: 0.7,
    };

    return NextResponse.json(sellerEarnings);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, amount, bank_info, payout_id, note } = body;

    if (action === 'request_payout') {
      if (!email || !amount || !bank_info) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      if (amount < MIN_PAYOUT) {
        return NextResponse.json(
          { error: `Minimum payout is ${MIN_PAYOUT.toLocaleString()}đ` },
          { status: 400 }
        );
      }

      const earnings = (await readAppSetting('seller_earnings')) || {};
      const sellerEarnings = earnings[email];

      if (!sellerEarnings || sellerEarnings.available < amount) {
        return NextResponse.json(
          { error: 'Insufficient available balance' },
          { status: 400 }
        );
      }

      const payouts = (await readAppSetting('seller_payouts')) || [];
      const newPayout: PayoutRequest = {
        id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        amount,
        status: 'pending',
        bank_info,
        requested_at: new Date().toISOString(),
      };

      payouts.push(newPayout);
      await writeAppSetting('seller_payouts', payouts);

      return NextResponse.json(newPayout, { status: 201 });
    }

    if (action === 'approve_payout') {
      if (!payout_id) {
        return NextResponse.json(
          { error: 'Payout ID is required' },
          { status: 400 }
        );
      }

      const payouts = (await readAppSetting('seller_payouts')) || [];
      const payoutIndex = payouts.findIndex((p: PayoutRequest) => p.id === payout_id);

      if (payoutIndex === -1) {
        return NextResponse.json(
          { error: 'Payout not found' },
          { status: 404 }
        );
      }

      const payout = payouts[payoutIndex];
      if (payout.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending payouts can be approved' },
          { status: 400 }
        );
      }

      const earnings = (await readAppSetting('seller_earnings')) || {};
      earnings[payout.email].available -= payout.amount;
      earnings[payout.email].withdrawn += payout.amount;

      payout.status = 'approved';
      payout.reviewed_at = new Date().toISOString();

      payouts[payoutIndex] = payout;

      await writeAppSetting('seller_earnings', earnings);
      await writeAppSetting('seller_payouts', payouts);

      return NextResponse.json(payout);
    }

    if (action === 'reject_payout') {
      if (!payout_id) {
        return NextResponse.json(
          { error: 'Payout ID is required' },
          { status: 400 }
        );
      }

      const payouts = (await readAppSetting('seller_payouts')) || [];
      const payoutIndex = payouts.findIndex((p: PayoutRequest) => p.id === payout_id);

      if (payoutIndex === -1) {
        return NextResponse.json(
          { error: 'Payout not found' },
          { status: 404 }
        );
      }

      const payout = payouts[payoutIndex];
      if (payout.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending payouts can be rejected' },
          { status: 400 }
        );
      }

      payout.status = 'rejected';
      payout.reviewed_at = new Date().toISOString();
      payout.note = note || 'Rejected by admin';

      payouts[payoutIndex] = payout;

      await writeAppSetting('seller_payouts', payouts);

      return NextResponse.json(payout);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing payout:', error);
    return NextResponse.json(
      { error: 'Failed to process payout' },
      { status: 500 }
    );
  }
}