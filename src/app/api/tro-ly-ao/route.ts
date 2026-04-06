import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Tin nhắn trống" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API chưa cấu hình" }, { status: 500 });

    const systemMsg = {
      role: "system",
      content: `Bạn là Trợ lý AI thông minh của PromptVN. Bạn giúp người dùng Việt Nam với mọi câu hỏi.
Quy tắc:
- Trả lời bằng tiếng Việt trừ khi được yêu cầu khác
- Trả lời chính xác, hữu ích, dễ hiểu
- Sử dụng markdown formatting khi cần
- Nếu không biết, hãy nói thật thay vì bịa
- Nhớ ngữ cảnh cuộc trò chuyện trước đó`,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 3000,
        temperature: 0.7,
        messages: [systemMsg, ...messages.slice(-20)], // Keep last 20 messages for context
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err?.error?.message || "Lỗi API" }, { status: 500 });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || "Không có phản hồi" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi server" }, { status: 500 });
  }
}
