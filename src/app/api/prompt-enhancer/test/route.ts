import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt trống" }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key chưa cấu hình" }, { status: 500 });
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err?.error?.message || "Lỗi API" }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content?.trim() || "Không có phản hồi" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi server" }, { status: 500 });
  }
}
