export interface EnhanceOptions {
  prompt: string;
  tool: string;
  tone: string;
  language: string;
  industry?: string;
  role?: string;
  outputFormat?: string;
}

export interface EnhanceResult {
  enhanced: string;
  tips: string[];
  engine?: string;
}

const roleMap: Record<string, Record<string, string>> = {
  "chuyen-gia": { vi: "Bạn là chuyên gia hàng đầu trong lĩnh vực này với 15+ năm kinh nghiệm.", en: "You are a top expert in this field with 15+ years of experience." },
  "copywriter": { vi: "Bạn là copywriter chuyên nghiệp, viết nội dung hấp dẫn và thuyết phục.", en: "You are a professional copywriter creating compelling, persuasive content." },
  "developer": { vi: "Bạn là senior developer với kiến thức sâu về lập trình và kiến trúc phần mềm.", en: "You are a senior developer with deep knowledge of programming and software architecture." },
  "marketer": { vi: "Bạn là chuyên gia marketing digital với kinh nghiệm tăng trưởng đa nền tảng.", en: "You are a digital marketing expert with multi-platform growth experience." },
  "giao-vien": { vi: "Bạn là giáo viên giàu kinh nghiệm, giải thích dễ hiểu và có phương pháp.", en: "You are an experienced teacher who explains things clearly with structured methodology." },
  "nghien-cuu": { vi: "Bạn là nhà nghiên cứu học thuật với phương pháp luận chặt chẽ.", en: "You are an academic researcher with rigorous methodology." },
  "tu-van": { vi: "Bạn là nhà tư vấn chiến lược, phân tích vấn đề sâu sắc và đưa giải pháp.", en: "You are a strategic consultant who analyzes problems deeply and provides solutions." },
  "designer": { vi: "Bạn là designer sáng tạo với mắt thẩm mỹ tinh tế và hiểu UX/UI.", en: "You are a creative designer with a keen aesthetic eye and UX/UI understanding." },
  "data-analyst": { vi: "Bạn là chuyên gia phân tích dữ liệu, biến data thành insights actionable.", en: "You are a data analyst expert who turns data into actionable insights." },
  "content-creator": { vi: "Bạn là content creator đa nền tảng, tạo nội dung viral và engaging.", en: "You are a multi-platform content creator who makes viral, engaging content." },
};

const outputFormatMap: Record<string, Record<string, string>> = {
  "chi-tiet": { vi: "Trả lời chi tiết, đầy đủ với heading và bullet points.", en: "Provide detailed response with headings and bullet points." },
  "tom-tat": { vi: "Trả lời ngắn gọn, súc tích, tập trung vào ý chính.", en: "Provide concise summary focused on key points." },
  "buoc-buoc": { vi: "Trình bày theo từng bước cụ thể, dễ theo dõi.", en: "Present as step-by-step instructions, easy to follow." },
  "bang": { vi: "Trình bày dưới dạng bảng so sánh/tổng hợp.", en: "Present as a comparison/summary table." },
  "code": { vi: "Trả lời bằng code có comment giải thích chi tiết.", en: "Respond with code including detailed explanatory comments." },
  "email": { vi: "Viết dưới dạng email chuyên nghiệp.", en: "Write as a professional email." },
  "blog": { vi: "Viết dưới dạng bài blog hấp dẫn, có intro-body-conclusion.", en: "Write as an engaging blog post with intro-body-conclusion." },
};

