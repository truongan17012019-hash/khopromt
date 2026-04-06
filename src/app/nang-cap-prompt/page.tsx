"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

/* ── Data ─────────────────────────────────────────── */
const tools = [
  { id: "chatgpt", name: "ChatGPT", icon: "🤖" },
  { id: "claude", name: "Claude", icon: "🧠" },
  { id: "midjourney", name: "Midjourney", icon: "🎨" },
  { id: "dalle", name: "DALL-E", icon: "🖼️" },
  { id: "gemini", name: "Gemini", icon: "✨" },
];
const roles = [
  { id: "chuyen-gia", name: "Chuyên gia" },
  { id: "copywriter", name: "Copywriter" },
  { id: "developer", name: "Developer" },
  { id: "marketer", name: "Marketer" },
  { id: "giao-vien", name: "Giáo viên" },
  { id: "nghien-cuu", name: "Nghiên cứu" },
  { id: "tu-van", name: "Tư vấn" },
  { id: "designer", name: "Designer" },
  { id: "data-analyst", name: "Data Analyst" },
  { id: "content-creator", name: "Content Creator" },
];
const tones = [
  { id: "chuyen-nghiep", name: "Chuyên nghiệp" },
  { id: "sang-tao", name: "Sáng tạo" },
  { id: "hoc-thuat", name: "Học thuật" },
  { id: "than-thien", name: "Thân thiện" },
  { id: "thuyet-phuc", name: "Thuyết phục" },
  { id: "hai-huoc", name: "Hài hước" },
  { id: "trang-trong", name: "Trang trọng" },
];
const outputFormats = [
  { id: "chi-tiet", name: "Chi tiết" },
  { id: "tom-tat", name: "Tóm tắt" },
  { id: "buoc-buoc", name: "Từng bước" },
  { id: "bang", name: "Bảng" },
  { id: "code", name: "Code" },
  { id: "email", name: "Email" },
  { id: "blog", name: "Blog" },
];
const industries = [
  { id: "cong-nghe", name: "Công nghệ" },
  { id: "marketing", name: "Marketing" },
  { id: "giao-duc", name: "Giáo dục" },
  { id: "y-te", name: "Y tế" },
  { id: "tai-chinh", name: "Tài chính" },
  { id: "thuong-mai", name: "Thương mại" },
  { id: "bat-dong-san", name: "Bất động sản" },
  { id: "nha-hang", name: "Nhà hàng" },
  { id: "du-lich", name: "Du lịch" },
  { id: "truyen-thong", name: "Truyền thông" },
];
const langs = [{ id: "vi", name: "Tiếng Việt" }, { id: "en", name: "English" }];

/* ── Prompt Templates ─────────────────────────────── */
const promptTemplates = [
  { id: 1, cat: "marketing", title: "Bài viết SEO", prompt: "Viết bài blog chuẩn SEO về [chủ đề], 1500 từ, có heading H2/H3, meta description" },
  { id: 2, cat: "marketing", title: "Quảng cáo Facebook", prompt: "Viết 3 mẫu quảng cáo Facebook cho sản phẩm [tên SP], nhắm đến [đối tượng]" },
  { id: 3, cat: "marketing", title: "Email Marketing", prompt: "Viết email marketing giới thiệu [sản phẩm/dịch vụ] với subject line hấp dẫn" },
  { id: 4, cat: "cong-nghe", title: "Review Code", prompt: "Review đoạn code sau, chỉ ra bugs, đề xuất cải thiện performance và best practices" },
  { id: 5, cat: "cong-nghe", title: "Thiết kế Database", prompt: "Thiết kế database schema cho ứng dụng [mô tả app], bao gồm ERD và SQL" },
  { id: 6, cat: "cong-nghe", title: "API Documentation", prompt: "Viết API documentation cho endpoint [mô tả], bao gồm request/response examples" },
  { id: 7, cat: "giao-duc", title: "Giáo án bài giảng", prompt: "Tạo giáo án bài giảng về [chủ đề] cho [đối tượng], thời lượng [X] phút" },
  { id: 8, cat: "giao-duc", title: "Đề thi trắc nghiệm", prompt: "Tạo 20 câu trắc nghiệm về [chủ đề], 4 đáp án, có đáp án và giải thích" },
  { id: 9, cat: "tai-chinh", title: "Phân tích tài chính", prompt: "Phân tích báo cáo tài chính của [công ty], đánh giá sức khỏe tài chính" },
  { id: 10, cat: "tai-chinh", title: "Kế hoạch kinh doanh", prompt: "Lập kế hoạch kinh doanh cho [dự án], bao gồm SWOT, tài chính dự kiến" },
  { id: 11, cat: "y-te", title: "Tư vấn sức khỏe", prompt: "Tạo nội dung tư vấn sức khỏe về [chủ đề], dễ hiểu cho người đọc phổ thông" },
  { id: 12, cat: "thuong-mai", title: "Mô tả sản phẩm", prompt: "Viết mô tả sản phẩm hấp dẫn cho [SP] trên sàn TMĐT, tối ưu chuyển đổi" },
  { id: 13, cat: "bat-dong-san", title: "Tin đăng BĐS", prompt: "Viết tin đăng bất động sản cho [loại BĐS] tại [vị trí], nổi bật ưu điểm" },
  { id: 14, cat: "du-lich", title: "Lịch trình du lịch", prompt: "Lên lịch trình du lịch [địa điểm] trong [X] ngày, bao gồm chi phí ước tính" },
  { id: 15, cat: "truyen-thong", title: "Thông cáo báo chí", prompt: "Viết thông cáo báo chí về [sự kiện/ra mắt SP], chuẩn format báo chí" },
  { id: 16, cat: "nha-hang", title: "Menu & mô tả món", prompt: "Viết mô tả menu hấp dẫn cho nhà hàng [loại], bao gồm [X] món" },
];

