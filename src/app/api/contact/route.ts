import { readAppSetting, writeAppSetting } from '@/lib/supabase-direct';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
      read: false,
    };

    const existingMessages = (await readAppSetting('contact_messages')) || [];
    const updatedMessages = [...existingMessages, newContact];

    await writeAppSetting('contact_messages', updatedMessages);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