const toneMap: Record<string, Record<string, string>> = {
  "chuyen-nghiep": { vi: "Sử dụng giọng điệu chuyên nghiệp, nghiêm túc.", en: "Use a professional, serious tone." },
  "sang-tao": { vi: "Sử dụng giọng điệu sáng tạo, độc đáo, bất ngờ.", en: "Use a creative, unique, surprising tone." },
  "hoc-thuat": { vi: "Sử dụng giọng điệu học thuật, có dẫn chứng.", en: "Use an academic tone with citations." },
  "than-thien": { vi: "Sử dụng giọng điệu thân thiện, gần gũi, dễ hiểu.", en: "Use a friendly, approachable, easy-to-understand tone." },
  "thuyet-phuc": { vi: "Sử dụng giọng điệu thuyết phục, có logic và cảm xúc.", en: "Use a persuasive tone with logic and emotion." },
  "hai-huoc": { vi: "Sử dụng giọng điệu hài hước, dí dỏm nhưng vẫn có giá trị.", en: "Use a humorous, witty tone while still providing value." },
  "trang-trong": { vi: "Sử dụng giọng điệu trang trọng, lịch sự, formal.", en: "Use a formal, polite, ceremonial tone." },
};

const toolTips: Record<string, string> = {
  chatgpt: "Đã tối ưu cấu trúc prompt cho ChatGPT với system message rõ ràng",
  claude: "Đã thêm hướng dẫn chi tiết phù hợp với Claude (phân tích sâu, context dài)",
  midjourney: "Đã thêm thông số Midjourney (--ar, --v, --s, --q, --style)",
  dalle: "Đã tối ưu mô tả hình ảnh chi tiết cho DALL-E",
  gemini: "Đã cấu trúc prompt phù hợp với Gemini (multimodal, Google integration)",
};

function buildSystemMessage(opts: EnhanceOptions): string {
  const lang = opts.language === "en" ? "en" : "vi";
  const roleTxt = opts.role && roleMap[opts.role] ? roleMap[opts.role][lang] : roleMap["chuyen-gia"][lang];
  const toneTxt = toneMap[opts.tone]?.[lang] || toneMap["chuyen-nghiep"][lang];
  const fmtTxt = opts.outputFormat && outputFormatMap[opts.outputFormat] ? outputFormatMap[opts.outputFormat][lang] : "";

  // CREAD Formula: Context - Role - Examples - Action - Details
  if (lang === "vi") {
    return `Bạn là chuyên gia nâng cấp prompt AI. ${roleTxt}

NHIỆM VỤ: Nhận prompt thô từ người dùng và biến nó thành prompt chuyên nghiệp, chi tiết, hiệu quả.

QUY TẮC CREAD:
- Context (Ngữ cảnh): Thêm bối cảnh rõ ràng cho prompt
- Role (Vai trò): Gán vai trò cụ thể cho AI
- Examples (Ví dụ): Thêm ví dụ minh họa nếu phù hợp
- Action (Hành động): Xác định rõ hành động cần thực hiện
- Details (Chi tiết): Bổ sung yêu cầu về format, độ dài, giọng điệu

${toneTxt}
${fmtTxt ? `YÊU CẦU FORMAT: ${fmtTxt}` : ""}
${opts.industry ? `NGÀNH: ${opts.industry}` : ""}

Công cụ AI mục tiêu: ${opts.tool}
CHỈ trả về prompt đã nâng cấp, KHÔNG giải thích.`;
  }
  return `You are an expert AI prompt engineer. ${roleTxt}

TASK: Take the user's raw prompt and transform it into a professional, detailed, effective prompt.

CREAD RULES:
- Context: Add clear context
- Role: Assign a specific role to the AI
- Examples: Add illustrative examples when appropriate
- Action: Define clear actions to perform
- Details: Add requirements for format, length, tone

${toneTxt}
${fmtTxt ? `FORMAT: ${fmtTxt}` : ""}
${opts.industry ? `INDUSTRY: ${opts.industry}` : ""}

Target AI tool: ${opts.tool}
ONLY return the enhanced prompt, NO explanations.`;
}

export async function enhanceWithOpenAI(opts: EnhanceOptions): Promise<EnhanceResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const systemMsg = buildSystemMessage(opts);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: opts.prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim();
    if (!enhanced) return null;
    const tips = ["Đã sử dụng AI (GPT-4o-mini) để nâng cấp", "Áp dụng công thức CREAD"];
    if (opts.role) tips.push(`Vai trò: ${roleMap[opts.role]?.vi || opts.role}`);
    if (toolTips[opts.tool]) tips.push(toolTips[opts.tool]);
    return { enhanced, tips, engine: "openai" };
  } catch { return null; }
}

