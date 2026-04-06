"use client";

import { useState, useRef, useMemo } from "react";
import { useAuthStore } from "@/lib/store";
import { prompts } from "@/data/prompts";
import {
  categoryVariables,
  getCategoryVariables,
  getCategoryIdFromPrompt,
} from "@/data/prompt-variables";
import type { Prompt } from "@/data/prompts";
import Link from "next/link";

/* ── message types (data, not JSX) ── */
type MsgType = "greeting-login" | "categories" | "prompts" | "form" | "loading" | "result" | "error" | "user";
interface ChatMsg {
  id: number;
  role: "bot" | "user";
  type: MsgType;
  text: string;
  payload?: unknown;
}

let _id = 0;
const nid = () => ++_id;

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [selCat, setSelCat] = useState<string | null>(null);
  const [selPrompt, setSelPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [previewResult, setPreviewResult] = useState("");
  const [lockedResult, setLockedResult] = useState("");
  const [fullResult, setFullResult] = useState("");
  const [unlockPrice, setUnlockPrice] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [planSlots, setPlanSlots] = useState(0);
  const [persona, setPersona] = useState<"expert" | "friendly" | "closer">("expert");
  const [memory, setMemory] = useState<Record<string, string>>({});
  const [lastVars, setLastVars] = useState<Record<string, string>>({});
  const [lastCatId, setLastCatId] = useState<string>("");
  const [lastPrompt, setLastPrompt] = useState<Prompt | null>(null);
  const [customRequest, setCustomRequest] = useState("");
  const [pulse, setPulse] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user } = useAuthStore();

  const availCats = useMemo(() => categoryVariables, []);
  const quickActions = useMemo(
    () => [
      { label: "Viết kịch bản TikTok", catId: "viet-content", hint: "Viết kịch bản TikTok cho sản phẩm của tôi" },
      { label: "Xử lý khách chê đắt", catId: "cham-soc-khach-hang", hint: "Xử lý khách chê giá đắt nhưng vẫn giữ biên lợi nhuận" },
      { label: "Tạo Prompt thiết kế ảnh", catId: "thiet-ke-anh", hint: "Tạo prompt thiết kế ảnh quảng cáo nổi bật" },
      { label: "Tạo Prompt chuẩn (PE)", catId: "marketing", hint: "Tôi muốn AI phỏng vấn tôi để tạo prompt chuẩn theo Role-Context-Task-Constraints-Output" },
    ],
    []
  );

  const scroll = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

  const push = (m: Omit<ChatMsg, "id">) => {
    setMsgs((prev) => [...prev, { ...m, id: nid() }]);
    scroll();
  };

  /* ── actions (plain functions, no useCallback) ── */
  function openChat() {
    setIsOpen(true);
    setPulse(false);
    if (msgs.length > 0) return;
    if (!isLoggedIn) { push({ role: "bot", type: "greeting-login", text: "" }); return; }
    showCategories();
  }

  function showCategories() {
    push({ role: "bot", type: "categories", text: "" });
  }

  function pickCategory(catId: string, catName: string) {
    setSelCat(catId);
    push({ role: "user", type: "user", text: catName });
    const list = prompts.filter((p) => getCategoryIdFromPrompt(p.category) === catId);
    push({ role: "bot", type: "prompts", text: "", payload: list });
  }

  function pickPrompt(p: Prompt) {
    setSelPrompt(p);
    push({ role: "user", type: "user", text: p.title });
    const catId = getCategoryIdFromPrompt(p.category) || "";
    const fields = getCategoryVariables(catId)?.fields || [];
    push({ role: "bot", type: "form", text: p.title, payload: { fields, prompt: p, catId } });
  }

  async function generate(prompt: Prompt, vars: Record<string, string>, catId: string) {
    const summary = Object.entries(vars).filter(([,v]) => v.trim()).map(([,v]) => v).join(", ");
    push({ role: "user", type: "user", text: summary || "Tạo kịch bản" });
    setLoading(true);
    const loadId = nid();
    setMsgs((prev) => [...prev, { id: loadId, role: "bot", type: "loading", text: "" }]);
    scroll();

    const personaHint =
      persona === "expert"
        ? "Giọng chuyên gia: logic, số liệu, rõ ràng."
        : persona === "friendly"
          ? "Giọng bạn bè: tự nhiên, gần gũi, có icon."
          : "Giọng sát thủ bán hàng: tập trung chốt đơn, CTA mạnh.";
    try {
      const catInfo = getCategoryVariables(catId);
      const res = await fetch("/api/tro-ly-ao/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          userId: user?.email || "",
          promptId: prompt.id,
          promptTitle: prompt.title,
          promptContent: prompt.fullContent || prompt.preview,
          category: `${catInfo?.categoryName || prompt.category} | ${personaHint}`,
          categoryId: catId,
          variables: { ...vars, persona },
          customRequest,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi");
      setSessionId(String(data.sessionId || ""));
      setPreviewResult(String(data.preview_result || ""));
      setLockedResult(String(data.locked_result || ""));
      setUnlockPrice(Number(data.unlock_price || 0));
      setFullResult("");
      setLastVars(vars);
      setLastCatId(catId);
      setLastPrompt(prompt);
      setMemory((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(vars).filter(([, v]) => String(v || "").trim())) }));
      setMsgs((prev) => prev.map((m) => m.id === loadId ? { ...m, type: "result" as MsgType, text: "paywall" } : m));
      if (user?.email) {
        const email = String(user.email).trim().toLowerCase();
        const [balRes, entRes] = await Promise.all([
          fetch(`/api/user/balance?email=${encodeURIComponent(email)}`, { cache: "no-store" }),
          fetch(`/api/user/plan-entitlements?userId=${encodeURIComponent(email)}`, { cache: "no-store" }),
        ]);
        const balJson = await balRes.json().catch(() => ({}));
        const entJson = await entRes.json().catch(() => ({}));
        setWalletBalance(Number(balJson?.balance || 0));
        setPlanSlots(Number(entJson?.totalPickSlotsRemaining || 0));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setMsgs((prev) => prev.map((m) => m.id === loadId ? { ...m, type: "error" as MsgType, text: msg } : m));
    } finally {
      setLoading(false);
      scroll();
    }
  }

  function useQuickAction(catId: string, text: string) {
    setCustomRequest(text);
    setSelCat(catId);
    push({ role: "user", type: "user", text });
    const list = prompts.filter((p) => getCategoryIdFromPrompt(p.category) === catId).slice(0, 8);
    push({ role: "bot", type: "prompts", text: "", payload: list });
  }

  async function applyQuickReply(instruction: string) {
    if (!lastPrompt || !lastCatId) return;
    const merged = {
      ...lastVars,
      quick_reply_instruction: instruction,
      previous_output: fullResult || previewResult,
    };
    await generate(lastPrompt, merged, lastCatId);
  }

  function reset() {
    setMsgs([]);
    setSelCat(null);
    setSelPrompt(null);
    setCopied(false);
    setSessionId("");
    setPreviewResult("");
    setLockedResult("");
    setFullResult("");
    setUnlockPrice(0);
    setCustomRequest("");
    setTimeout(() => showCategories(), 50);
  }

  async function unlock(method: "wallet" | "plan") {
    if (!sessionId || !user?.email || unlocking) return;
    setUnlocking(true);
    try {
      const res = await fetch("/api/tro-ly-ao/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unlock",
          sessionId,
          userId: String(user.email).trim().toLowerCase(),
          method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Không mở khóa được");
      setFullResult(String(data?.full_result || ""));
    } catch (e: any) {
      push({ role: "bot", type: "error", text: e?.message || "Không mở khóa được" });
    } finally {
      setUnlocking(false);
    }
  }

  /* ── render a single message ── */
  function renderMsg(m: ChatMsg) {
    switch (m.type) {
      case "greeting-login":
        return (
          <div>
            <p className="mb-3">Xin chào! Tôi là <strong>Trợ Lý Ảo AI</strong> của KhoPrompt.</p>
            <p className="text-slate-400 text-xs mb-3">Đăng nhập để sử dụng trợ lý ảo.</p>
            <Link href="/dang-nhap" className="inline-block px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 transition-all">Đăng nhập</Link>
          </div>
        );
      case "categories":
        return (
          <div>
            <p className="mb-3">Xin chào! Chọn lĩnh vực bạn cần hỗ trợ:</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => useQuickAction(q.catId, q.hint)}
                  className="px-2 py-1 rounded-md bg-brand-500/20 text-brand-300 text-[11px] font-semibold hover:bg-brand-500/30"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(availCats.length > 0 ? availCats : categoryVariables).map((cat) => {
                return (
                  <button key={cat.categoryId} onClick={() => pickCategory(cat.categoryId, cat.categoryName)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-slate-700/50 rounded-lg text-left hover:bg-slate-600/50 transition-all text-sm">
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-100 text-xs">{cat.categoryName}</div>
                      <div className="text-[10px] text-slate-500">AI hỗ trợ theo nhu cầu</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case "prompts": {
        const list = (m.payload || []) as Prompt[];
        return (
          <div>
            <p className="mb-3">Chọn tình huống bạn muốn AI hỗ trợ (AI sẽ phỏng vấn từng bước để tạo prompt chuẩn):</p>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {list.map((p) => (
                <button key={p.id} onClick={() => pickPrompt(p)}
                  className="text-left px-3 py-2 bg-slate-700/40 rounded-lg hover:bg-slate-600/50 transition-all">
                  <div className="font-semibold text-slate-100 text-xs hover:text-brand-400 leading-snug">{p.title}</div>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="Hoặc nhập yêu cầu tự do của bạn..."
                rows={2}
                className="w-full bg-slate-700/40 border border-slate-600/60 rounded-lg px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <Link href="/tro-ly-ao" className="inline-block mt-3 text-xs text-brand-400 hover:underline">
              Cần yêu cầu tự do? Mở trợ lý toàn màn hình
            </Link>
          </div>
        );
      }
      case "form": {
        const { fields, prompt: fp, catId } = m.payload as { fields: FieldDef[]; prompt: Prompt; catId: string };
        return (
          <div>
            <p className="mb-3">Nhập thông tin cho <strong className="text-brand-400">{m.text}</strong>:</p>
            <VariableForm
              fields={fields}
              initialValues={memory}
              promptTitle={fp.title}
              onSubmit={(vars) => generate(fp, vars, catId)}
            />
          </div>
        );
      }
      case "loading":
        return (
          <div className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-slate-300 text-sm">AI đang tạo kịch bản...</span>
          </div>
        );
      case "result":
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="text-[11px] text-green-400 font-semibold">Đã tạo kết quả preview</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-200 text-xs leading-relaxed max-h-48 overflow-y-auto">{fullResult || previewResult}</div>
            {!fullResult && (
              <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/50 p-2">
                <div className="text-[11px] text-slate-400 blur-sm select-none whitespace-pre-wrap">{lockedResult || "..."}</div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Mở khóa: <span className="text-brand-400 font-bold">{unlockPrice.toLocaleString("vi-VN")}₫</span> · Ví {walletBalance.toLocaleString("vi-VN")}₫ · Lượt {planSlots}
                </p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => unlock("wallet")} disabled={unlocking} className="flex-1 py-1.5 bg-brand-500 text-white text-[11px] font-bold rounded-lg disabled:opacity-60">Mở bằng ví</button>
                  <button onClick={() => unlock("plan")} disabled={unlocking || planSlots <= 0} className="flex-1 py-1.5 bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg disabled:opacity-60">Dùng lượt gói</button>
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => { if (!fullResult) return; navigator.clipboard.writeText(fullResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex-1 py-1.5 bg-slate-700/80 text-slate-300 text-[11px] font-semibold rounded-lg hover:bg-slate-600/80 transition-all disabled:opacity-50" disabled={!fullResult}>
                {!fullResult ? "Mở khóa để copy" : copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={reset}
                className="flex-1 py-1.5 bg-brand-600/80 text-white text-[11px] font-semibold rounded-lg hover:bg-brand-500/80 transition-all">
                Tạo mới
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {["Làm ngắn lại", "Thêm icon", "Đổi sang giọng hài hước"].map((x) => (
                <button
                  key={x}
                  onClick={() => applyQuickReply(x)}
                  className="px-2 py-1 rounded-md bg-slate-700 text-slate-200 text-[10px] font-semibold hover:bg-slate-600"
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        );
      case "error":
        return <p className="text-red-400 text-sm">{m.text}. <button onClick={reset} className="underline text-brand-400">Thử lại</button></p>;
      case "user":
        return <span>{m.text}</span>;
      default:
        return <span>{m.text}</span>;
    }
  }

  const hasResult = msgs.some((m) => m.type === "result");

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        className={`fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          isOpen ? "bg-slate-700" : "bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-500/40"
        } ${pulse && !isOpen ? "animate-bounce" : ""}`}
        aria-label="Trợ Lý Ảo AI"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[9998] w-[370px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-700 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">Trợ Lý Ảo AI</div>
              <div className="text-[11px] text-white/70">Powered by Claude &amp; GPT</div>
            </div>
            <div className="hidden sm:flex items-center gap-1 mr-1">
              {[
                { id: "expert", label: "Chuyên gia" },
                { id: "friendly", label: "Bạn bè" },
                { id: "closer", label: "Sát thủ" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id as "expert" | "friendly" | "closer")}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
                    persona === p.id ? "bg-white text-brand-700" : "bg-white/20 text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-brand-600 text-white rounded-br-md"
                    : "bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700/50"
                }`}>
                  {renderMsg(m)}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-700/50 bg-slate-900/80 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">KhoPrompt.pro</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const userMsgs = msgs.filter((x) => x.role === "user").slice(-6).map((x) => x.text);
                    const mem = Object.entries(memory).map(([k, v]) => `${k}: ${v}`).join(" | ");
                    push({
                      role: "bot",
                      type: "user",
                      text: `Tóm tắt: ${userMsgs.join(" -> ")}${mem ? ` | Memory: ${mem}` : ""}`,
                    });
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-300"
                >
                  Tóm tắt
                </button>
                {hasResult && (
                  <button onClick={reset} className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                    + Tạo kịch bản mới
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ── types ── */
interface FieldDef {
  key: string; label: string; placeholder: string;
  type: string; options?: string[]; required: boolean;
}

/* ── Variable Form sub-component ── */
function VariableForm({
  fields,
  initialValues,
  promptTitle,
  onSubmit,
}: {
  fields: FieldDef[];
  initialValues?: Record<string, string>;
  promptTitle?: string;
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [v, setV] = useState<Record<string, string>>(initialValues || {});
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1);
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));
  const preFieldsStep1: FieldDef[] = [
    { key: "industry", label: "Ngành hàng", placeholder: "", type: "select", options: ["Mỹ phẩm", "Thời trang", "F&B", "Giáo dục", "Bất động sản", "Dịch vụ"], required: true },
    { key: "product_type", label: "Loại sản phẩm/dịch vụ", placeholder: "", type: "select", options: ["Giá thấp", "Giá trung bình", "Giá cao", "Dịch vụ định kỳ", "Dịch vụ 1 lần"], required: true },
    { key: "target_audience", label: "Tệp khách mục tiêu", placeholder: "", type: "select", options: ["Khách mới", "Khách cũ", "Khách VIP", "Khách đang phân vân", "Khách khó tính"], required: true },
  ];
  const preFieldsStep2: FieldDef[] = [
    { key: "goal_type", label: "Mục tiêu chính", placeholder: "", type: "select", options: ["Tăng chuyển đổi", "Tăng tương tác", "Giữ chân khách", "Upsell/Cross-sell", "Xử lý từ chối"], required: true },
    { key: "channel", label: "Kênh sử dụng", placeholder: "", type: "select", options: ["Zalo", "Facebook", "TikTok", "Shopee/Lazada chat", "Email"], required: true },
    { key: "funnel_stage", label: "Giai đoạn khách hàng", placeholder: "", type: "select", options: ["Vừa tiếp cận", "Đã hỏi giá", "Đang so sánh", "Sắp chốt", "Sau mua"], required: true },
    { key: "priority_level", label: "Mức ưu tiên", placeholder: "", type: "select", options: ["Bình thường", "Ưu tiên cao", "Khẩn cấp"], required: true },
  ];
  const preFieldsStep3: FieldDef[] = [
    { key: "tone", label: "Giọng điệu", placeholder: "", type: "select", options: ["Chuyên gia", "Thân thiện", "Hài hước", "Sát thủ bán hàng"], required: true },
    { key: "output_style", label: "Kiểu đầu ra", placeholder: "", type: "select", options: ["Ngắn gọn", "Chi tiết", "Checklist", "Kịch bản", "Tin nhắn mẫu copy ngay"], required: true },
    { key: "cta_style", label: "Kiểu CTA", placeholder: "", type: "select", options: ["Mềm", "Trung bình", "Mạnh"], required: true },
  ];
  const dynamicFields = fields;
  const allFields = [...preFieldsStep1, ...preFieldsStep2, ...preFieldsStep3, ...dynamicFields];
  const submit = () => {
    const miss = allFields.filter((f) => f.required && !v[f.key]?.trim());
    if (miss.length) { setErr("Vui lòng điền: " + miss.map((f) => f.label).join(", ")); return; }
    setErr("");
    onSubmit(v);
  };
  const stepFields =
    step === 1
      ? preFieldsStep1
      : step === 2
        ? preFieldsStep2
        : step === 3
          ? preFieldsStep3
          : dynamicFields;
  return (
    <div className="space-y-3 mt-1">
      <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
        <span className={`px-2 py-0.5 rounded ${step === 1 ? "bg-brand-500/20 text-brand-300" : "bg-slate-700"}`}>1. Nền tảng</span>
        <span className={`px-2 py-0.5 rounded ${step === 2 ? "bg-brand-500/20 text-brand-300" : "bg-slate-700"}`}>2. Bối cảnh</span>
        <span className={`px-2 py-0.5 rounded ${step === 3 ? "bg-brand-500/20 text-brand-300" : "bg-slate-700"}`}>3. Phong cách</span>
        <span className={`px-2 py-0.5 rounded ${step === 4 ? "bg-brand-500/20 text-brand-300" : "bg-slate-700"}`}>4. Chi tiết</span>
      </div>
      <div className="max-h-52 overflow-y-auto pr-1 space-y-3">
        {stepFields.map((f) => (
          <div key={f.key}>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {f.label}{f.required && <span className="text-red-400"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea value={v[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder} rows={2}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none" />
            ) : f.type === "select" && f.options ? (
              <select value={v[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500">
                <option value="">-- Chọn --</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type="text" value={v[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
            )}
          </div>
        ))}
      </div>
      {err && <p className="text-red-400 text-[11px]">{err}</p>}
      <div className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-2">
        <p className="text-[10px] text-slate-400 mb-1">Realtime Preview (Khung Prompt Engineer)</p>
        <p className="text-[11px] text-slate-200">
          {promptTitle || "Prompt"}:{" "}
          {Object.entries(v)
            .filter(([, val]) => String(val || "").trim())
            .map(([k, val]) => `${k}=${val}`)
            .join(" | ") || "chưa có dữ liệu"}
        </p>
      </div>
      {step < 4 ? (
        <div className="mt-3 rounded-lg border border-brand-500/40 bg-slate-900 p-2 flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="px-3 py-2.5 bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg"
            >
              Quay lại
            </button>
          )}
          <button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-brand-600 text-white text-sm font-extrabold rounded-lg hover:shadow-lg hover:shadow-brand-500/30 transition-all"
          >
            Tiếp tục bước {step + 1}
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-brand-500/40 bg-slate-900 p-2 flex gap-2">
          <button
            onClick={() => setStep(3)}
            className="px-3 py-2.5 bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg"
          >
            Quay lại
          </button>
          <button onClick={submit}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-brand-600 text-white text-sm font-extrabold rounded-lg hover:shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Tạo Prompt hoàn chỉnh
          </button>
        </div>
      )}
    </div>
  );
}
