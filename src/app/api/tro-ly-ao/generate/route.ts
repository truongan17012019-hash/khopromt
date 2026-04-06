import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface GenerateRequest {
  promptId: string;
  promptTitle: string;
  promptContent: string;
  category: string;
  variables: Record<string, string>;
  customRequest?: string;
  userId?: string;
  action?: "generate" | "unlock" | "get" | "history" | "followup" | "feedback";
  sessionId?: string;
  method?: "wallet" | "plan";
  categoryId?: string;
  followUpMessage?: string;
  rating?: "up" | "down";
  feedbackNote?: string;
}

const SESSION_DB_KEY = "chatbot_generations";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const PRICE_BY_CATEGORY: Record<string, number> = {
  "viet-content": 12000,
  "lap-trinh": 18000,
  "thiet-ke-anh": 15000,
  marketing: 15000,
  "giao-duc": 10000,
  "kinh-doanh": 15000,
  "cham-soc-khach-hang": 10000,
  "ban-hang": 12000,
};

const PRICE_BY_PROMPT: Record<string, number> = {
  "cskh-14": 8000,
  "cskh-15": 9000,
  "sale-1": 12000,
};

function resolveUnlockPrice(promptId: string, categoryId: string | undefined) {
  const prompt = PRICE_BY_PROMPT[String(promptId || "")];
  if (typeof prompt === "number") return prompt;
  const byCat = PRICE_BY_CATEGORY[String(categoryId || "")];
  if (typeof byCat === "number") return byCat;
  return 12000;
}

function cleanupExpiredSessions(list: any[]) {
  const now = Date.now();
  return list.filter((x) => {
    const createdAt = new Date(x?.created_at || 0).getTime();
    return createdAt > 0 && now - createdAt <= TTL_MS;
  });
}

// Claude API call (primary)
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "";
}

