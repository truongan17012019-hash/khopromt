"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Date.now().toString();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 3000);
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-brand-600 text-white"
          }`}
        >
          <span>
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          {toast.message}
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

/** Single inline toast (default export) for pages that use local `toast` state */
export type ToastProps = {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
};

export default function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
          type === "success"
            ? "bg-green-500 text-white"
            : type === "error"
              ? "bg-red-500 text-white"
              : "bg-brand-600 text-white"
        }`}
      >
        <span>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="opacity-70 hover:opacity-100"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  );
}