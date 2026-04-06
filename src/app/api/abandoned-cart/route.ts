import { NextRequest, NextResponse } from 'next/server';
import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';

interface CartItem {
  promptId: string;
  title: string;
  price: number;
}

interface AbandonedCart {
  email: string;
  items: CartItem[];
  created_at: string;
  reminded: boolean;
  recovered: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const carts = await readAppSetting('abandoned_carts');
    
    if (email) {
      const filtered = (carts || []).filter((c: AbandonedCart) => c.email === email);
      return NextResponse.json({
        success: true,
        data: filtered
      });
    }

    return NextResponse.json({
      success: true,
      data: carts || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, items, action } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    let carts = (await readAppSetting('abandoned_carts')) || [];

    if (action === 'remind') {
      const cartIndex = carts.findIndex((c: AbandonedCart) => c.email === email);
      if (cartIndex >= 0) {
        carts[cartIndex].reminded = true;
      }
      await writeAppSetting('abandoned_carts', carts);
      return NextResponse.json({
        success: true,
        message: 'Đã gửi nhắc nhở'
      });
    }

    if (action === 'recover') {
      const cartIndex = carts.findIndex((c: AbandonedCart) => c.email === email);
      if (cartIndex >= 0) {
        carts[cartIndex].recovered = true;
      }
      await writeAppSetting('abandoned_carts', carts);
      return NextResponse.json({
        success: true,
        message: 'Đã đánh dấu giỏ hàng đã được khôi phục'
      });
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Check if cart already exists
    const existingIndex = carts.findIndex((c: AbandonedCart) => c.email === email);
    
    const newCart: AbandonedCart = {
      email,
      items,
      created_at: new Date().toISOString(),
      reminded: false,
      recovered: false
    };

    if (existingIndex >= 0) {
      carts[existingIndex] = newCart;
    } else {
      carts.push(newCart);
    }

    await writeAppSetting('abandoned_carts', carts);

    return NextResponse.json({
      success: true,
      message: 'Giỏ hàng đã được lưu'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Cart operation failed' },
      { status: 500 }
    );
  }
}