// OpenAI API call (fallback)
async function callOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Build the generation prompt
function buildPrompts(req: GenerateRequest) {
  const variablesList = Object.entries(req.variables)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
  const customRequest = String(req.customRequest || "").trim();
  const hasTemplate = !!String(req.promptContent || "").trim();

  const systemPrompt = `Bạn là một chuyên gia Prompt Engineer cấp cao.
Nhiệm vụ: Dựa trên thông tin đã thu thập, tạo ra một Prompt hoàn chỉnh theo chuẩn:
Role -> Context -> Task -> Constraints -> Output.
Sau đó tạo thêm bản "Refined" nâng cao.

PROMPT TEMPLATE:
${hasTemplate ? req.promptContent : "(Không có template cố định - tự suy luận theo yêu cầu người dùng)"}

QUY TẮC:
1. Viết bằng tiếng Việt, tự nhiên, chuyên nghiệp
2. Cá nhân hóa theo thông tin người dùng cung cấp
3. Nếu thông tin còn thiếu, dùng giả định hợp lý và ghi rõ "Giả định"
4. Đầu ra bắt buộc có các phần:
   - [PROMPT HOÀN CHỈNH]
   - [PROMPT REFINED]
   - [5 HOOK GỢI Ý]
5. [PROMPT HOÀN CHỈNH] và [PROMPT REFINED] phải ở dạng có thể copy dùng ngay.
6. Không trả lời lan man, ưu tiên cấu trúc rõ ràng.`;

  const userMessage = `Tình huống: "${req.promptTitle || customRequest || "Yêu cầu tùy chỉnh"}"

Thông tin cụ thể:
${variablesList}

Yêu cầu tự do của người dùng:
${customRequest || "(không có)"}

Hãy tạo prompt hoàn chỉnh theo cấu trúc chuẩn Prompt Engineer.`;

  return { systemPrompt, userMessage };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const action = body.action || "generate";

    if (action === "get") {
      const userId = String(body.userId || "").trim().toLowerCase();
      const sessionId = String(body.sessionId || "").trim();
      if (!userId || !sessionId) {
        return NextResponse.json({ error: "Missing userId/sessionId" }, { status: 400 });
      }
      const supabase = createServerClient();
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "chatbot_generations")
        .single();
      let raw = data?.value;
      if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch { raw = []; }
      }
      const list: any[] = cleanupExpiredSessions(Array.isArray(raw) ? raw : []);
      const row = list.find((x) => x.id === sessionId && x.user_id === userId);
      if (!row) return NextResponse.json({ error: "Session not found" }, { status: 404 });
      await supabase
        .from("app_settings")
        .upsert({ key: SESSION_DB_KEY, value: list.slice(-1000) }, { onConflict: "key" });
      return NextResponse.json({
        ok: true,
        locked: !!row.locked,
        preview_result: row.preview_result,
        full_result: row.locked ? null : row.full_result,
        price: Number(row.price || 0),
      });
    }

    if (action === "unlock") {
      const userId = String(body.userId || "").trim().toLowerCase();
      const sessionId = String(body.sessionId || "").trim();
      const method = body.method || "wallet";
      if (!userId || !sessionId) {
        return NextResponse.json({ error: "Missing userId/sessionId" }, { status: 400 });
      }
      const supabase = createServerClient();
      const { data: genData } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", SESSION_DB_KEY)
        .single();
      let genRaw = genData?.value;
      if (typeof genRaw === "string") {
        try { genRaw = JSON.parse(genRaw); } catch { genRaw = []; }
      }
      const list: any[] = cleanupExpiredSessions(Array.isArray(genRaw) ? genRaw : []);
      const idx = list.findIndex((x) => x.id === sessionId && x.user_id === userId);
      if (idx === -1) return NextResponse.json({ error: "Session not found" }, { status: 404 });
      if (!list[idx].locked) {
        return NextResponse.json({ ok: true, alreadyUnlocked: true, full_result: list[idx].full_result });
      }
      const price = Number(list[idx].price || 0);

      if (method === "wallet") {
        const { data: balData } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "user_balances")
          .single();
        let balRaw = balData?.value;
        if (typeof balRaw === "string") {
          try { balRaw = JSON.parse(balRaw); } catch { balRaw = {}; }
        }
        const balances: Record<string, number> =
          balRaw && typeof balRaw === "object" && !Array.isArray(balRaw) ? balRaw : {};
        const current = Number(balances[userId] || 0);
        if (current < price) {
          return NextResponse.json({ error: "Số dư không đủ để mở khóa." }, { status: 400 });
        }
        balances[userId] = current - price;
        await supabase.from("app_settings").upsert(
          { key: "user_balances", value: balances },
          { onConflict: "key" }
        );
      } else {
        const { data: ents } = await supabase
          .from("user_plan_entitlements")
          .select("id, prompt_quota")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });
        let chosen: string | null = null;
        for (const e of ents || []) {
          const { count } = await supabase
            .from("user_plan_prompt_picks")
            .select("*", { count: "exact", head: true })
            .eq("entitlement_id", e.id);
          if ((count ?? 0) < Number(e.prompt_quota || 0)) {
            chosen = e.id;
            break;
          }
        }
        if (!chosen) {
          return NextResponse.json({ error: "Bạn đã dùng hết lượt gói." }, { status: 403 });
        }
        await supabase.from("user_plan_prompt_picks").insert({
          user_id: userId,
          entitlement_id: chosen,
          prompt_id: list[idx].prompt_id,
        });
      }

      list[idx].locked = false;
      list[idx].unlocked_at = new Date().toISOString();
      await supabase
        .from("app_settings")
        .upsert({ key: SESSION_DB_KEY, value: list.slice(-1000) }, { onConflict: "key" });
      return NextResponse.json({ ok: true, full_result: list[idx].full_result });
    }

    if (action === "history") {
      const userId = String(body.userId || "").trim().toLowerCase();
      if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      const supabase = createServerClient();
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", SESSION_DB_KEY)
        .single();
      let raw = data?.value;
      if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch { raw = []; }
      }
      const list: any[] = cleanupExpiredSessions(Array.isArray(raw) ? raw : []);
      const history = list
        .filter((x) => x.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 30)
        .map((x) => ({
          id: x.id,
          prompt_id: x.prompt_id,
          locked: !!x.locked,
          price: Number(x.price || 0),
          created_at: x.created_at,
          preview_result: String(x.preview_result || "").slice(0, 240),
        }));
      await supabase
        .from("app_settings")
        .upsert({ key: SESSION_DB_KEY, value: list.slice(-1000) }, { onConflict: "key" });
      return NextResponse.json({ ok: true, history });
    }

    // === FOLLOW-UP (multi-turn) ===
    if (action === "followup") {
      const userId = String(body.userId || "").trim().toLowerCase();
      const sessionId = String(body.sessionId || "").trim();
      const followUp = String(body.followUpMessage || "").trim();
      if (!userId || !sessionId || !followUp) {
        return NextResponse.json({ error: "Missing userId, sessionId, or followUpMessage" }, { status: 400 });
      }
      const supabase = createServerClient();
      const { data: genData } = await supabase
        .from("app_settings").select("value").eq("key", SESSION_DB_KEY).single();
      let genRaw = genData?.value;
      if (typeof genRaw === "string") { try { genRaw = JSON.parse(genRaw); } catch { genRaw = []; } }
      const list: any[] = cleanupExpiredSessions(Array.isArray(genRaw) ? genRaw : []);
      const row = list.find((x) => x.id === sessionId && x.user_id === userId);
      if (!row) return NextResponse.json({ error: "Session not found" }, { status: 404 });
      if (row.locked) return NextResponse.json({ error: "Mở khóa trước khi hỏi tiếp." }, { status: 403 });

      // Build conversation context
      const prevMessages = Array.isArray(row.messages) ? row.messages : [
        { role: "assistant" as const, content: row.full_result },
      ];
      const systemPrompt = `Bạn là chuyên gia Prompt Engineer. Người dùng đã nhận kết quả trước đó và muốn chỉnh sửa/bổ sung. Hãy tiếp tục hỗ trợ dựa trên ngữ cảnh trước. Trả lời bằng tiếng Việt, chuyên nghiệp, cấu trúc rõ ràng.`;
      const messages = [
        ...prevMessages.map((m: any) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: followUp },
      ];

      let result = "";
      try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error("No API key");
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: systemPrompt,
            messages,
          }),
        });
        if (!response.ok) throw new Error("Claude API error");
        const data = await response.json();
        result = data.content[0]?.text || "";
      } catch {
        try {
          result = await callOpenAI(systemPrompt, messages.map((m: any) => `[${m.role}]: ${m.content}`).join("\n\n"));
        } catch {
          return NextResponse.json({ error: "AI đang bận, thử lại sau." }, { status: 503 });
        }
      }

      // Save conversation messages
      const updatedMessages = [
        ...prevMessages,
        { role: "user", content: followUp },
        { role: "assistant", content: result },
      ].slice(-10); // Keep last 10 messages
      const idx = list.findIndex((x) => x.id === sessionId && x.user_id === userId);
      if (idx !== -1) {
        list[idx].messages = updatedMessages;
        list[idx].full_result = result;
      }
      await supabase.from("app_settings").upsert(
        { key: SESSION_DB_KEY, value: list.slice(-1000) },
        { onConflict: "key" }
      );

      return NextResponse.json({ ok: true, result, messages: updatedMessages });
    }

    // === FEEDBACK (thumbs up/down) ===
    if (action === "feedback") {
      const userId = String(body.userId || "").trim().toLowerCase();
      const sessionId = String(body.sessionId || "").trim();
      const rating = body.rating;
      if (!userId || !sessionId || !rating) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      const supabase = createServerClient();
      const { data: genData } = await supabase
        .from("app_settings").select("value").eq("key", SESSION_DB_KEY).single();
      let genRaw = genData?.value;
      if (typeof genRaw === "string") { try { genRaw = JSON.parse(genRaw); } catch { genRaw = []; } }
      const list: any[] = Array.isArray(genRaw) ? genRaw : [];
      const idx = list.findIndex((x) => x.id === sessionId && x.user_id === userId);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      list[idx].feedback = { rating, note: body.feedbackNote || "", at: new Date().toISOString() };
      await supabase.from("app_settings").upsert(
        { key: SESSION_DB_KEY, value: list.slice(-1000) },
        { onConflict: "key" }
      );
      return NextResponse.json({ ok: true });
    }

    // Validate required fields
    if (!body.variables) {
      return NextResponse.json(
        { error: "Missing required fields: variables" },
        { status: 400 }
      );
    }
    if (!String(body.promptContent || "").trim() && !String(body.customRequest || "").trim()) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu tạo nội dung. Vui lòng chọn prompt hoặc nhập yêu cầu tự do." },
        { status: 400 }
      );
    }

    const { systemPrompt, userMessage } = buildPrompts(body);
    let result = "";
    let provider = "";

    // Try Claude first, fallback to OpenAI
    try {
      result = await callClaude(systemPrompt, userMessage);
      provider = "claude";
    } catch (claudeError) {
      console.warn("Claude failed, trying OpenAI fallback:", claudeError);
      try {
        result = await callOpenAI(systemPrompt, userMessage);
        provider = "openai";
      } catch (openaiError) {
        console.error("Both AI providers failed:", openaiError);
        return NextResponse.json(
          { error: "Hệ thống AI đang bận. Vui lòng thử lại sau ít phút." },
          { status: 503 }
        );
      }
    }

    const userId = String(body.userId || "").trim().toLowerCase();
    const sessionId = crypto.randomUUID();
    const unlockPrice = resolveUnlockPrice(body.promptId, body.categoryId);
    const previewCut = Math.min(result.length, 280);
    const preview = result.slice(0, previewCut).trim();
    const locked = result.length > previewCut
      ? `${result.slice(previewCut, Math.min(result.length, previewCut + 180)).trim()} ...`
      : "Nội dung nâng cao đã được ẩn để mở khóa.";

    if (userId) {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", SESSION_DB_KEY)
        .single();
      let raw = data?.value;
      if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch { raw = []; }
      }
      const list: any[] = cleanupExpiredSessions(Array.isArray(raw) ? raw : []);
      // Per-user limit: keep max 50 sessions per user
      const userSessions = list.filter((x) => x.user_id === userId);
      if (userSessions.length >= 50) {
        const oldest = userSessions.sort((a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )[0];
        const removeIdx = list.findIndex((x) => x.id === oldest.id);
        if (removeIdx !== -1) list.splice(removeIdx, 1);
      }
      list.push({
        category_id: String(body.categoryId || ""),
        id: sessionId,
        user_id: userId,
        prompt_id: body.promptId,
        provider,
        price: unlockPrice,
        locked: true,
        preview_result: preview,
        locked_result: locked,
        full_result: result,
        messages: [{ role: "assistant", content: result }],
        created_at: new Date().toISOString(),
      });
      await supabase
        .from("app_settings")
        .upsert({ key: SESSION_DB_KEY, value: list.slice(-1000) }, { onConflict: "key" });
    }

    return NextResponse.json({
      success: true,
      sessionId,
      preview_result: preview,
      locked_result: locked,
      unlock_price: unlockPrice,
      provider,
      promptId: body.promptId,
    });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