export async function enhanceWithClaude(opts: EnhanceOptions): Promise<EnhanceResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const systemMsg = buildSystemMessage(opts);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemMsg,
        messages: [{ role: "user", content: opts.prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const enhanced = data.content?.[0]?.text?.trim();
    if (!enhanced) return null;
    const tips = ["Đã sử dụng AI (Claude) để nâng cấp", "Áp dụng công thức CREAD"];
    if (opts.role) tips.push(`Vai trò: ${roleMap[opts.role]?.vi || opts.role}`);
    if (toolTips[opts.tool]) tips.push(toolTips[opts.tool]);
    return { enhanced, tips, engine: "claude" };
  } catch { return null; }
}

export function enhanceRuleBased(opts: EnhanceOptions): EnhanceResult {
  const { prompt, tool, tone, language } = opts;
  const lang = language === "en" ? "en" : "vi";
  const tips: string[] = [];
  let enhanced = "";
  const roleTxt = opts.role && roleMap[opts.role] ? roleMap[opts.role][lang] : roleMap["chuyen-gia"][lang];
  enhanced += (lang === "vi" ? "## Vai trò\n" : "## Role\n") + roleTxt + "\n\n";
  tips.push("Đã thêm vai trò chuyên nghiệp");
  enhanced += (lang === "vi" ? "## Ngữ cảnh\n" : "## Context\n");
  enhanced += lang === "vi"
    ? "Tôi cần bạn giúp tôi với yêu cầu sau. Hãy phân tích kỹ và đưa ra kết quả chất lượng cao nhất.\n\n"
    : "I need your help with the following request. Please analyze carefully and provide the highest quality result.\n\n";
  tips.push("Đã thêm ngữ cảnh rõ ràng");
  enhanced += (lang === "vi" ? "## Yêu cầu chính\n" : "## Main Task\n") + prompt + "\n\n";
  if (tool === "midjourney") {
    enhanced += "## Parameters\n- Detailed visual description\n- --ar 16:9 --v 6 --s 750 --q 2\n- Lighting, angle, style\n\n";
    tips.push("Đã thêm thông số Midjourney");
  } else if (tool === "dalle") {
    enhanced += "## Image Details\n- Subject, background, lighting, art style\n- Resolution and aspect ratio\n\n";
    tips.push("Đã tối ưu cho DALL-E");
  } else {
    const fmtTxt = opts.outputFormat && outputFormatMap[opts.outputFormat] ? outputFormatMap[opts.outputFormat][lang] : "";
    enhanced += (lang === "vi" ? "## Yêu cầu định dạng\n" : "## Format Requirements\n");
    enhanced += fmtTxt ? fmtTxt + "\n\n" : (lang === "vi" ? "- Trình bày rõ ràng với heading và bullet points\n- Sử dụng ví dụ cụ thể\n\n" : "- Present clearly with headings and bullet points\n- Use specific examples\n\n");
    tips.push("Đã thêm yêu cầu định dạng");
  }
  enhanced += (lang === "vi" ? "## Kiểm tra chất lượng\n- Đảm bảo chính xác\n- Logic nhất quán\n" : "## Quality Check\n- Ensure accuracy\n- Logical consistency\n");
  tips.push("Đã thêm kiểm tra chất lượng");
  if (toolTips[tool]) tips.push(toolTips[tool]);
  return { enhanced, tips, engine: "rule-based" };
}

export async function enhancePrompt(opts: EnhanceOptions): Promise<EnhanceResult> {
  // Chain: OpenAI (primary) → Claude (fallback) → Rule-based (final)
  const openaiResult = await enhanceWithOpenAI(opts);
  if (openaiResult) return openaiResult;
  const claudeResult = await enhanceWithClaude(opts);
  if (claudeResult) return claudeResult;
  return enhanceRuleBased(opts);
}
