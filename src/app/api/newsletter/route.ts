import { NextRequest, NextResponse } from 'next/server';
import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';

interface Subscriber {
  email: string;
  name: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  source: 'footer' | 'popup' | 'checkout';
}

export async function GET(request: NextRequest) {
  try {
    const subscribers = await readAppSetting('newsletter_subscribers');
    return NextResponse.json({
      success: true,
      data: subscribers || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    let subscribers = (await readAppSetting('newsletter_subscribers')) || [];
    
    // Check if already subscribed
    const existingIndex = subscribers.findIndex((s: Subscriber) => s.email === email);
    
    if (existingIndex >= 0) {
      // Resubscribe if was unsubscribed
      subscribers[existingIndex] = {
        ...subscribers[existingIndex],
        status: 'active',
        subscribed_at: new Date().toISOString()
      };
    } else {
      // Add new subscriber
      subscribers.push({
        email,
        name,
        subscribed_at: new Date().toISOString(),
        status: 'active',
        source: source || 'footer'
      });
    }

    await writeAppSetting('newsletter_subscribers', subscribers);

    return NextResponse.json({
      success: true,
      message: 'Đã đăng ký thành công'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Subscription failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    let subscribers = (await readAppSetting('newsletter_subscribers')) || [];
    const index = subscribers.findIndex((s: Subscriber) => s.email === email);

    if (index >= 0) {
      subscribers[index].status = 'unsubscribed';
      await writeAppSetting('newsletter_subscribers', subscribers);
    }

    return NextResponse.json({
      success: true,
      message: 'Đã hủy đăng ký'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unsubscribe failed' },
      { status: 500 }
    );
  }
}