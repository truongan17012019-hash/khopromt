"use client";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

interface Message { role: "user" | "assistant"; content: string; }

export default function TroLyAoPage() {
  const { isLoggedIn } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load conversation from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tla_messages");
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  // Save on change
  useEffect(() => {
    try { localStorage.setItem("tla_messages", JSON.stringify(messages)); } catch {}
  }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/tro-ly-ao", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "Lỗi" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Lỗi kết nối. Vui lòng thử lại." }]);
    }
    setLoading(false);
  };

  const clearChat = () => { setMessages([]); localStorage.removeItem("tla_messages"); };

  const exportChat = () => {
    const text = messages.map(m => `${m.role === "user" ? "Bạn" : "AI"}: ${m.content}`).join("\n\n---\n\n");
    const blob = new Blob([`Cuộc trò chuyện - Trợ lý AI PromptVN\nXuất: ${new Date().toLocaleString("vi-VN")}\n\n${"=".repeat(50)}\n\n${text}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `tro-ly-ai-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="bg-gradient-to-r from-blue-600 via-primary-600 to-cyan-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Trợ lý AI <span className="text-yellow-300">PromptVN</span></h1>
          <p className="text-white/80">Chat với AI thông minh — Nhớ ngữ cảnh cuộc trò chuyện</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!isLoggedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-yellow-800 text-sm">
              <Link href="/dang-nhap" className="text-primary-600 font-semibold hover:underline">Đăng nhập</Link> để lưu lịch sử trò chuyện
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">{messages.length} tin nhắn</span>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <>
                <button onClick={exportChat} className="px-3 py-1.5 bg-white text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition shadow-sm">📥 Xuất file</button>
                <button onClick={clearChat} className="px-3 py-1.5 bg-white text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition shadow-sm">🗑️ Xóa chat</button>
              </>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 min-h-[400px] max-h-[550px] overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🤖</p>
                <p className="text-gray-500 text-sm">Xin chào! Tôi là Trợ lý AI của PromptVN.</p>
                <p className="text-gray-400 text-xs mt-1">Hãy hỏi tôi bất cứ điều gì — tôi nhớ cả cuộc trò chuyện.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user" ? "bg-primary-600 text-white rounded-br-md" : "bg-gray-100 text-gray-700 rounded-bl-md"}`}>
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.15s"}} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.3s"}} /></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={1} placeholder="Nhập tin nhắn..."
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 disabled:opacity-50 transition">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
