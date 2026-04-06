import { NextRequest, NextResponse } from 'next/server';
import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';

interface Campaign {
  id: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'abandoned_cart' | 'welcome' | 'promo';
  status: 'draft' | 'sent';
  sent_at?: string;
  recipients_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const campaigns = await readAppSetting('email_campaigns');
    return NextResponse.json({
      success: true,
      data: campaigns || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, subject, content, type, campaign_id } = await request.json();

    let campaigns = (await readAppSetting('email_campaigns')) || [];

    if (action === 'create') {
      if (!subject || !content || !type) {
        return NextResponse.json(
          { success: false, error: 'Subject, content, and type are required' },
          { status: 400 }
        );
      }

      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        subject,
        content,
        type,
        status: 'draft',
        recipients_count: 0,
        open_count: 0,
        click_count: 0,
        created_at: new Date().toISOString()
      };

      campaigns.push(newCampaign);
      await writeAppSetting('email_campaigns', campaigns);

      return NextResponse.json({
        success: true,
        message: 'Chiến dịch được tạo thành công',
        data: newCampaign
      });
    }

    if (action === 'send') {
      if (!campaign_id) {
        return NextResponse.json(
          { success: false, error: 'Campaign ID is required' },
          { status: 400 }
        );
      }

      const campIndex = campaigns.findIndex((c: Campaign) => c.id === campaign_id);
      if (campIndex < 0) {
        return NextResponse.json(
          { success: false, error: 'Campaign not found' },
          { status: 404 }
        );
      }

      const subscribers = await readAppSetting('newsletter_subscribers') || [];
      const activeSubscribers = subscribers.filter((s: any) => s.status === 'active');

      campaigns[campIndex] = {
        ...campaigns[campIndex],
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipients_count: activeSubscribers.length
      };

      await writeAppSetting('email_campaigns', campaigns);

      return NextResponse.json({
        success: true,
        message: 'Chiến dịch được gửi thành công',
        data: campaigns[campIndex]
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Campaign operation failed' },
      { status: 500 }
    );
  }
}