/* ── ChipGroup component ─────────────────────────── */
function ChipGroup({ items, value, onChange, label }: {
  items: { id: string; name: string; icon?: string }[];
  value: string; onChange: (v: string) => void; label: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {items.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${value === t.id ? "bg-primary-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t.icon ? `${t.icon} ` : ""}{t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── History type ─────────────────────────────────── */
interface HistoryItem {
  id: number; date: string; input: string; output: string;
  tool: string; tone: string; engine?: string;
}

export default function PromptEnhancerPage() {
  const { isLoggedIn, user } = useAuthStore();
  /* ── State ── */
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tips, setTips] = useState<string[]>([]);
  const [tool, setTool] = useState("chatgpt");
  const [tone, setTone] = useState("chuyen-nghiep");
  const [lang, setLang] = useState("vi");
  const [role, setRole] = useState("chuyen-gia");
  const [outputFormat, setOutputFormat] = useState("chi-tiet");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [engine, setEngine] = useState("");
  const [tab, setTab] = useState<"enhance" | "test" | "history" | "templates">("enhance");
  /* Interactive Mode */
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState<"idle" | "questions" | "answering">("idle");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  /* Quick Test */
  const [testInput, setTestInput] = useState("");
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const testEndRef = useRef<HTMLDivElement>(null);
  /* History */
  const [history, setHistory] = useState<HistoryItem[]>([]);
  /* Templates */
  const [templateCat, setTemplateCat] = useState("all");

  /* Load history from localStorage */
  useEffect(() => {
    try { const h = localStorage.getItem("pe_history"); if (h) setHistory(JSON.parse(h)); } catch {}
  }, []);
  const saveHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 50);
    setHistory(updated);
    try { localStorage.setItem("pe_history", JSON.stringify(updated)); } catch {}
  };
  useEffect(() => { testEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [testMessages]);

  /* ── Interactive Mode: get questions ── */
  const startInteractive = async () => {
    if (input.length < 5) { setError("Prompt quá ngắn (tối thiểu 5 ký tự)"); return; }
    setQuestionsLoading(true); setError("");
    try {
      const res = await fetch("/api/prompt-enhancer/interactive", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, tool, language: lang }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
      setAnswers(new Array((data.questions || []).length).fill(""));
      setInteractiveStep("questions");
    } catch { setError("Lỗi kết nối"); }
    setQuestionsLoading(false);
  };

  /* ── Enhance (with or without interactive answers) ── */
  const enhance = async (extraContext?: string) => {
    if (!isLoggedIn) { setError("Vui lòng đăng nhập để sử dụng"); return; }
    if (input.length < 5) { setError("Prompt quá ngắn (tối thiểu 5 ký tự)"); return; }
    setLoading(true); setError(""); setOutput(""); setTips([]);
    const fullPrompt = extraContext ? `${input}\n\nThông tin bổ sung:\n${extraContext}` : input;
    try {
      const res = await fetch("/api/prompt-enhancer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, tool, tone, language: lang, role, outputFormat, industry: industry || undefined, email: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Có lỗi xảy ra"); setLoading(false); return; }
      setOutput(data.enhanced); setTips(data.tips || []); setBalance(data.newBalance); setEngine(data.engine || "");
      saveHistory({ id: Date.now(), date: new Date().toLocaleString("vi-VN"), input, output: data.enhanced, tool, tone, engine: data.engine });
      setInteractiveStep("idle"); setQuestions([]); setAnswers([]);
    } catch { setError("Lỗi kết nối"); }
    setLoading(false);
  };

  const enhanceWithAnswers = () => {
    const ctx = questions.map((q, i) => `${q}\n→ ${answers[i] || "(không trả lời)"}`).join("\n\n");
    enhance(ctx);
  };

  /* ── Quick Test ── */
  const sendTest = async () => {
    if (!testInput.trim()) return;
    const userMsg = testInput.trim(); setTestInput("");
    setTestMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setTestLoading(true);
    try {
      const res = await fetch("/api/prompt-enhancer/test", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setTestMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "Không có phản hồi" }]);
    } catch { setTestMessages(prev => [...prev, { role: "assistant", content: "Lỗi kết nối" }]); }
    setTestLoading(false);
  };

  /* ── Send to external AI ── */
  const sendToExternal = (target: "chatgpt" | "claude" | "gemini") => {
    const text = encodeURIComponent(output || input);
    const urls: Record<string, string> = {
      chatgpt: `https://chat.openai.com/?q=${text}`,
      claude: `https://claude.ai/new?q=${text}`,
      gemini: `https://gemini.google.com/app?q=${text}`,
    };
    window.open(urls[target], "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const filteredTemplates = templateCat === "all" ? promptTemplates : promptTemplates.filter(t => t.cat === templateCat);

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-primary-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
            {engine ? `⚡ AI Powered (${engine})` : "⚡ AI Powered"}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Nâng Cấp Prompt <span className="text-yellow-300">AI</span></h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Biến prompt thô thành prompt chuyên nghiệp — Kết quả tốt hơn 10x</p>
          <p className="text-white/60 text-sm mt-2">Chi phí: 2,000đ / lần {balance !== null ? `· Số dư: ${balance.toLocaleString()}đ` : ""}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1 mb-6 max-w-2xl mx-auto">
          {([["enhance", "✨ Nâng cấp"], ["templates", "📋 Templates"], ["test", "🧪 Quick Test"], ["history", "📜 Lịch sử"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === k ? "bg-primary-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ═══ TAB: ENHANCE ═══ */}
        {tab === "enhance" && (<>
          {/* Options */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ChipGroup items={tools} value={tool} onChange={setTool} label="Công cụ AI" />
              <ChipGroup items={roles} value={role} onChange={setRole} label="Vai trò (Act as...)" />
              <ChipGroup items={tones} value={tone} onChange={setTone} label="Giọng điệu" />
              <ChipGroup items={outputFormats} value={outputFormat} onChange={setOutputFormat} label="Định dạng đầu ra" />
              <ChipGroup items={industries} value={industry} onChange={setIndustry} label="Ngành (tuỳ chọn)" />
              <ChipGroup items={langs} value={lang} onChange={setLang} label="Ngôn ngữ" />
            </div>
            {/* Interactive Mode toggle */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={interactiveMode} onChange={e => setInteractiveMode(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
              <span className="text-sm text-gray-700 font-medium">Interactive Mode</span>
              <span className="text-xs text-gray-400">— AI hỏi bạn trước khi nâng cấp</span>
            </div>
          </div>

          {/* Input / Output side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* INPUT */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-3">Prompt gốc</h2>
              <textarea value={input} onChange={e => setInput(e.target.value)} rows={7}
                placeholder="Nhập prompt bạn muốn nâng cấp..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{input.length} ký tự</span>
                <button onClick={() => interactiveMode ? startInteractive() : enhance()}
                  disabled={loading || questionsLoading || !input}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
                  {loading ? "Đang nâng cấp..." : questionsLoading ? "Đang phân tích..." : interactiveMode ? "🎯 Phân tích & Hỏi" : "✨ Nâng cấp ngay"}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Interactive questions */}
              {interactiveStep === "questions" && questions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-sm font-semibold text-primary-700">AI cần thêm thông tin:</p>
                  {questions.map((q, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-700 mb-1">{i + 1}. {q}</p>
                      <input type="text" value={answers[i] || ""} onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                        placeholder="Trả lời..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                    </div>
                  ))}
                  <button onClick={enhanceWithAnswers} disabled={loading}
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                    {loading ? "Đang nâng cấp..." : "✨ Nâng cấp với thông tin bổ sung"}
                  </button>
                </div>
              )}
            </div>

            {/* OUTPUT */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900">Prompt đã nâng cấp</h2>
                {output && <button onClick={() => copyToClipboard(output)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">{copied ? "Đã sao chép!" : "📋 Sao chép"}</button>}
              </div>
              {loading ? (
                <div className="h-48 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>
              ) : output ? (
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-xl max-h-72 overflow-y-auto font-sans">{output}</pre>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Kết quả sẽ hiển thị ở đây</div>
              )}
              {tips.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1.5">Đã cải thiện:</h3>
                  {tips.map((tip, i) => <p key={i} className="text-xs text-green-600">✓ {tip}</p>)}
                </div>
              )}
              {/* Send to external AI buttons */}
              {output && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Gửi đến:</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => sendToExternal("chatgpt")} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition">🤖 ChatGPT</button>
                    <button onClick={() => sendToExternal("claude")} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition">🧠 Claude</button>
                    <button onClick={() => sendToExternal("gemini")} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">✨ Gemini</button>
                    <button onClick={() => { setTestInput(output); setTab("test"); }} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition">🧪 Test ngay</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isLoggedIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-yellow-800">Bạn cần <Link href="/dang-nhap" className="text-primary-600 font-semibold hover:underline">đăng nhập</Link> để sử dụng tính năng này</p>
            </div>
          )}
        </>)}

        {/* ═══ TAB: TEMPLATES ═══ */}
        {tab === "templates" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              <button onClick={() => setTemplateCat("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${templateCat === "all" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>Tất cả</button>
              {industries.map(ind => (
                <button key={ind.id} onClick={() => setTemplateCat(ind.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${templateCat === ind.id ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>{ind.name}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <div key={t.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{t.title}</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{industries.find(i => i.id === t.cat)?.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{t.prompt}</p>
                  <button onClick={() => { setInput(t.prompt); setTab("enhance"); }}
                    className="w-full py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition opacity-0 group-hover:opacity-100">
                    Sử dụng template này
                  </button>
                </div>
              ))}
            </div>
            {filteredTemplates.length === 0 && <p className="text-center text-gray-400 py-12 text-sm">Chưa có template cho ngành này</p>}
          </div>
        )}

        {/* ═══ TAB: QUICK TEST ═══ */}
        {tab === "test" && (
          <div className="bg-white rounded-2xl shadow-sm p-5 max-w-3xl mx-auto">
            <h2 className="font-bold text-gray-900 mb-3">Quick Test — Thử prompt ngay</h2>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[300px] max-h-[450px] overflow-y-auto mb-3 space-y-3">
              {testMessages.length === 0 && <p className="text-gray-400 text-sm text-center py-12">Gửi prompt để test kết quả với GPT-4o-mini</p>}
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {testLoading && <div className="flex justify-start"><div className="bg-white border border-gray-200 px-4 py-2 rounded-xl"><div className="animate-pulse text-gray-400 text-sm">Đang trả lời...</div></div></div>}
              <div ref={testEndRef} />
            </div>
            <div className="flex gap-2">
              <textarea value={testInput} onChange={e => setTestInput(e.target.value)} rows={2} placeholder="Nhập prompt để test..."
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendTest(); } }}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
              <button onClick={sendTest} disabled={testLoading || !testInput.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 disabled:opacity-50 transition self-end">Gửi</button>
            </div>
          </div>
        )}

        {/* ═══ TAB: HISTORY ═══ */}
        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <p className="text-center text-gray-400 py-16 text-sm">Chưa có lịch sử nâng cấp</p>
            ) : (
              <div className="space-y-3">
                {history.map(h => (
                  <div key={h.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{h.date}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{h.tool}</span>
                        {h.engine && <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{h.engine}</span>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setInput(h.input); setOutput(h.output); setTab("enhance"); }}
                          className="text-xs text-primary-600 hover:underline">Dùng lại</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => copyToClipboard(h.output)} className="text-xs text-gray-500 hover:text-gray-700">Sao chép</button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1 truncate"><strong>Gốc:</strong> {h.input}</p>
                    <p className="text-sm text-gray-700 line-clamp-2"><strong>Nâng cấp:</strong> {h.output}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
