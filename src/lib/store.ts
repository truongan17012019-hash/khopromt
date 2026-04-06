import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Prompt } from "@/data/prompts";

export interface CartItem {
  prompt: Prompt;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (prompt: Prompt) => void;
  removeItem: (promptId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (prompt: Prompt) => {
        const items = get().items;
        const existing = items.find((item) => item.prompt.id === prompt.id);
        if (existing) return; // Prompt đã có trong giỏ
        set({ items: [...items, { prompt, quantity: 1 }] });
      },

      removeItem: (promptId: string) => {
        set({ items: get().items.filter((item) => item.prompt.id !== promptId) });
      },
      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.prompt.price, 0);
      },

      getTotalItems: () => get().items.length,
    }),
    {
      name: "promptvn_cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Auth store
interface AuthStore {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    role?: "admin" | "user";
    /** Supabase session access token when using JWT-backed APIs */
    access_token?: string;
  } | null;
  login: (name: string, email: string, role?: "admin" | "user", access_token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (name: string, email: string, role: "admin" | "user" = "user", access_token?: string) => {
        set({
          isLoggedIn: true,
          user: { name, email, role, ...(access_token ? { access_token } : {}) },
        });
      },
      logout: () => {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("promptvn_auth");
          }
        } catch {
          /* noop */
        }
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: "promptvn_auth",
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user }),
    }
  )
);

interface PurchaseStore {
  purchasedPromptIds: string[];
  markPurchased: (promptIds: string[]) => void;
  hasPurchased: (promptId: string) => boolean;
}

export const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set, get) => ({
      purchasedPromptIds: [],
      markPurchased: (promptIds: string[]) => {
        const merged = Array.from(new Set([...get().purchasedPromptIds, ...promptIds]));
        set({ purchasedPromptIds: merged });
      },
      hasPurchased: (promptId: string) => get().purchasedPromptIds.includes(promptId),
    }),
    {
      name: "promptvn_purchases",
      partialize: (state) => ({ purchasedPromptIds: state.purchasedPromptIds }),
    }
  )
);