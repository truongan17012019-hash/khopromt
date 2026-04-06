import { NextRequest, NextResponse } from "next/server";

function getDefaultQuestions(language: string): string[] {
  if (language === "en") return [
    "Who is the target audience for this content?",
    "What tone or style do you prefer?",
    "Any specific requirements or constraints?",
  ];
  return [
    "Đối tượng mục tiêu của nội dung này là ai?",
    "Bạn muốn giọng điệu/phong cách như thế nào?",
    "Có yêu cầu hoặc ràng buộc cụ thể nào không?",
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, tool, language } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ questions: getDefaultQuestions(language) });
    const lang = language === "en" ? "English" : "Vietnamese";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", max_tokens: 500, temperature: 0.7,
        messages: [
          { role: "system", content: `You are a prompt engineering assistant. The user wants to enhance their prompt for ${tool}. Ask exactly 3 short clarifying questions in ${lang} to help create a better prompt. Return ONLY a JSON array of 3 question strings. Example: ["Question 1?","Question 2?","Question 3?"]` },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return NextResponse.json({ questions: getDefaultQuestions(language) });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    try {
      const questions = JSON.parse(text);
      if (Array.isArray(questions) && questions.length >= 2) {
        return NextResponse.json({ questions: questions.slice(0, 3) });
      }
    } catch {}
    return NextResponse.json({ questions: getDefaultQuestions(language) });
  } catch {
    return NextResponse.json({ questions: getDefaultQuestions("vi") });
  }
}
